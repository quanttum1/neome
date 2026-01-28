// Used to represent the days of the week
// The format is Monday to Sunday
// For example, 0b1111100 is Monday to Friday
type WeekMask = number;

type HabitId = string;

interface Habit {
  id: HabitId;
  name: string;
  daysOfWeek: WeekMask;
  reward: number;
  penalty: number;
}
