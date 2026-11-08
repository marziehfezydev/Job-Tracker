import { VIEW_LABELS, type View } from "../types";

interface SidebarProps {
  view: View;
  onNavigate: (view: View) => void;
  weekCount: number;
  weeklyGoal: number;
}

const NAV: readonly View[] = ["dashboard", "applications", "interviews", "companies", "settings"];

export function Sidebar({ view, onNavigate, weekCount, weeklyGoal }: SidebarProps) {
  const progress = Math.min(100, Math.round((weekCount / weeklyGoal) * 100));

  return (
    <aside className="sidebar">
      <div className="brand">
        <span className="brand-mark" aria-hidden="true">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 7h18v13H3z M8 7V4h8v3 M3 13h18" />
          </svg>
        </span>
        <span className="brand-name">Jobtrack</span>
      </div>

      <nav aria-label="Main" className="nav">
        {NAV.map((v) => (
          <button
            key={v}
            type="button"
            className={v === view ? "nav-link is-active" : "nav-link"}
            aria-current={v === view ? "page" : undefined}
            onClick={() => onNavigate(v)}
          >
            {VIEW_LABELS[v]}
          </button>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <div className="goal">
          <span className="goal-label">Weekly goal</span>
          <span className="goal-value">
            {weekCount} of {weeklyGoal} applications
          </span>
          <div
            className="progress"
            role="progressbar"
            aria-label="Weekly application goal"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progress}
          >
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>
    </aside>
  );
}
