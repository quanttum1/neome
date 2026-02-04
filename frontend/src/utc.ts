export function isValidDate(date: string) {
  return !Number.isNaN(new Date(date));
}

export function localInputToUTC(value: string): UTCString {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid datetime-local value: ${value}`);
  }

  return date.toISOString();
}

export function now(): UTCString {
  // TODO: when time travel is on, alert user once
  // Uncomment the following when testing/debugging to "travel in time"
  //
  // const d = new Date();
  // d.setUTCDate(d.getUTCDate() + 1); // Adds 1 day
  // return d.toISOString();

  return new Date().toISOString();
}

export function startOfUTCDay(time: UTCString): UTCDateString {
  const d = new Date(time);
  d.setUTCHours(0, 0, 0, 0);
  return d.toISOString();
}

export function nextUTCDay(day: UTCDateString): UTCDateString {
  const d = new Date(day);
  d.setUTCDate(d.getUTCDate() + 1);
  return startOfUTCDay(d.toISOString());
}

export function localMidnightOf(date: UTCDateString): UTCString {
  const d = new Date(date);

  const localMidnight = new Date(
    d.getFullYear(),
    d.getMonth(),
    d.getDate(),
    0, 0, 0, 0
  );

  return localMidnight.toISOString();
}


export function getWeekdayOfDate(date: UTCDateString): number {
  if (!isValidDate(date)) throw new Error(`Invalid UTC string: ${date}`);

  // Convert to: 0 = Monday ... 6 = Sunday
  return (new Date(date).getUTCDay() + 6) % 7;
}
