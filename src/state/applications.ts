import { STATUSES, WORK_MODES, type Application, type ApplicationDraft, type ISODate, type Status } from "../types";
import { addDays, todayISO } from "../lib/date";
import { readJSON } from "../lib/storage";

export const STORAGE_KEY = "jobtrack.applications.v1";

/** Every way the list can change. The `type` field lets TypeScript narrow each case in the reducer. */
export type Action =
  | { type: "add"; draft: ApplicationDraft }
  | { type: "update"; application: Application }
  | { type: "move"; id: string; status: Status; today: ISODate }
  | { type: "remove"; id: string }
  | { type: "replaceAll"; applications: Application[] };

export function applicationsReducer(state: Application[], action: Action): Application[] {
  switch (action.type) {
    case "add":
      return [{ ...action.draft, id: crypto.randomUUID() }, ...state];
    case "update":
      return state.map((a) => (a.id === action.application.id ? action.application : a));
    case "move":
      return state.map((a) => {
        if (a.id !== action.id) return a;
        // Moving a card out of the wishlist means you just applied.
        const appliedDate = a.appliedDate ?? (action.status === "wishlist" ? null : action.today);
        return { ...a, status: action.status, appliedDate };
      });
    case "remove":
      return state.filter((a) => a.id !== action.id);
    case "replaceAll":
      return action.applications;
  }
}

function isApplication(value: unknown): value is Application {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.id === "string" &&
    typeof v.company === "string" &&
    typeof v.role === "string" &&
    typeof v.notes === "string" &&
    (STATUSES as readonly unknown[]).includes(v.status) &&
    (WORK_MODES as readonly unknown[]).includes(v.workMode) &&
    (v.appliedDate === null || typeof v.appliedDate === "string") &&
    (v.interviewDate === null || typeof v.interviewDate === "string")
  );
}

export function isApplicationList(value: unknown): value is Application[] {
  return Array.isArray(value) && value.every(isApplication);
}

/** A few example cards so the first launch isn't empty. Dates are relative to today. */
export function sampleApplications(): Application[] {
  const today = todayISO();
  const make = (
    company: string,
    role: string,
    workMode: Application["workMode"],
    status: Status,
    appliedDaysAgo: number | null,
    interviewInDays: number | null = null,
  ): Application => ({
    id: crypto.randomUUID(),
    company,
    role,
    workMode,
    status,
    appliedDate: appliedDaysAgo === null ? null : addDays(today, -appliedDaysAgo),
    interviewDate: interviewInDays === null ? null : addDays(today, interviewInDays),
    notes: "",
  });

  return [
    make("Bluepine Studio", "Frontend Developer", "Remote", "wishlist", null),
    make("Lumen Systems", "React Engineer", "Hybrid", "wishlist", null),
    make("Northwind Labs", "TypeScript Developer", "Remote", "applied", 1),
    make("Copperleaf", "Junior Web Developer", "Hybrid", "applied", 2),
    make("Quillbase", "Frontend Developer", "Remote", "applied", 3),
    make("Tidewater Tech", "React Developer", "Remote", "interview", 6, 3),
    make("Pebble & Co", "Junior Frontend Developer", "Remote", "offer", 12),
    make("Harbor & Finch", "UI Developer", "On-site", "rejected", 9),
  ];
}

export function loadApplications(): Application[] {
  return readJSON(STORAGE_KEY, sampleApplications(), isApplicationList);
}
