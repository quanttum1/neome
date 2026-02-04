interface NeomeStore {
  initialDate: UTCDateString;
  events: StoredEvent[] | undefined;

  currentState: State;
  stateLastUpdated?: UTCString | undefined;
  // TODO(2026-01-16 15:04:01): add `initialState` and `initialStateTime`
  // to store the snapshot

  getState: () => State;

  getEvents: () => StoredEvent[];

  updateCurrentState: () => void; // Applies events with time > stateLastUpdated
  recomputeCurrentState: () => void; // Replays from scratch

  addEventAndUpdateState: (event: StoredEvent) => void;

  addTask: (task: Task) => void;
  completeTask: (id: TaskId) => void;
  taskTogglePinned: (id: TaskId) => void;

  addHabit: (habit: Habit) => void;

  getTaskById: (id: TaskId) => Task | undefined;
}

