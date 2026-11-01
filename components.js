/* AETHER AI | js/components.js
   Reusable pieces: task row, progress bar, chat messages.
   Copyright (c) 2026 Parvez. All rights reserved. */

const empty = (t) => `
      <p class="mut em">${t}</p>`;
function row(t) {
  const od = t.due && t.due < today() && !t.done;
  return `
      <div class="tr ${t.done ? 'dn' : ''}">
      <button class="ck" data-a="tog" data-id="${t.id}">${t.done ? ic('check') : ''}</button>
      <div class="tt">${editing === t.id ? `
      <input id="ed" value="${esc(t.title)}" data-en="saveed">` : `<span>${esc(t.title)}</span>`}
      <div class="meta"><i class="pd ${t.pri}"></i>${pn(t.project) ? `<span class="chip">${esc(pn(t.project))}</span>` : ''}${t.due ? `<span class="${od ? 'od' : ''}">${od ? 'Overdue · ' : ''}${t.due}</span>` : ''}</div></div>
      <button class="ib" data-a="${editing === t.id ? 'saveed' : 'edit'}" data-id="${t.id}">${ic(editing === t.id ? 'check' : 'edit')}</button>
      <button class="ib" data-a="del" data-id="${t.id}">${ic('trash')}</button></div>`;
}
const msgsHtml = (c) =>
  (needCode
    ? `
      <div class="card" style="max-width:760px;margin:0 auto 18px"><b>Access code required</b>
      <p class="mut">The owner of this site protects it with a code.</p>
      <div class="add">
      <input id="ac" type="password" data-en="unlock" placeholder="Access code">
      <button class="pri" data-a="unlock">Unlock</button></div></div>`
    : '') + msgsInner(c);
function msgsInner(c) {
  if (!c || !c.msgs.length)
    return `
      <div class="hero">
      <div class="orb"></div>
      <h1>How can I help today?</h1>
      <p class="mut">Ask about code, networks and security, plan your studies, or manage tasks in plain language.</p>
      <div class="chips">${['Explain the TCP three-way handshake step by step', 'Make a 2-week study plan for networking fundamentals', 'How does SQL injection work and how do I prevent it?', 'Add a task: review Nmap notes, high priority, due tomorrow'].map((t) => `
      <button data-a="chip" data-t="${esc(t)}">${esc(t)}</button>`).join('')}</div></div>`;
  return c.msgs
    .map((m, i) =>
      m.r === 'user'
        ? `
      <div class="m u">
      <div class="bd">${esc(m.t).replace(/\n/g, '<br>')}</div></div>`
        : `
      <div class="m">
      <div class="av">A</div>
      <div class="bd">${m.t ? md(m.t) : busy && i === c.msgs.length - 1 ? '<div class="dots"><i></i><i></i><i></i></div>' : ''}</div></div>`,
    )
    .join('');
}
function paint() {
  const m = $('#msgs');
  if (m) {
    m.innerHTML = msgsHtml(cur());
    m.scrollTop = m.scrollHeight;
  }
}
const pbar = (p) => {
  const ts = S.tasks.filter((t) => t.project === p.id),
    d = ts.filter((t) => t.done).length,
    pc = ts.length ? Math.round((d / ts.length) * 100) : 0;
  return `
      <div class="mut">${esc(p.name)} · ${pc}%</div>
      <div class="bar"><i style="width:${pc}%"></i></div>`;
};
