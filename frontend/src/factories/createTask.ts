import { localInputToUTC } from '../utc';
import { now } from '../utc';
import { isValidDate } from '../utc';

export function getCreateTaskError(input: {
  name: string;
  deadline: string; // Local time
  reward: number;
  penalty: number;
  isPinned?: boolean;
}): string | null {

  if (!input.name) return "Name can't be empty";

  if (Number.isNaN(input.reward)) return "Reward is not a number";
  if (Number.isNaN(input.penalty)) return "Penalty is not a number";

  if (!Number.isInteger(input.reward * 10)) return "Reward is too precise";
  if (!Number.isInteger(input.penalty * 10)) return "Penalty is too precise";

  if (!isValidDate(input.deadline)) return "Invalid deadline";
  if (localInputToUTC(input.deadline) < now()) return "Deadline is in the past";

  return null;
}


function createTask(input: {
  name: string;
  deadline: string; // Local time
  reward: number;
  penalty: number;
  isPinned?: boolean;
}): Task {

  const error = getCreateTaskError(input);
  if (error) throw new Error(error);

  return {
    ...input,
    id: crypto.randomUUID(),
    deadline: localInputToUTC(input.deadline),
    isPinned: input.isPinned ?? false,
  };
}

export default createTask;
