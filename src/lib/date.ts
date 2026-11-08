import type { ISODate } from "../types";

const pad = (n: number): string => String(n).padStart(2, "0");

export function toISODate(d: Date): ISODate {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function parseISODate(s: ISODate): Date {
  const [y = 1970, m = 1, d = 1] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function todayISO(): ISODate {
  return toISODate(new Date());
}

export function addDays(s: ISODate, n: number): ISODate {
  const d = parseISODate(s);
  d.setDate(d.getDate() + n);
  return toISODate(d);
}

/** Monday of the week that contains `s`. */
export function startOfWeek(s: ISODate): ISODate {
  const dow = (parseISODate(s).getDay() + 6) % 7; // Monday = 0
  return addDays(s, -dow);
}

/** "Nov 4" */
export function formatShort(s: ISODate): string {
  return parseISODate(s).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/** "Thursday, November 5" */
export function formatLong(s: ISODate): string {
  return parseISODate(s).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
}

export function monthTitle(year: number, month: number): string {
  return new Date(year, month, 1).toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

/**
 * Cells for a month grid that starts on Monday.
 * `null` is an empty cell before the 1st of the month.
 */
export function monthGrid(year: number, month: number): (ISODate | null)[] {
  const lead = (new Date(year, month, 1).getDay() + 6) % 7;
  const days = new Date(year, month + 1, 0).getDate();
  const cells: (ISODate | null)[] = Array.from({ length: lead }, () => null);
  for (let day = 1; day <= days; day++) cells.push(toISODate(new Date(year, month, day)));
  return cells;
}

/** Whole days from `from` to `to` (negative if `to` is earlier). */
export function daysBetween(from: ISODate, to: ISODate): number {
  return Math.round((parseISODate(to).getTime() - parseISODate(from).getTime()) / 86_400_000);
}

/** "Today", "Tomorrow", "In 3 days", "Yesterday", "4 days ago" */
export function relativeDay(today: ISODate, date: ISODate): string {
  const n = daysBetween(today, date);
  if (n === 0) return "Today";
  if (n === 1) return "Tomorrow";
  if (n > 1) return `In ${n} days`;
  return n === -1 ? "Yesterday" : `${-n} days ago`;
}
