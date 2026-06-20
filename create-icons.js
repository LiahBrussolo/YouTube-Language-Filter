// Generates icons/icon16.png, icons/icon48.png, icons/icon128.png
// Run once: node create-icons.js
'use strict';

const zlib = require('zlib');
const fs   = require('fs');
const path = require('path');

function crc32(buf) {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = (c & 1) ? 0xEDB88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c;
  }
  let crc = 0xFFFFFFFF;
  for (const b of buf) crc = t[(crc ^ b) & 0xFF] ^ (crc >>> 8);
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

function pngChunk(type, data) {
  const len    = Buffer.allocUnsafe(4);
  const crcBuf = Buffer.allocUnsafe(4);
  len.writeUInt32BE(data.length);
  const t = Buffer.from(type, 'ascii');
  crcBuf.writeUInt32BE(crc32(Buffer.concat([t, data])));
  return Buffer.concat([len, t, data, crcBuf]);
}

function drawIcon(size) {
  const pixels = Buffer.alloc(size * size * 4, 0); // start fully transparent
  const s = size / 16; // all coords below are in 16-unit design space

  // Porter-Duff "over" composite
  function setPixel(px, py, r, g, b, a = 255) {
    px = Math.round(px); py = Math.round(py);
    if (px < 0 || px >= size || py < 0 || py >= size) return;
    const i   = (py * size + px) * 4;
    const srcA = a / 255, dstA = pixels[i + 3] / 255;
    const outA = srcA + dstA * (1 - srcA);
    if (outA < 1 / 255) return;
    pixels[i]     = Math.round((r * srcA + pixels[i]     * dstA * (1 - srcA)) / outA);
    pixels[i + 1] = Math.round((g * srcA + pixels[i + 1] * dstA * (1 - srcA)) / outA);
    pixels[i + 2] = Math.round((b * srcA + pixels[i + 2] * dstA * (1 - srcA)) / outA);
    pixels[i + 3] = Math.round(outA * 255);
  }

  // Antialiased filled rounded rectangle
  function fillRoundRect(x, y, w, h, rx, r, g, b) {
    const X = x * s, Y = y * s, W = w * s, H = h * s, RX = rx * s;
    for (let py = 0; py < size; py++) {
      for (let px = 0; px < size; px++) {
        const dx = Math.max(X + RX - px, 0, px - (X + W - RX));
        const dy = Math.max(Y + RX - py, 0, py - (Y + H - RX));
        const dist = Math.sqrt(dx * dx + dy * dy);
        const alpha = Math.max(0, Math.min(1, RX + 0.5 - dist));
        if (alpha > 0) setPixel(px, py, r, g, b, Math.round(alpha * 255));
      }
    }
  }

  // Antialiased circle stroke
  function strokeCircle(cx, cy, radius, lw, r, g, b) {
    const CX = cx * s, CY = cy * s, R = radius * s, T = lw * s;
    const bound = Math.ceil(R + T + 1);
    const x0 = Math.max(0, Math.floor(CX - bound)), x1 = Math.min(size - 1, Math.ceil(CX + bound));
    const y0 = Math.max(0, Math.floor(CY - bound)), y1 = Math.min(size - 1, Math.ceil(CY + bound));
    for (let py = y0; py <= y1; py++) {
      for (let px = x0; px <= x1; px++) {
        const dist  = Math.sqrt((px - CX) ** 2 + (py - CY) ** 2);
        const alpha = Math.max(0, Math.min(1,
          Math.min(dist - (R - T / 2) + 0.5, (R + T / 2) - dist + 0.5)
        ));
        if (alpha > 0) setPixel(px, py, r, g, b, Math.round(alpha * 255));
      }
    }
  }

  // Antialiased line segment, clipped to a circle
  function drawLine(x1, y1, x2, y2, lw, r, g, b, ccx, ccy, ccr) {
    const X1 = x1*s, Y1 = y1*s, X2 = x2*s, Y2 = y2*s, T = lw*s;
    const CCX = ccx*s, CCY = ccy*s, CCR = ccr*s;
    const dx = X2 - X1, dy = Y2 - Y1;
    const len = Math.sqrt(dx * dx + dy * dy) || 1;
    const x0 = Math.max(0, Math.floor(Math.min(X1, X2) - T - 1));
    const xN = Math.min(size-1, Math.ceil(Math.max(X1, X2) + T + 1));
    const y0 = Math.max(0, Math.floor(Math.min(Y1, Y2) - T - 1));
    const yN = Math.min(size-1, Math.ceil(Math.max(Y1, Y2) + T + 1));
    for (let py = y0; py <= yN; py++) {
      for (let px = x0; px <= xN; px++) {
        if ((px - CCX) ** 2 + (py - CCY) ** 2 > (CCR + 0.5) ** 2) continue;
        const t    = Math.max(0, Math.min(1, ((px - X1) * dx + (py - Y1) * dy) / (len * len)));
        const dist = Math.sqrt((X1 + t * dx - px) ** 2 + (Y1 + t * dy - py) ** 2);
        const alpha = Math.max(0, Math.min(1, T / 2 - dist + 0.5));
        if (alpha > 0) setPixel(px, py, r, g, b, Math.round(alpha * 255));
      }
    }
  }

  // Antialiased ellipse stroke via gradient-distance approximation, clipped to circle.
  // Uses the identity: dist ≈ |f(p)−1| / (2‖∇f(p)‖) where f(x,y)=x²/rx²+y²/ry².
  // Accurate within ≈ lw/2 of the boundary, which is all we need.
  function strokeEllipse(cx, cy, rx, ry, lw, r, g, b, ccx, ccy, ccr) {
    const CX = cx*s, CY = cy*s, RX = rx*s, RY = ry*s, T = lw*s;
    const CCX = ccx*s, CCY = ccy*s, CCR = ccr*s;
    const outer = Math.max(RX, RY) + T + 2;
    const x0 = Math.max(0, Math.floor(CX - outer)), xN = Math.min(size-1, Math.ceil(CX + outer));
    const y0 = Math.max(0, Math.floor(CY - outer)), yN = Math.min(size-1, Math.ceil(CY + outer));
    for (let py = y0; py <= yN; py++) {
      for (let px = x0; px <= xN; px++) {
        if ((px - CCX) ** 2 + (py - CCY) ** 2 > (CCR + 0.5) ** 2) continue;
        const qx = px - CX, qy = py - CY;
        const gx = qx / (RX * RX), gy = qy / (RY * RY);
        const gl = Math.sqrt(gx * gx + gy * gy);
        if (gl < 1e-8) continue;
        const fval = qx * qx / (RX * RX) + qy * qy / (RY * RY);
        const dist  = Math.abs(fval - 1) / (2 * gl);
        const alpha = Math.max(0, Math.min(1, T / 2 - dist + 0.5));
        if (alpha > 0) setPixel(px, py, r, g, b, Math.round(alpha * 255));
      }
    }
  }

  // ── Icon design ──────────────────────────────────────────────────────────────
  //  Background : blue rounded square
  //  Globe      : circle outline + equator + vertical meridian ellipse
  //  All coords in 16-unit design space; s scales them to actual pixels.

  // Deep-blue rounded-square background  (#1E3A8A) — darker, more elegant; high contrast with white
  fillRoundRect(0, 0, 16, 16, 2.8, 30, 58, 138);

  // Globe geometry — centered and enlarged to fill the tile (keeps the detailed wireframe)
  const gx = 8, gy = 8, gr = 6.0;

  // Line width: kept crisp at 16 px (toolbar size, no muddiness), lighter at 48/128 so the
  // enlarged, detailed globe reads as elegant rather than heavy.
  const lw = size <= 16 ? 0.8 : size <= 48 ? 0.74 : 0.7;

  strokeCircle(gx, gy, gr, lw, 255, 255, 255);
  drawLine(gx - gr, gy, gx + gr, gy, lw, 255, 255, 255, gx, gy, gr); // equator
  strokeEllipse(gx, gy, gr * 0.48, gr, lw, 255, 255, 255, gx, gy, gr); // meridian

  // Extra latitude lines only at ≥ 48 px — too crowded at 16 px
  if (size >= 48) {
    const lat = gr * 0.52; // ~26° north
    const hw  = Math.sqrt(gr * gr - lat * lat);
    drawLine(gx - hw, gy - lat, gx + hw, gy - lat, lw * 0.85, 255, 255, 255, gx, gy, gr);
    drawLine(gx - hw, gy + lat, gx + hw, gy + lat, lw * 0.85, 255, 255, 255, gx, gy, gr);
  }

  // ── Build PNG ────────────────────────────────────────────────────────────────
  const raw = Buffer.alloc(size * (size * 4 + 1));
  for (let y = 0; y < size; y++) {
    raw[y * (size * 4 + 1)] = 0; // filter byte: None
    pixels.copy(raw, y * (size * 4 + 1) + 1, y * size * 4, (y + 1) * size * 4);
  }

  const ihdr = Buffer.allocUnsafe(13);
  ihdr.writeUInt32BE(size, 0); ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; ihdr[9] = 6; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0; // RGBA

  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    pngChunk('IHDR', ihdr),
    pngChunk('IDAT', zlib.deflateSync(raw)),
    pngChunk('IEND', Buffer.alloc(0)),
  ]);
}

fs.mkdirSync('icons', { recursive: true });
for (const size of [16, 48, 128]) {
  fs.writeFileSync(path.join('icons', `icon${size}.png`), drawIcon(size));
  console.log(`created icons/icon${size}.png`);
}
