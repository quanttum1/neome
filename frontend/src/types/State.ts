interface State {
  totalCarrots: number;
  dailyCarrots: number;
  progress: number; // Same as totalCarrots, but doesn't descrease if you lose carrots

  tasks: Task[];
}
