interface State {
  date: UTCDateString;
  // TODO(2026-02-01 20:22): add timezone info to the state

  totalCarrots: number;
  dailyCarrots: number;
  progress: number; // Same as totalCarrots, but doesn't descrease if you lose carrots

  tasks: Task[];
  habits: Habit[];
}
