import { useMemo, useState } from "react";
import { STATUSES, STATUS_LABELS, type Application, type Status } from "../types";
import { formatShort } from "../lib/date";

interface ApplicationsViewProps {
  apps: readonly Application[];
  onOpen: (app: Application) => void;
  onMove: (id: string, status: Status) => void;
}

type SortKey = "applied" | "company" | "role";
type StatusFilter = Status | "all";

const SORT_LABELS: Record<SortKey, string> = {
  applied: "Newest applied",
  company: "Company A-Z",
  role: "Role A-Z",
};

/** Comparators keyed by SortKey: adding a key without a comparator is a compile error. */
const COMPARATORS: Record<SortKey, (a: Application, b: Application) => number> = {
  applied: (a, b) => (b.appliedDate ?? "").localeCompare(a.appliedDate ?? ""),
  company: (a, b) => a.company.localeCompare(b.company),
  role: (a, b) => a.role.localeCompare(b.role),
};

export function ApplicationsView({ apps, onOpen, onMove }: ApplicationsViewProps) {
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [sort, setSort] = useState<SortKey>("applied");

  const rows = useMemo(
    () => apps.filter((a) => filter === "all" || a.status === filter).toSorted(COMPARATORS[sort]),
    [apps, filter, sort],
  );

  return (
    <section className="panel" aria-label="All applications">
      <div className="panel-head wrap">
        <h2>{rows.length} application{rows.length === 1 ? "" : "s"}</h2>
        <div className="row-gap wrap">
          <label className="inline-field">Status
            <select value={filter} onChange={(e) => setFilter(e.target.value as StatusFilter)}>
              <option value="all">All</option>
              {STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
            </select>
          </label>
          <label className="inline-field">Sort by
            <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)}>
              {(Object.keys(SORT_LABELS) as SortKey[]).map((k) => <option key={k} value={k}>{SORT_LABELS[k]}</option>)}
            </select>
          </label>
        </div>
      </div>

      {rows.length === 0 ? (
        <p className="muted">No applications match. Try another filter or add one.</p>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th scope="col">Role</th>
                <th scope="col">Company</th>
                <th scope="col">Mode</th>
                <th scope="col">Applied</th>
                <th scope="col">Interview</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((a) => (
                <tr key={a.id}>
                  <td><button type="button" className="card-title" onClick={() => onOpen(a)}>{a.role}</button></td>
                  <td>{a.company}</td>
                  <td>{a.workMode}</td>
                  <td>{a.appliedDate ? formatShort(a.appliedDate) : "-"}</td>
                  <td>{a.interviewDate ? formatShort(a.interviewDate) : "-"}</td>
                  <td>
                    <select aria-label={`Status of ${a.role} at ${a.company}`} value={a.status} onChange={(e) => onMove(a.id, e.target.value as Status)}>
                      {STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
