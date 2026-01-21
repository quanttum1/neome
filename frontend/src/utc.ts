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
  // Uncomment the following when testing/debugging to "travel in time"
  //
  // const d = new Date();
  // d.setUTCDate(d.getUTCDate() + 1); // Adds 1 day
  // return d.toISOString();

  return new Date().toISOString();
}
