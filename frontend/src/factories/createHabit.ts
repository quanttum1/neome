export function getCreateHabitError(input: {
  name: string;
  reward: number;
  penalty: number;
  daysOfWeek: WeekMask;
}): string | null {

  if (!input.name) return "Name can't be empty";

  if (Number.isNaN(input.reward)) return "Reward is not a number";
  if (Number.isNaN(input.penalty)) return "Penalty is not a number";

  if (!Number.isInteger(input.reward * 10)) return "Reward is too precise";
  if (!Number.isInteger(input.penalty * 10)) return "Penalty is too precise";

  if (input.daysOfWeek == 0) return "You need to do the habit at least once a week";

  return null;
}

function createHabit(input: {
  name: string;
  daysOfWeek: WeekMask;
  reward: number;
  penalty: number;
}): Habit {

  const error = getCreateHabitError(input);
  if (error) throw new Error(error);

  return {
    ...input,
    id: crypto.randomUUID(),
  };
}

export default createHabit;
