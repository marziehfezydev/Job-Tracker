/** Every column on the board, in display order. `as const` lets us derive a union type from it. */
export const STATUSES = ["wishlist", "applied", "interview", "offer", "rejected"] as const;
export type Status = (typeof STATUSES)[number];

export const WORK_MODES = ["Remote", "Hybrid", "On-site"] as const;
export type WorkMode = (typeof WORK_MODES)[number];

/** A calendar date as "YYYY-MM-DD" (local time, no timezone surprises). */
export type ISODate = string;

export interface Application {
  id: string;
  company: string;
  role: string;
  workMode: WorkMode;
  status: Status;
  /** Day you sent the application. `null` while it is only on the wishlist. */
  appliedDate: ISODate | null;
  /** Day of the next interview, if any. */
  interviewDate: ISODate | null;
  notes: string;
}

/** What the form edits: an application without its id. */
export type ApplicationDraft = Omit<Application, "id">;

export type Theme = "neutral" | "warm";

export const STATUS_LABELS: Record<Status, string> = {
  wishlist: "Wishlist",
  applied: "Applied",
  interview: "Interview",
  offer: "Offer",
  rejected: "Rejected",
};

export type View = "dashboard" | "applications" | "interviews" | "companies" | "settings";

export const VIEW_LABELS: Record<View, string> = {
  dashboard: "Dashboard",
  applications: "Applications",
  interviews: "Interviews",
  companies: "Companies",
  settings: "Settings",
};
