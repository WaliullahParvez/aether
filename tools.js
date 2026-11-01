/* AETHER AI | js/tools.js
   Actions the AI can do for you (add/update tasks, projects, notes).
   Copyright (c) 2026 Parvez. All rights reserved. */

const pid = (n) => {
  if (!n) return '';
  let p = S.projects.find((x) => x.name.toLowerCase() === String(n).toLowerCase());
  if (!p) {
    p = { id: uid(), name: String(n) };
    S.projects.push(p);
  }
  return p.id;
};
const findT = (m) => {
  m = m.toLowerCase();
  return (
    S.tasks.find((t) => !t.done && t.title.toLowerCase().includes(m)) ||
    S.tasks.find((t) => t.title.toLowerCase().includes(m))
  );
};
// ---------- Actions the AI can perform (names must match api/chat.js) ----------
const RUN = {
  add_task: (i) => {
    S.tasks.unshift({
      id: uid(),
      title: i.title,
      done: false,
      project: pid(i.project),
      pri: i.priority || 'med',
      due: i.due || '',
      ts: Date.now(),
    });
    save();
    return 'Task added: ' + i.title;
  },
  update_task: (i) => {
    const t = findT(i.match || '');
    if (!t) return 'No task matches "' + i.match + '"';
    if (i.delete) {
      S.tasks = S.tasks.filter((x) => x !== t);
      save();
      return 'Deleted: ' + t.title;
    }
    if (i.done !== undefined) t.done = i.done;
    if (i.title) t.title = i.title;
    if (i.project) t.project = pid(i.project);
    if (i.priority) t.pri = i.priority;
    if (i.due) t.due = i.due;
    save();
    return 'Updated: ' + t.title;
  },
  add_project: (i) => {
    pid(i.name);
    save();
    return 'Project ready: ' + i.name;
  },
  save_memory: (i) => {
    S.mem.push({ id: uid(), text: i.text });
    save();
    return 'Saved';
  },
};
const runTool = (n, i) => {
  try {
    return RUN[n] ? RUN[n](i || {}) : 'Unknown tool';
  } catch (e) {
    return 'Error: ' + e.message;
  }
};
const ctx = () =>
  JSON.stringify({
    today: today(),
    date: new Date().toDateString(),
    notes: S.mem.map((m) => m.text),
    projects: S.projects.map((p) => p.name),
    openTasks: open().map((t) => ({ title: t.title, project: pn(t.project), priority: t.pri, due: t.due })),
  }).slice(0, 8000);
