'use strict';

// Runs at document_start — BEFORE YouTube paints anything — so flash-prone elements
// (the homepage feed, and the left-menu distraction sections) never flash when their
// toggles are on. The authoritative settings live in chrome.storage.sync, which is
// ASYNC and resolves too late to beat the first paint. content.js mirrors the settings
// we need (enabled + hide-home + hide-distractions) into localStorage (synchronous,
// per-origin, shared with the page) on every load, so here we read the last known
// values instantly and add the `ytlf-hide-home` / `ytlf-hide-engagements` classes to
// <html>. styles.css (also injected at document_start) then hides those elements via
// the classes before they render. content.js reconciles the classes once it loads.
//
// IMPORTANT: this file shares the SAME isolated-world global scope as content.js (all
// content scripts of one extension in a frame do). So everything is wrapped in an IIFE
// — a top-level `var enabled` here would collide with content.js's `let enabled` and
// throw "Identifier 'enabled' has already been declared", killing content.js entirely.
(function () {
  try {
    var ls = window.localStorage;
    var on = ls.getItem('ytlf_enabled') !== '0';   // default ON
    if (on) {
      if (ls.getItem('ytlf_hide_home') === '1') {
        document.documentElement.classList.add('ytlf-hide-home');
      }
      // "Hide distractions" — pre-paint the left-menu guide sections (Explore,
      // Subscriptions list, More from YouTube) so they never flash on a fresh tab.
      if (ls.getItem('ytlf_hide_engagements') === '1') {
        document.documentElement.classList.add('ytlf-hide-engagements');
      }
    }
  } catch (e) { /* localStorage unavailable — content.js still hides it (one possible flash) */ }
})();
