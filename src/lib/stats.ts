import type { Application, ISODate } from "../types";
import { addDays, formatShort, startOfWeek } from "./date";

export interface Stats {
  total: number;
  active: number;
  interviews: number;
  offers: number;
  appliedToday: number;
  thisWeek: number;
  /** Consecutive days with at least one application, counting back from today (or yesterday). */
  streak: number;
}

/** How many applications were sent on each day. */
export function countByAppliedDate(apps: readonly Application[]): Map<ISODate, number> {
  const counts = new Map<ISODate, number>();
  for (const app of apps) {
    if (app.appliedDate) counts.set(app.appliedDate, (counts.get(app.appliedDate) ?? 0) + 1);
  }
  return counts;
}

export function computeStats(apps: readonly Application[], today: ISODate): Stats {
  const counts = countByAppliedDate(apps);
  const weekStart = startOfWeek(today);
  const weekEnd = addDays(weekStart, 6);

  let thisWeek = 0;
  for (const [date, n] of counts) {
    if (date >= weekStart && date <= weekEnd) thisWeek += n;
  }

  // ISO dates compare correctly as plain strings.
  let cursor: ISODate = counts.has(today) ? today : addDays(today, -1);
  let streak = 0;
  while (counts.has(cursor)) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }

  return {
    total: apps.filter((a) => a.status !== "wishlist").length,
    active: apps.filter((a) => a.status === "applied" || a.status === "interview").length,
    interviews: apps.filter((a) => a.status === "interview").length,
    offers: apps.filter((a) => a.status === "offer").length,
    appliedToday: counts.get(today) ?? 0,
    thisWeek,
    streak,
  };
}

export interface WeekCount {
  weekStart: ISODate;
  label: string;
  count: number;
  isCurrent: boolean;
}

/** Applications sent per week for the last `weeks` weeks (oldest first, current week last). */
export function weeklyCounts(apps: readonly Application[], today: ISODate, weeks = 6): WeekCount[] {
  const counts = countByAppliedDate(apps);
  const currentStart = startOfWeek(today);
  return Array.from({ length: weeks }, (_, i) => {
    const weekStart = addDays(currentStart, -7 * (weeks - 1 - i));
    const weekEnd = addDays(weekStart, 6);
    let count = 0;
    for (const [date, n] of counts) {
      if (date >= weekStart && date <= weekEnd) count += n;
    }
    return { weekStart, label: formatShort(weekStart), count, isCurrent: weekStart === currentStart };
  });
}
