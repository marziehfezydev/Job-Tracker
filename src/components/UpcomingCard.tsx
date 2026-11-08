import type { Application, ISODate } from "../types";
import { formatLong, relativeDay } from "../lib/date";

interface UpcomingCardProps {
  apps: readonly Application[];
  today: ISODate;
  onOpen: (app: Application) => void;
  onSeeAll: () => void;
}

export function UpcomingCard({ apps, today, onOpen, onSeeAll }: UpcomingCardProps) {
  const upcoming = apps
    .filter((a): a is Application & { interviewDate: ISODate } => a.interviewDate !== null && a.interviewDate >= today)
    .toSorted((a, b) => a.interviewDate.localeCompare(b.interviewDate))
    .slice(0, 4);

  return (
    <section className="panel" aria-label="Upcoming">
      <div className="panel-head">
        <h2>Upcoming</h2>
        <button type="button" className="ghost-button" onClick={onSeeAll}>See all</button>
      </div>
      {upcoming.length === 0 ? (
        <p className="muted">Nothing scheduled. Add an interview date to an application to see it here.</p>
      ) : (
        <ul className="list">
          {upcoming.map((a) => (
            <li key={a.id} className="list-row compact">
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
      )}
    </section>
  );
}
