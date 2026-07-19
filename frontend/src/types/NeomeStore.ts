interface NeomeStore {
  version: 1,

  isTourTaken: boolean;
  setIsTourTaken: (value: boolean) => void;

  events: LocalEvent[];

  currentState: State;
  stateLastUpdated?: UTCString | undefined;
  // TODO(2026-01-16 15:04:01): add `snapshot` and `snapshotTime` to `NeomeStore`

  markEventSyncronised: (id: EventId) => void;
  markEventsNotSynchronised: () => void;

  getWeeklyCarrots: () => number;

  getState: () => State;

  ensureEventsNotEmpty: () => void;
  addEvent: (event: LocalEvent) => number;
  addEventAndUpdateState: (event: LocalEvent) => void;

  updateCurrentState: () => Promise<void>; // Applies events with time > stateLastUpdated
  recomputeCurrentState: () => Promise<void>; // Replays from scratch

  addTask: (task: Task) => void;
  completeTask: (id: TaskId) => void;
  taskTogglePinned: (id: TaskId) => void;
  updateTask: (id: TaskId, newTask: Task) => void;

  addHabit: (habit: Habit) => void;
  updateHabit: (id: HabitId, newHabit: Habit) => void;
  removeHabit: (id: HabitId) => void;

  markMessagesRead: () => void;

  getTaskById: (id: TaskId) => Task | undefined;
}

