type EventId = string; // UUID

interface BaseEvent {
  id: EventId;
  time: UTCString;
}

interface NewTaskEvent extends BaseEvent {
  type: "NEW_TASK";
  task: Task;
}

interface TaskPinToggleEvent extends BaseEvent {
  type: "TASK_PIN_TOGGLE";
  taskId: TaskId;
}

interface TaskCompletedEvent extends BaseEvent {
  type: "TASK_COMPLETED";
  taskId: TaskId;
}

interface TaskDeadlineEvent extends BaseEvent {
  type: "TASK_DEADLINE";
  taskId: TaskId;
}

// TODO(2026-01-16 14:13:42): add DayRolloverEvent

type NeomeEvent =
  | NewTaskEvent
  | TaskPinToggleEvent
  | TaskDeadlineEvent
  | TaskCompletedEvent;
