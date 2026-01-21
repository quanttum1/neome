interface NeomeStore {
  events: NeomeEvent[]; // MUST be sorted by time

  currentState: State;
  stateLastUpdated?: UTCString;
  // TODO(2026-01-16 15:04:01): add `initialState` and `initialStateTime`
  // to store the snapshot

  getState: () => State;

  updateCurrentState: () => void; // Applies events with time > stateLastUpdated
  recomputeCurrentState: () => void; // Replays from scratch

  addEventsAndUpdateState: (events: NeomeEvent[]) => void;
  addTask: (task: Task) => void;
  completeTask: (id: TaskId) => void;
  taskTogglePinned: (id: TaskId) => void;

  getTaskById: (id: TaskId) => Task | undefined;
}

