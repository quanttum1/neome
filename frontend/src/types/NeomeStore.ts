interface NeomeStore {
  total: number;
  daily: number;
  progress: number;

  resetDaily: () => void;
  addCarrots: (n: number) => void;
  loseCarrots: (n: number) => void;

  tasks: Task[];

  addTask: (task: Task) => void;
  removeTask: (taskId: TaskId) => void;
  taskTogglePinned: (taskId: TaskId) => void;
}

