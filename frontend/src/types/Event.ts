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

interface HabitUpdateEvent extends BaseStoredEvent {
  type: "HABIT_UPDATE";
  version: 1;
  habitId: HabitId;
  newHabit: Habit;
}

interface HabitRemoveEvent extends BaseStoredEvent {
  type: "HABIT_REMOVE";
  version: 1;
  habitId: HabitId;
}

interface TaskUpdateEvent extends BaseStoredEvent {
  version: 1;
  type: "TASK_UPDATE";
  taskId: TaskId;
  newTask: Task;
}

// When i added support for the events, i updated already existing events to make them produce messages.
// But this lead to accumulation of messages about past events for users who started using NEOME before messages are
// supported. To avoid this, when i added this event. It will wipe out all the messages about past events (before
// messages are supported).
interface MessagesMigrationEvent extends BaseStoredEvent {
  type: "MESSAGES_MIGRATION";
  version: "INITIAL"; // If we ever have similar updates, we'll just create a different version of this event
}

interface MessagesReadEvent extends BaseStoredEvent {
  type: "MESSAGES_READ";
  version: 1;
}

// TODO(2026-02-01 20:21): add TimeZoneChangeEvent

type StoredEvent =
  | MessagesReadEvent
  | MessagesMigrationEvent
  | NewTaskEvent
  | TaskUpdateEvent
  | TaskPinToggleEvent
  | OldTaskDeadlineEvent
  | OldDayRolloverEvent
  | NewHabitEvent
  | HabitUpdateEvent
  | HabitRemoveEvent
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
