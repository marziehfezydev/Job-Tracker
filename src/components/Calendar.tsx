import { useMemo, useState } from "react";
import type { Application, ISODate } from "../types";
import { countByAppliedDate } from "../lib/stats";
import { formatLong, monthGrid, monthTitle, parseISODate } from "../lib/date";

interface CalendarProps {
  apps: readonly Application[];
  today: ISODate;
  selected: ISODate;
  onSelect: (date: ISODate) => void;
}

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

export function Calendar({ apps, today, selected, onSelect }: CalendarProps) {
  const initial = parseISODate(today);
  const [view, setView] = useState({ year: initial.getFullYear(), month: initial.getMonth() });

  const applied = useMemo(() => countByAppliedDate(apps), [apps]);
  const interviews = useMemo(() => new Set(apps.flatMap((a) => (a.interviewDate ? [a.interviewDate] : []))), [apps]);
  const cells = useMemo(() => monthGrid(view.year, view.month), [view]);

  function shiftMonth(delta: number) {
    const d = new Date(view.year, view.month + delta, 1);
    setView({ year: d.getFullYear(), month: d.getMonth() });
  }

  const dayApplied = apps.filter((a) => a.appliedDate === selected);
  const dayInterviews = apps.filter((a) => a.interviewDate === selected);

  return (
    <section className="panel calendar" aria-label="Application calendar">
      <div className="panel-head">
        <h2>{monthTitle(view.year, view.month)}</h2>
        <div className="row-gap">
          <button type="button" className="icon-button" aria-label="Previous month" onClick={() => shiftMonth(-1)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg>
          </button>
          <button type="button" className="icon-button" aria-label="Next month" onClick={() => shiftMonth(1)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      </div>

      <div className="calendar-grid">
        {WEEKDAYS.map((w) => (
          <span key={w} className="weekday">{w}</span>
        ))}
        {cells.map((date, i) => {
          if (date === null) return <span key={`empty-${i}`} aria-hidden="true" />;
          const count = applied.get(date) ?? 0;
          const hasInterview = interviews.has(date);
          const classes = ["day", count > 0 ? "has-applied" : "", date === today ? "is-today" : "", date === selected ? "is-selected" : "", date < today && count === 0 ? "is-past" : ""]
            .filter(Boolean)
            .join(" ");
          const label = `${formatLong(date)}: ${count} application${count === 1 ? "" : "s"}${hasInterview ? ", interview or deadline" : ""}`;
          return (
            <button key={date} type="button" className={classes} aria-label={label} aria-pressed={date === selected} onClick={() => onSelect(date)}>
              <span className="day-number">{Number(date.slice(8))}</span>
              <span className="dots" aria-hidden="true">
                {Array.from({ length: Math.min(count, 3) }, (_, k) => (
                  <span key={k} className="dot" />
                ))}
                {hasInterview && <span className="dot ring" />}
              </span>
            </button>
          );
        })}
      </div>

      <div className="legend">
        <span><i className="swatch applied" /> Applied (one dot per application)</span>
        <span><i className="dot ring" /> Interview</span>
        <span><i className="swatch today" /> Today</span>
      </div>

      <div className="day-detail">
        <h3>{formatLong(selected)}</h3>
        {dayApplied.length === 0 && dayInterviews.length === 0 ? (
          <p className="muted">{selected > today ? "Nothing scheduled." : "No applications on this day."}</p>
        ) : (
          <ul>
            {dayApplied.map((a) => (
              <li key={`a-${a.id}`}>Applied: <strong>{a.role}</strong> at {a.company}</li>
            ))}
            {dayInterviews.map((a) => (
              <li key={`i-${a.id}`}>Interview: <strong>{a.role}</strong> at {a.company}</li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
