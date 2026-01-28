interface NeomeStore {
  initialDate: UTCDateString;
  events: NeomeEvent[] | undefined; // MUST be sorted by time

  currentState: State;
  stateLastUpdated?: UTCString | undefined;
  // TODO(2026-01-16 15:04:01): add `initialState` and `initialStateTime`
  // to store the snapshot

  getState: () => State;

  getEvents: () => NeomeEvent[];

  applyEvent: (event: NeomeEvent, state: State) => State,
  updateCurrentState: () => void; // Applies events with time > stateLastUpdated
  recomputeCurrentState: () => void; // Replays from scratch

  addEventsAndUpdateState: (events: NeomeEvent[]) => void;

  addTask: (task: Task) => void;
  completeTask: (id: TaskId) => void;
  taskTogglePinned: (id: TaskId) => void;

  addHabit: (habit: Habit) => void;

  getTaskById: (id: TaskId) => Task | undefined;
}

