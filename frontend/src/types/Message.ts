type MessageId = string; // UUID

interface BaseMessage {
  version: 1;
  id: MessageId;
  time: UTCString;
}

interface TaskDeadlineMessage extends BaseMessage {
  type: "TASK_DEADLINE";
  carrotsLost: number;
  taskName: string;
}

type Message =
  | TaskDeadlineMessage;
