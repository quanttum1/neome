type TaskId = string;
type UtcString = string;

interface Task {
  id: TaskId;
  name: string;
  isPinned: boolean;
  deadline: UtcString;
  penalty: number;
  reward: number;
}
