import { now } from "../utc";

export function createNewTaskEvent(task: Task) : NewTaskEvent {
  return {
    id: crypto.randomUUID(),
    time: now(),
    type: "NEW_TASK",
    task: task,
  };
}
