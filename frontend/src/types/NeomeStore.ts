interface NeomeStore {
  initialTimezone: TimezoneString;
  initialDate: UTCDateString;
  events: StoredEvent[];

  currentState: State;
  stateLastUpdated?: UTCString | undefined;
  // TODO(2026-01-16 15:04:01): add `snapshot` and `snapshotTime` to `NeomeStore`

  getState: () => State;

  updateCurrentState: () => void; // Applies events with time > stateLastUpdated
  recomputeCurrentState: () => void; // Replays from scratch

  addEventAndUpdateState: (event: StoredEvent) => void;

  addTask: (task: Task) => void;
  completeTask: (id: TaskId) => void;
  taskTogglePinned: (id: TaskId) => void;

  addHabit: (habit: Habit) => void;

  getTaskById: (id: TaskId) => Task | undefined;
}

