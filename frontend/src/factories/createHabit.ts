export function getCreateHabitError(input: {
  name: string;
  daysOfWeek: WeekMask;
}): string | null {

  if (!input.name) return "Name can't be empty";

  if (input.daysOfWeek == 0) return "You need to do the habit at least once a week";

  return null;
}

function createHabit(input: {
  name: string;
  daysOfWeek: WeekMask;
}): Habit {

  const error = getCreateHabitError(input);
  if (error) throw new Error(error);

  return {
    ...input,
    version: 2,
    id: crypto.randomUUID(),
  };
}

export default createHabit;
