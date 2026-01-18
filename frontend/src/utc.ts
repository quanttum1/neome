export function isUTCString(value: string): boolean {
  return !Number.isNaN(Date.parse(value));
}

export function localInputToUTC(value: string): UTCString {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid datetime-local value: ${value}`);
  }

  return date.toISOString();
}

export function now(): UTCString {
  return new Date().toISOString();
}
