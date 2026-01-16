import isISOString from './isISOString'

function createTask(input: {
  name: string;
  deadline: string;
  reward: number;
  penalty: number;
  isPinned?: boolean;
}): Task {
  if (!isISOString(input.deadline)) {
    throw new Error(`Invalid ISO date: ${input.deadline}`);
  }

  return {
    id: crypto.randomUUID(),
    ...input,
    isPinned: input.isPinned ?? false,
  };
}

export default createTask;
