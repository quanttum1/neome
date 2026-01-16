function isISOString(value: string): boolean {
  return !Number.isNaN(Date.parse(value));
}

export default isISOString;
