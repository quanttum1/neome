// Used to represent the days of the week
// The format is Sunday to Monday
// It goes backwards so that it's easier to get the day by doing (mask >> day) % 2
// For example, 0b0011111 is Monday to Friday
// Use functions in `../weekMask.ts` to manipulate it
type WeekMask = number;

type HabitId = string;

interface Habit {
  id: HabitId;
  name: string;
  daysOfWeek: WeekMask;
  reward: number;
  penalty: number;
}
