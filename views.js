/* AETHER AI | js/views.js
   The five pages: Dashboard, Chat, Tasks, Projects, Memory.
   Copyright (c) 2026 Parvez. All rights reserved. */

const V = {
  // ---------- Dashboard ----------
  dash() {
    const o = open(),
      dn = S.tasks.length - o.length,
      pc = S.tasks.length ? Math.round((dn / S.tasks.length) * 100) : 0,
      h = new Date().getHours();
    return `
      <h1>${h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening'}</h1>
      <p class="mut">${new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</p>
<div class="ask">
      <input id="qa" data-en="qask" placeholder="Ask AETHER anything…">
      <button class="pri" data-a="qask">${ic('send')} Ask</button></div>
<div class="g4">${[
      ['Open tasks', o.length],
      ['Completed', dn],
      ['Projects', S.projects.length],
      ['Conversations', S.convs.length],
      ['Saved notes', S.mem.length],
    ]
      .map(([k, v]) => `
      <div class="card st"><small>${k}</small><b>${v}</b></div>`)
      .join('')}</div>
<div class="g2">
      <div class="card">
      <h3>Up next</h3>${o.length ? sortT(o).slice(0, 5).map(row).join('') : empty('No open tasks yet.')}
      <div class="add">
      <input id="qt" data-en="qtask" placeholder="Quick add a task…">
      <button class="pri" data-a="qtask">${ic('plus')}</button></div></div>
<div class="card">
      <h3>Progress</h3>
      <div class="rg">
      <div class="ring" style="--p:${pc}"><i>${pc}%</i></div>
      <div>${S.projects.slice(0, 4).map(pbar).join('') || empty('Create a project to track progress.')}</div></div></div>
<div class="card">
      <h3>Recent conversations</h3>${
      S.convs
        .slice(0, 5)
        .map(
          (c) =>
            `
      <div class="li" data-a="opc" data-id="${c.id}"><span>${esc(c.title)}</span><span>${c.msgs.length}</span></div>`,
        )
        .join('') || empty('Start a chat with the assistant.')
    }</div></div>`;
  },
  // ---------- Chat (assistant) ----------
  chat() {
    const c = cur();
    return `
      <div class="chat">
      <div class="hist ${showH ? 'open' : ''}">
      <button class="pri" data-a="newc">${ic('plus')} New chat</button>${S.convs.map((x) => `
      <div class="hi ${c && c.id === x.id ? 'on' : ''}" data-a="opc" data-id="${x.id}"><span>${esc(x.title)}</span><i data-a="delc" data-id="${x.id}">${ic('trash')}</i></div>`).join('') || empty('Your conversations are saved here.')}</div>
<section class="cm">
      <div class="top">
      <button class="ghost mob" data-a="toggH">History</button><b>${c ? esc(c.title) : 'New conversation'}</b></div>
      <div id="msgs">${msgsHtml(c)}</div>
      <div class="comp"><textarea id="inp" rows="1" placeholder="Ask anything, or say “add a task to review my Nmap notes tomorrow”…"></textarea>
      <button class="send" data-a="send">${ic('send')}</button></div></section></div>`;
  },
  // ---------- Tasks ----------
  tasks() {
    const l = sortT(S.tasks.filter((t) => filt === 'all' || (filt === 'open') === !t.done));
    return `
      <h1>Tasks</h1>
      <p class="mut">Add tasks here, or just tell the assistant in plain language.</p>
      <div class="card" style="margin-top:16px">
      <div class="add wrap">
      <input id="tt" data-en="addt" placeholder="What needs doing?" style="flex:2 1 200px">
      <select id="tp"><option value="">No project</option>${S.projects.map((p) => `<option value="${p.id}">${esc(p.name)}</option>`).join('')}</select>
      <select id="tpr"><option value="med">Medium</option><option value="high">High</option><option value="low">Low</option></select>
      <input id="td" type="date">
      <button class="pri" data-a="addt">${ic('plus')} Add</button></div></div>
<div class="tabs">${['open', 'done', 'all'].map((f) => `
      <button class="${filt === f ? 'on' : ''}" data-a="filt" data-v="${f}">${f[0].toUpperCase() + f.slice(1)}</button>`).join('')}</div>${l.map(row).join('') || empty('Nothing here yet.')}`;
  },
  // ---------- Projects ----------
  projects() {
    return `
      <h1>Projects</h1>
      <p class="mut">Group tasks into projects and watch progress build.</p>
      <div class="card" style="margin:16px 0">
      <div class="add" style="margin:0">
      <input id="pn" data-en="addp" placeholder="New project name">
      <button class="pri" data-a="addp">${ic('plus')} Create</button></div></div>
      <div class="g2">${
      S.projects
        .map((p) => {
          const ts = S.tasks.filter((t) => t.project === p.id);
          return `
      <div class="card">
      <div class="ph">
      <h3>${esc(p.name)}</h3>
      <button class="ib" data-a="delp" data-id="${p.id}">${ic('trash')}</button></div>${pbar(p)}
      <p class="mut">${ts.filter((t) => t.done).length} of ${ts.length} tasks done</p>${sortT(
            ts.filter((t) => !t.done),
          )
            .slice(0, 4)
            .map((t) => `
      <div class="mini">${esc(t.title)}</div>`)
            .join('')}</div>`;
        })
        .join('') || empty('No projects yet. Create one above.')
    }</div>`;
  },
  // ---------- Memory ----------
  mem() {
    return `
      <h1>Memory</h1>
      <p class="mut">Notes and preferences here are shared with the assistant in every chat. Tell it “remember that…” to add more.</p>
      <div class="card" style="margin:16px 0">
      <div class="add" style="margin:0">
      <input id="mi" data-en="addm" placeholder="e.g. I prefer short explanations with examples">
      <button class="pri" data-a="addm">${ic('plus')} Save</button></div></div>${S.mem.map((m) => `
      <div class="tr">
      <div class="tt"><span>${esc(m.text)}</span></div>
      <button class="ib" data-a="delm" data-id="${m.id}">${ic('trash')}</button></div>`).join('') || empty('Nothing saved yet.')}`;
  },
};
