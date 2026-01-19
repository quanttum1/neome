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

// TODO(2026-01-16 12:50:07): add TaskDeadlineEvent
// TODO(2026-01-16 14:13:42): add DayRolloverEvent

type NeomeEvent =
  | NewTaskEvent
  | TaskPinToggleEvent
  | TaskCompletedEvent;
