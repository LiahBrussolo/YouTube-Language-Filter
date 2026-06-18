// Temporary debug log receiver. Run: node debug-server.js
// content.js POSTs log lines here; they're appended to ytlf-debug.log
'use strict';
const http = require('http');
const fs = require('fs');
const path = require('path');

const LOG_FILE = path.join(__dirname, 'ytlf-debug.log');
fs.writeFileSync(LOG_FILE, `--- log started ${new Date().toISOString()} ---\n`);

http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  // Chrome Private Network Access: required for https pages to reach 127.0.0.1
  res.setHeader('Access-Control-Allow-Private-Network', 'true');
  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }

  // Static serving for the flicker-verification harness
  if (req.method === 'GET') {
    const p = req.url.split('?')[0];
    const routes = {
      '/results':    ['test-harness.html', 'text/html'],
      '/':           ['test-harness.html', 'text/html'],
      '/content.js': ['content.js', 'text/javascript'],
      '/styles.css': ['styles.css', 'text/css'],
    };
    const route = routes[p];
    if (route) {
      res.writeHead(200, { 'Content-Type': route[1] });
      res.end(fs.readFileSync(path.join(__dirname, route[0])));
    } else {
      res.writeHead(404); res.end();
    }
    return;
  }

  let body = '';
  req.on('data', c => { body += c; });
  req.on('end', () => {
    fs.appendFileSync(LOG_FILE, `${new Date().toISOString().slice(11, 23)} ${body}\n`);
    res.writeHead(204); res.end();
  });
}).listen(7777, '127.0.0.1', () => console.log('listening on 7777'));
