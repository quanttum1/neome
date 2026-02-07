type EventId = string; // UUID

interface BaseEvent {
  time: UTCString;
}

interface BaseStoredEvent extends BaseEvent {
  id: EventId;
}

interface NewTaskEvent extends BaseStoredEvent {
  type: "NEW_TASK";
  task: Task;
}

interface TaskPinToggleEvent extends BaseStoredEvent {
  type: "TASK_PIN_TOGGLE";
  taskId: TaskId;
}

interface TaskCompletedEvent extends BaseStoredEvent {
  type: "TASK_COMPLETED";
  taskId: TaskId;
}

// Deprecated
interface OldTaskDeadlineEvent extends BaseStoredEvent {
  type: "TASK_DEADLINE";
  taskId: TaskId;
}

// Deprecated
interface OldDayRolloverEvent extends BaseStoredEvent {
  type: "DAY_ROLLOVER";
  oldDate: UTCDateString;
  newDate: UTCDateString;
}

interface NewHabitEvent extends BaseStoredEvent {
  type: "NEW_HABIT";
  habit: Habit;
}

// TODO(2026-02-01 20:21): add TimeZoneChangeEvent

type StoredEvent =
  | NewTaskEvent
  | TaskPinToggleEvent
  | OldTaskDeadlineEvent
  | OldDayRolloverEvent
  | NewHabitEvent
  | TaskCompletedEvent;

interface DayRolloverEvent extends BaseEvent {
  type: "DAY_ROLLOVER";
  version: 2;
  oldDate: UTCDateString;
  newDate: UTCDateString;
}

interface TaskDeadlineEvent extends BaseEvent {
  type: "TASK_DEADLINE";
  version: 2;
  taskId: TaskId;
}

type LogicalEvent =
  | DayRolloverEvent
  | TaskDeadlineEvent
  | StoredEvent;
