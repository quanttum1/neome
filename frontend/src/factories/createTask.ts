import { localInputToUTC } from '../utc';
import { now } from '../utc';
import { isValidDate } from '../utc';

export function getCreateTaskError(input: {
  name: string;
  deadline: string; // Local time
  isPinned?: boolean;
  deleteOnDeadline: boolean;
}): string | null {

  if (!input.name) return "Name can't be empty";

  if (!isValidDate(input.deadline)) return "Invalid deadline";
  if (localInputToUTC(input.deadline) < now()) return "Deadline is in the past";

  return null;
}


function createTask(input: {
  name: string;
  deadline: string; // Local time
  isPinned?: boolean;
  deleteOnDeadline: boolean;
}): Task {

  const error = getCreateTaskError(input);
  if (error) throw new Error(error);

  return {
    ...input,
    id: crypto.randomUUID(),
    version: 3,
    deadline: localInputToUTC(input.deadline),
    isPinned: input.isPinned ?? false,
    isOverdue: false,
  };
}

export default createTask;
