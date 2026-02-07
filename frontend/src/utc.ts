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

export function localTime(time: UTCString, timezone: TimezoneString): UTCString {
  const date = new Date(time);

  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(date);

  const get = (type: string) =>
    parts.find(p => p.type === type)!.value;

  const localAsUTC = new Date(
    Date.UTC(
      Number(get("year")),
      Number(get("month")) - 1,
      Number(get("day")),
      Number(get("hour")),
      Number(get("minute")),
      Number(get("second")),
    )
  );

  return localAsUTC.toISOString();
}


export function getWeekdayOfDate(date: UTCDateString): number {
  if (!isValidDate(date)) throw new Error(`Invalid UTC string: ${date}`);

  // Convert to: 0 = Monday ... 6 = Sunday
  return (new Date(date).getUTCDay() + 6) % 7;
}

export function getTimezone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}
