import { now } from "../utc";

export function createNewTaskEvent(task: Task): NewTaskEvent {
  return {
    id: crypto.randomUUID(),
    time: now(),
    type: "NEW_TASK",
    task: task,
  };
}

export function createTaskPinToggleEvent(taskId: TaskId): TaskPinToggleEvent {
  return {
    id: crypto.randomUUID(),
    time: now(),
    type: "TASK_PIN_TOGGLE",
    taskId: taskId,
  };
}

export function createTaskCompletedEvent(taskId: TaskId): TaskCompletedEvent {
  return {
    id: crypto.randomUUID(),
    time: now(),
    type: "TASK_COMPLETED",
    taskId: taskId,
  };
}
