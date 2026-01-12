let lastTasks = null;
let lastResult = null;

export default function selectOrderedTasks(s) {
  if (s.tasks === lastTasks) return lastResult;

  lastTasks = s.tasks;

  let pinned = [];
  let notPinned = [];

  for (let i = 0; i < s.tasks.length; i++) {
    const e = s.tasks[i];
    if (e.isPinned) pinned.push(e);
    else notPinned.push(e);
  }

  lastResult = [...pinned, ...notPinned];
  return lastResult;
}
