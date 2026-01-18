import { isUTCString } from '../utc'
import { localInputToUTC } from '../utc'

function createTask(input: {
  name: string;
  deadline: string; // Local time
  reward: number;
  penalty: number;
  isPinned?: boolean;
}): Task {
  if (!isUTCString(input.deadline)) {
    throw new Error(`Invalid ISO date: ${input.deadline}`);
  }

  return {
    id: crypto.randomUUID(),
    ...input,
    deadline: localInputToUTC(input.deadline),
    isPinned: input.isPinned ?? false,
  };
}

export default createTask;
