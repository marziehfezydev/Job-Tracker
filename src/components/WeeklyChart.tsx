import type { WeekCount } from "../lib/stats";

const MAX_BAR_PX = 130;

export function WeeklyChart({ weeks }: { weeks: readonly WeekCount[] }) {
  const max = Math.max(1, ...weeks.map((w) => w.count));
  const summary = weeks.map((w) => `week of ${w.label}: ${w.count}`).join(", ");

  return (
    <section className="panel" aria-label="Applications per week">
      <div className="panel-head"><h2>Applications per week</h2></div>
      <div className="chart" role="img" aria-label={`Applications sent per week. ${summary}`}>
        {weeks.map((w) => (
          <div key={w.weekStart} className="bar-col">
            <span className="bar-value">{w.count}</span>
            <div
              className={w.isCurrent ? "bar is-current" : "bar"}
              style={{ height: `${Math.max(4, Math.round((w.count / max) * MAX_BAR_PX))}px` }}
            />
            <span className="bar-label">{w.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
