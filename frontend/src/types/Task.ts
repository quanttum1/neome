type TaskId = string;

interface Task {
  id: TaskId;
  name: string;
  isPinned: boolean;
  deadline: UTCString;
  reward: number;
  penalty: number;
}
