/**
 * Convert a Date to YYYY-MM-DD string.
 * Defaults to today if no date provided.
 */
export function toDateString(date: Date = new Date()): string {
  return date.toISOString().split("T")[0];
}
