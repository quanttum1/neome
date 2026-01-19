interface NeomeStore {
  events: NeomeEvent[]; // MUST be sorted by time

  currentState: State;
  stateLastUpdated?: UTCString;
  // TODO(2026-01-16 15:04:01): add `initialState` and `initialStateTime`
  // to store the snapshot

  updateCurrentState: () => void; // Applies events with time > stateLastUpdated
  recomputeCurrentState: () => void; // Replays from scratch

  addEvents: (events: NeomeEvent[]) => void;
  addTask: (task: Task) => void;

  getSortedTasks: () => Task[];
  getTaskById: (id: TaskId) => Task | undefined;
  completeTask: (id: TaskId) => void;
}

