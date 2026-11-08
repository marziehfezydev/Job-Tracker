import type { ISODate } from "../types";
import type { Stats } from "../lib/stats";
import { formatLong } from "../lib/date";

interface TodayCardProps {
  today: ISODate;
  stats: Stats;
  onLog: () => void;
}

export function TodayCard({ today, stats, onLog }: TodayCardProps) {
  const done = stats.appliedToday > 0;

  return (
    <section className="today-card" aria-label="Today">
      <span className="eyebrow">TODAY</span>
      <h2 className="today-date">{formatLong(today)}</h2>

      <div className="today-status" role="status">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          {done ? <path d="M5 13l4 4L19 7" /> : <circle cx="12" cy="12" r="9" />}
        </svg>
        <div>
          <div className="today-status-title">
            {done ? `${stats.appliedToday} application${stats.appliedToday > 1 ? "s" : ""} sent today` : "No application yet today"}
          </div>
          <div className="today-status-note">{done ? "Nice work. Come back tomorrow." : "Send one to keep your streak alive."}</div>
        </div>
      </div>

      <div className="today-numbers">
        <div className="mini-stat">
          <span className="mini-value">{stats.streak}</span>
          <span className="mini-label">day streak</span>
        </div>
        <div className="mini-stat">
          <span className="mini-value">{stats.thisWeek}</span>
          <span className="mini-label">this week</span>
        </div>
      </div>

      <button type="button" className="primary-button wide" onClick={onLog}>
        Log today&apos;s application
      </button>
    </section>
  );
}
