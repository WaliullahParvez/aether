/* AETHER AI | js/app.js
   Draws the page, handles clicks and keys, starts the app (loaded last).
   Copyright (c) 2026 Parvez. All rights reserved. */

// ---------- Draws the whole page ----------
function render() {
  $('#app').innerHTML =
    `<aside><div class="logo"><span class="orb"></span><b>AETHER</b><em>AI</em></div>${NAV.map(([v, l, i]) => `<button class="nv ${view === v ? 'on' : ''}" data-a="nav" data-v="${v}">${ic(i)}<span>${l}</span></button>`).join('')}<p class="side-note">Your data is stored privately in this browser.<br>${copyright()}</p></aside><main class="${view === 'chat' ? 'c' : ''}">${V[view]()}${view === 'chat' ? '' : `<footer class="foot">${copyright()}</footer>`}</main>`;
  if (view === 'chat') {
    const m = $('#msgs');
    m.scrollTop = m.scrollHeight;
  }
}
const val = (id) => ($(id) || { value: '' }).value.trim(),
  find = (id) => S.tasks.find((t) => t.id === id);
// ---------- Button actions: data-a="x" in the HTML runs H.x ----------
const H = {
  nav(e) {
    view = e.dataset.v;
    showH = false;
    render();
  },
  tog(e) {
    const t = find(e.dataset.id);
    t.done = !t.done;
    save();
    render();
  },
  del(e) {
    S.tasks = S.tasks.filter((x) => x.id !== e.dataset.id);
    save();
    render();
  },
  edit(e) {
    editing = e.dataset.id;
    render();
    const i = $('#ed');
    if (i) {
      i.focus();
      i.select();
    }
  },
  saveed() {
    const t = find(editing),
      v = val('#ed');
    if (t && v) t.title = v;
    editing = null;
    save();
    render();
  },
  addt() {
    const v = val('#tt');
    if (!v) return;
    S.tasks.unshift({
      id: uid(),
      title: v,
      done: false,
      project: val('#tp'),
      pri: val('#tpr') || 'med',
      due: val('#td'),
      ts: Date.now(),
    });
    save();
    render();
  },
  qtask() {
    const v = val('#qt');
    if (!v) return;
    S.tasks.unshift({ id: uid(), title: v, done: false, project: '', pri: 'med', due: '', ts: Date.now() });
    save();
    render();
  },
  filt(e) {
    filt = e.dataset.v;
    render();
  },
  addp() {
    const v = val('#pn');
    if (v) {
      S.projects.push({ id: uid(), name: v });
      save();
      render();
    }
  },
  delp(e) {
    S.projects = S.projects.filter((p) => p.id !== e.dataset.id);
    S.tasks.forEach((t) => {
      if (t.project === e.dataset.id) t.project = '';
    });
    save();
    render();
  },
  addm() {
    const v = val('#mi');
    if (v) {
      S.mem.push({ id: uid(), text: v });
      save();
      render();
    }
  },
  delm(e) {
    S.mem = S.mem.filter((m) => m.id !== e.dataset.id);
    save();
    render();
  },
  newc() {
    S.cur = null;
    showH = false;
    render();
  },
  opc(e) {
    S.cur = e.dataset.id;
    view = 'chat';
    showH = false;
    save();
    render();
  },
  delc(e) {
    S.convs = S.convs.filter((c) => c.id !== e.dataset.id);
    if (S.cur === e.dataset.id) S.cur = null;
    save();
    render();
  },
  toggH() {
    showH = !showH;
    render();
  },
  chip(e) {
    send(e.dataset.t);
  },
  unlock() {
    const v = val('#ac');
    if (!v) return;
    CODE = v;
    try {
      localStorage.setItem(APP.codeKey, v);
    } catch (e) {}
    needCode = false;
    const c = cur();
    if (c && c.msgs.length >= 2) c.msgs.splice(-2);
    send(lastText);
  },
  send() {
    if (busy) return;
    const i = $('#inp'),
      v = i.value.trim();
    if (v) {
      i.value = '';
      send(v);
    }
  },
  qask() {
    const v = val('#qa');
    if (v) {
      view = 'chat';
      send(v);
    }
  },
};
// ---------- Click and keyboard listeners ----------
document.addEventListener('click', (e) => {
  const el = e.target.closest('[data-a]');
  if (el && H[el.dataset.a]) H[el.dataset.a](el);
});
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Enter' || e.shiftKey) return;
  const t = e.target;
  if (t.id === 'inp') {
    e.preventDefault();
    H.send();
  } else if (t.dataset && t.dataset.en) {
    e.preventDefault();
    H[t.dataset.en]();
  }
});
document.addEventListener('input', (e) => {
  if (e.target.id === 'inp') {
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 140) + 'px';
  }
});
document.querySelector('meta[name=author]').content = APP.owner;
render();
