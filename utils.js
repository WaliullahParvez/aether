/* AETHER AI | js/utils.js
   Small helpers: shortcuts, safe-text escaping, dates, copyright text.
   Copyright (c) 2026 Parvez. All rights reserved. */

const $ = (s) => document.querySelector(s),
  uid = () => Math.random().toString(36).slice(2, 9),
  today = () => new Date().toISOString().slice(0, 10);
const esc = (s) =>
  String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const copyright = () => `&copy; ${APP.year} ${APP.owner}. All rights reserved.`;
