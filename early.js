'use strict';

// Runs at document_start — BEFORE YouTube paints anything — so the homepage feed
// never flashes when "Hide Homepage Feed" is on. The authoritative settings live in
// chrome.storage.sync, which is ASYNC and resolves too late to beat the first paint.
// content.js mirrors the two settings we need (enabled + hide-home) into localStorage
// (synchronous, per-origin, shared with the page) on every load, so here we read the
// last known value instantly and add the `ytlf-hide-home` class to <html>. styles.css
// (also injected at document_start) then hides the feed via that class before it
// renders. content.js reconciles the class with the live setting once it loads.
//
// IMPORTANT: this file shares the SAME isolated-world global scope as content.js (all
// content scripts of one extension in a frame do). So everything is wrapped in an IIFE
// — a top-level `var enabled` here would collide with content.js's `let enabled` and
// throw "Identifier 'enabled' has already been declared", killing content.js entirely.
(function () {
  try {
    var ls = window.localStorage;
    var on = ls.getItem('ytlf_enabled') !== '0';   // default ON
    if (on && ls.getItem('ytlf_hide_home') === '1') {
      document.documentElement.classList.add('ytlf-hide-home');
    }
  } catch (e) { /* localStorage unavailable — content.js still hides it (one possible flash) */ }
})();
