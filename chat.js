/* AETHER AI | js/chat.js
   Sends your message to /api/chat, runs AI actions, shows the reply.
   Copyright (c) 2026 Parvez. All rights reserved. */

let CODE = '';
try {
  CODE = localStorage.getItem(APP.codeKey) || '';
} catch (e) {}
// ---------- Calls the server function ----------
async function api(body) {
  const r = await fetch(APP.apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-access-code': CODE },
    body: JSON.stringify(body),
  });
  let d = {};
  try {
    d = await r.json();
  } catch (e) {}
  if (!r.ok) {
    const e = new Error(d.error || 'Server error ' + r.status);
    e.code = d.code;
    throw e;
  }
  return d;
}
// ---------- Sends a message, runs AI actions, shows the reply ----------
async function send(text) {
  if (busy) return;
  lastText = text;
  let c = cur();
  if (!c) {
    c = { id: uid(), title: text.slice(0, 48), msgs: [] };
    S.convs.unshift(c);
    S.cur = c.id;
  }
  c.msgs.push({ r: 'user', t: text });
  const a = { r: 'assistant', t: '' };
  c.msgs.push(a);
  busy = true;
  view = 'chat';
  save();
  render();
  const ta = $('#inp');
  if (ta) ta.focus();
  const hist = [];
  c.msgs
    .slice(0, -1)
    .slice(-14)
    .forEach((m) => {
      if (!m.t || m.err) return;
      const l = hist[hist.length - 1];
      if (l && l.role === m.r) l.content += '\n\n' + m.t;
      else hist.push({ role: m.r, content: m.t });
    });
  while (hist.length && hist[0].role !== 'user') hist.shift();
  try {
    for (let i = 0; i < 6; i++) {
      const r = await api({ messages: hist, context: ctx() });
      hist.push({ role: 'assistant', content: r.content });
      const tx = r.content
        .filter((b) => b.type === 'text')
        .map((b) => b.text)
        .join('\n\n');
      if (tx) {
        a.t += (a.t ? '\n\n' : '') + tx;
        paint();
      }
      const us = r.content.filter((b) => b.type === 'tool_use');
      if (r.stop_reason !== 'tool_use' || !us.length) break;
      hist.push({
        role: 'user',
        content: us.map((u) => ({
          type: 'tool_result',
          tool_use_id: u.id,
          content: runTool(u.name, u.input),
        })),
      });
    }
    if (!a.t) a.t = 'Done.';
  } catch (e) {
    a.err = true;
    if (e.code === 'access') {
      needCode = true;
      a.t = 'This assistant is protected. Enter your access code above to continue.';
    } else a.t = 'Sorry, something went wrong: ' + (e.message || 'unknown error');
  } finally {
    busy = false;
    save();
    paint();
  }
}
