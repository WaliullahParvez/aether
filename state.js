/* AETHER AI | js/state.js
   Saved data (tasks, projects, notes, chats) and what screen is open.
   Copyright (c) 2026 Parvez. All rights reserved. */

let S;
try {
  S = JSON.parse(localStorage.getItem(APP.storageKey) || 'null');
} catch (e) {}
S = S || { convs: [], tasks: [], projects: [], mem: [], cur: null };
const save = () => {
  try {
    localStorage.setItem(APP.storageKey, JSON.stringify(S));
  } catch (e) {}
};
let needCode = false,
  lastText = '',
  view = 'dash',
  busy = false,
  filt = 'open',
  editing = null,
  showH = false;
const NAV = [
  ['dash', 'Dashboard', 'grid'],
  ['chat', 'Assistant', 'chat'],
  ['tasks', 'Tasks', 'tasks'],
  ['projects', 'Projects', 'folder'],
  ['mem', 'Memory', 'mark'],
];
const cur = () => S.convs.find((c) => c.id === S.cur),
  open = () => S.tasks.filter((t) => !t.done),
  pn = (id) => (S.projects.find((p) => p.id === id) || {}).name || '';
const PR = { high: 0, med: 1, low: 2 },
  sortT = (a) => [...a].sort((x, y) => PR[x.pri] - PR[y.pri] || (x.due || '9').localeCompare(y.due || '9'));
