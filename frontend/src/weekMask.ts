// Returns whether a day is set to `true` in a weekMask
export function isWeekMaskDay(weekMask: WeekMask, dayOfWeek: number) {
  return (weekMask >> dayOfWeek) % 2;
}

// Returns the new weekMask
export function setWeekMaskDay(weekMask: WeekMask, dayOfWeek: number, newValue: boolean) {
  const dayMask = 1 << dayOfWeek;
  return (~dayMask & weekMask) | (newValue ? dayMask : 0);
}
