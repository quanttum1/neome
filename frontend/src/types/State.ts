type FixedArray<T, N extends number, R extends T[] = []> =
  R['length'] extends N ? R : FixedArray<T, N, [...R, T]>;

interface State {
  date: UTCDateString;
  timezone: TimezoneString;

  totalCarrots: number;
  dailyCarrots: number;
  progress: number; // Same as totalCarrots, but doesn't descrease if you lose carrots
  week: FixedArray<number | undefined, 6>; // Carrots gained this week excluding today

  messages: Message[];

  tasks: Task[];
  habits: Habit[];
}
