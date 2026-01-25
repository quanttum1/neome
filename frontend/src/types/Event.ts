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

interface DayRolloverEvent extends BaseEvent {
  type: "DAY_ROLLOVER";
  oldDate: UTCDateString;
  newDate: UTCDateString;
}

interface NewHabitEvent extends BaseEvent {
  type: "NEW_HABIT";
  habit: Habit;
}

type NeomeEvent =
  | NewTaskEvent
  | TaskPinToggleEvent
  | TaskDeadlineEvent
  | DayRolloverEvent
  | NewHabitEvent
  | TaskCompletedEvent;
