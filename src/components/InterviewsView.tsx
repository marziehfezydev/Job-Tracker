import type { Application, ISODate } from "../types";
import { formatLong, relativeDay } from "../lib/date";

interface InterviewsViewProps {
  apps: readonly Application[];
  today: ISODate;
  onOpen: (app: Application) => void;
}

export function InterviewsView({ apps, today, onOpen }: InterviewsViewProps) {
  const dated = apps.filter((a): a is Application & { interviewDate: ISODate } => a.interviewDate !== null);
  const upcoming = dated.filter((a) => a.interviewDate >= today).toSorted((a, b) => a.interviewDate.localeCompare(b.interviewDate));
  const past = dated.filter((a) => a.interviewDate < today).toSorted((a, b) => b.interviewDate.localeCompare(a.interviewDate));
  const unscheduled = apps.filter((a) => a.status === "interview" && a.interviewDate === null);

  const renderList = (items: readonly (Application & { interviewDate: ISODate })[]) => (
    <ul className="list">
      {items.map((a) => (
        <li key={a.id} className="list-row">
          <div className="date-chip" aria-hidden="true">
            <span>{new Date(a.interviewDate + "T00:00").toLocaleDateString("en-US", { month: "short" }).toUpperCase()}</span>
            <strong>{Number(a.interviewDate.slice(8))}</strong>
          </div>
          <div className="grow">
            <button type="button" className="card-title" onClick={() => onOpen(a)}>{a.role}</button>
            <div className="muted small">{a.company} · {formatLong(a.interviewDate)}</div>
          </div>
          <span className="tag tag-interview">{relativeDay(today, a.interviewDate)}</span>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="stack">
      <section className="panel" aria-label="Upcoming interviews">
        <div className="panel-head"><h2>Upcoming ({upcoming.length})</h2></div>
        {upcoming.length ? renderList(upcoming) : <p className="muted">No upcoming interviews. Set an interview date on an application to see it here.</p>}
      </section>

      {unscheduled.length > 0 && (
        <section className="panel" aria-label="Interviews without a date">
          <div className="panel-head"><h2>Waiting for a date ({unscheduled.length})</h2></div>
          <ul className="list">
            {unscheduled.map((a) => (
              <li key={a.id} className="list-row">
                <div className="grow">
                  <button type="button" className="card-title" onClick={() => onOpen(a)}>{a.role}</button>
                  <div className="muted small">{a.company} · no interview date yet</div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="panel" aria-label="Past interviews">
        <div className="panel-head"><h2>Past ({past.length})</h2></div>
        {past.length ? renderList(past) : <p className="muted">Nothing here yet.</p>}
      </section>
    </div>
  );
}
