type TaskId = string;
type UTCString = string;

interface Task {
  id: TaskId;
  name: string;
  isPinned: boolean;
  deadline: UTCString;
  reward: number;
  penalty: number;
}
