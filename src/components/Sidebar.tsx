import { useState } from "react";
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
  // Only matters on small screens, where the menu is collapsed until the button is pressed.
  const [open, setOpen] = useState(false);

  function navigate(next: View) {
    onNavigate(next);
    setOpen(false);
  }

  return (
    <aside className={open ? "sidebar is-open" : "sidebar"} onKeyDown={(e) => e.key === "Escape" && setOpen(false)}>
      <div className="brand">
        <span className="brand-mark" aria-hidden="true">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 7h18v13H3z M8 7V4h8v3 M3 13h18" />
          </svg>
        </span>
        <span className="brand-name">Jobtrack</span>
      </div>

      <button
        type="button"
        className="menu-toggle"
        aria-expanded={open}
        aria-controls="sidebar-menu"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((o) => !o)}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          {open ? <path d="M6 6l12 12 M18 6L6 18" /> : <path d="M4 7h16 M4 12h16 M4 17h16" />}
        </svg>
      </button>

      <div id="sidebar-menu" className="sidebar-menu">
        <nav aria-label="Main" className="nav">
          {NAV.map((v) => (
            <button
              key={v}
              type="button"
              className={v === view ? "nav-link is-active" : "nav-link"}
              aria-current={v === view ? "page" : undefined}
              onClick={() => navigate(v)}
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
      </div>
    </aside>
  );
}
