export function addMonths(baseDate: Date, months: number) {
  const date = new Date(baseDate);
  date.setMonth(date.getMonth() + months);
  return date;
}

export function isFuture(date?: Date | null) {
  return Boolean(date && date.getTime() > Date.now());
}
