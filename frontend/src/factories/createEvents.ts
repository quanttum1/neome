import { now } from "../utc";
import { nextUTCDay } from "../utc";
import { localTime } from "../utc";
import { v5 as uuidv5 } from "uuid";

export function createNewTaskEvent(task: Task): NewTaskEvent {
  return {
    id: crypto.randomUUID(),
    time: now(),
    type: "NEW_TASK",
    task: task,
    isSynchronised: false,
  };
}

export function createTaskDeadlineEvent(task: Task): TaskDeadlineEvent {
  const TASK_DEADLINE_NAMESPACE = "bde7d901-aea1-47f8-a7f6-a4a52c11f80f";
  return {
    id: uuidv5(`${task.id} ${task.deadline}`, TASK_DEADLINE_NAMESPACE),
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
    isSynchronised: false,
  };
}

export function createTaskCompletedEvent(taskId: TaskId): TaskCompletedEvent {
  return {
    id: crypto.randomUUID(),
    time: now(),
    type: "TASK_COMPLETED",
    taskId: taskId,
    isSynchronised: false,
  };
}

export function createTaskUpdateEvent(id: TaskId, newTask: Task): TaskUpdateEvent {
  return {
    id: crypto.randomUUID(),
    time: now(),
    type: "TASK_UPDATE",
    version: 1,
    taskId: id,
    newTask: newTask,
    isSynchronised: false,
  };
}

export function createDayRolloverEvent(oldDate: UTCDateString, timezone: TimezoneString)
: DayRolloverEvent {
  const newDate = nextUTCDay(oldDate);

  const DAY_ROLLOVER_NAMESPACE = "e9b3b2da-9927-43f3-a17a-6165601db43b";
  return {
    id: uuidv5(`${oldDate} ${timezone}`, DAY_ROLLOVER_NAMESPACE),
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
    habit: habit,
    isSynchronised: false,
  };
}

export function createHabitUpdateEvent(id: HabitId, newHabit: Habit): HabitUpdateEvent {
  return {
    id: crypto.randomUUID(),
    time: now(),
    type: "HABIT_UPDATE",
    version: 1,
    habitId: id,
    newHabit: newHabit,
    isSynchronised: false,
  };
}

export function createHabitRemoveEvent(id: HabitId): HabitRemoveEvent {
  return {
    id: crypto.randomUUID(),
    time: now(),
    type: "HABIT_REMOVE",
    version: 1,
    habitId: id,
    isSynchronised: false,
  };
}

export function createMessagesReadEvent(): MessagesReadEvent {
  return {
    id: crypto.randomUUID(),
    time: now(),
    type: "MESSAGES_READ",
    version: 1,
    isSynchronised: false,
  };
}
