interface State {
  date: UTCDateString;
  timezone: TimezoneString;

  totalCarrots: number;
  dailyCarrots: number;
  progress: number; // Same as totalCarrots, but doesn't descrease if you lose carrots

  tasks: Task[];
  habits: Habit[];
}
