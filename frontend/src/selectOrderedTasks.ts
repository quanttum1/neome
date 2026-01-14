let lastTasks: Task[] | undefined;
let lastResult: Task[] | undefined;

export default function selectOrderedTasks(s: NeomeStore): Task[] {
  if (s.tasks === lastTasks && lastResult) {
    return lastResult;
  }

  lastTasks = s.tasks;

  const pinned: Task[] = [];
  const notPinned: Task[] = [];

  for (const e of s.tasks) {
    if (e.isPinned) pinned.push(e);
    else notPinned.push(e);
  }

  lastResult = [...pinned, ...notPinned];
  return lastResult;
}
