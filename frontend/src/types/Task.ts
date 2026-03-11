type TaskId = string;

interface OldTask {
  id: TaskId;
  name: string;
  isPinned: boolean;
  deadline: UTCString;
  reward: number;
  penalty: number;
}

interface TaskV2 {
  version: 2;
  id: TaskId;
  name: string;
  isPinned: boolean;
  deadline: UTCString;
  reward: number;
  penalty: number;

  deleteOnDeadline: boolean;
  isOverdue: boolean;
}

type Task =
  | OldTask
  | TaskV2;
