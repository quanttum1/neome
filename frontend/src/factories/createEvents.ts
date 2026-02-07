import { now } from "../utc";
import { nextUTCDay } from "../utc";
import { localTime } from "../utc";

export function createNewTaskEvent(task: Task): NewTaskEvent {
  return {
    id: crypto.randomUUID(),
    time: now(),
    type: "NEW_TASK",
    task: task,
  };
}

export function createNewTaskDeadlineEvent(task: Task): TaskDeadlineEvent {
  return {
    time: task.deadline,
    type: "TASK_DEADLINE",
    version: 2,
    taskId: task.id,
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

export function createDayRolloverEvent(oldDate: UTCDateString, timezone: TimezoneString)
: DayRolloverEvent {
  const newDate = nextUTCDay(oldDate);

  return {
    time: localTime(newDate, timezone),
    type: "DAY_ROLLOVER",
    version: 2,
    oldDate: oldDate,
    newDate: newDate,
  };
}

export function createNewHabitEvent(habit: Habit): NewHabitEvent {
  return {
    id: crypto.randomUUID(),
    time: now(),
    type: "NEW_HABIT",
    habit: habit
  };
}
