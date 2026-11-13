import { useEffect, useMemo, useReducer, useState, type FormEvent } from "react";
import { VIEW_LABELS, type Application, type ApplicationDraft, type ISODate, type Status, type Theme, type View } from "./types";
import { applicationsReducer, loadApplications, STORAGE_KEY } from "./state/applications";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { writeJSON } from "./lib/storage";
import { computeStats, weeklyCounts } from "./lib/stats";
import { todayISO } from "./lib/date";
import { Sidebar } from "./components/Sidebar";
import { StatCards } from "./components/StatCards";
import { Calendar } from "./components/Calendar";
import { TodayCard } from "./components/TodayCard";
import { Board } from "./components/Board";
import { UpcomingCard } from "./components/UpcomingCard";
import { WeeklyChart } from "./components/WeeklyChart";
import { ApplicationForm } from "./components/ApplicationForm";
import { ApplicationsView } from "./components/ApplicationsView";
import { InterviewsView } from "./components/InterviewsView";
import { CompaniesView } from "./components/CompaniesView";
import { SettingsView } from "./components/SettingsView";

const isGoal = (value: unknown): value is number => typeof value === "number" && value >= 1 && value <= 50;

const SUBTITLES: Record<View, string> = {
  dashboard: "Keep every application, interview and offer in one place.",
  applications: "Every application in one sortable list.",
  interviews: "What is coming up, and what already happened.",
  companies: "All your roles grouped by company.",
  settings: "Theme, weekly goal and your data.",
};

const isTheme = (value: unknown): value is Theme => value === "neutral" || value === "warm";

/** `"new"` opens an empty form, an Application opens it for editing, `null` closes it. */
type FormTarget = Application | "new" | null;

export default function App() {
  const [apps, dispatch] = useReducer(applicationsReducer, undefined, loadApplications);
  const [theme, setTheme] = useLocalStorage<Theme>("jobtrack.theme", "neutral", isTheme);
  const [goal, setGoal] = useLocalStorage<number>("jobtrack.weeklyGoal", 8, isGoal);
  const [view, setView] = useState<View>("dashboard");
  const [draft, setDraft] = useState(""); // what is typed in the box right now
  const [committed, setCommitted] = useState(""); // a search saved with Enter, shown as a chip
  // While typing, the typed text filters live. When the box is empty, the saved search applies.
  const query = draft.trim() !== "" ? draft.trim() : committed;
  const [formTarget, setFormTarget] = useState<FormTarget>(null);

  // "today" is read once per render so the page stays correct after midnight on the next interaction.
  const today = todayISO();
  const [selected, setSelected] = useState<ISODate>(today);

  useEffect(() => {
    writeJSON(STORAGE_KEY, apps);
  }, [apps]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const stats = useMemo(() => computeStats(apps, today), [apps, today]);
  const weeks = useMemo(() => weeklyCounts(apps, today), [apps, today]);

  function matches(app: Application, q: string): boolean {
    return app.company.toLowerCase().includes(q) || app.role.toLowerCase().includes(q);
  }

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? apps.filter((a) => matches(a, q)) : apps;
  }, [apps, query]);

  function handleSearch(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const q = draft.trim();
    if (q === "") return;
    // Found something: save it as a chip and empty the box for the next search.
    // Found nothing: keep the text so a typo can be fixed.
    if (apps.some((a) => matches(a, q.toLowerCase()))) {
      setCommitted(q);
      setDraft("");
    }
  }

  function clearSearch() {
    setDraft("");
    setCommitted("");
  }

  function handleSave(draft: ApplicationDraft, id: string | null) {
    if (id === null) dispatch({ type: "add", draft });
    else dispatch({ type: "update", application: { ...draft, id } });
    setFormTarget(null);
  }

  function handleDelete(id: string) {
    const app = apps.find((a) => a.id === id);
    if (!app) return;
    if (!window.confirm(`Delete "${app.role}" at ${app.company}? This cannot be undone.`)) return;
    dispatch({ type: "remove", id });
    setFormTarget(null);
  }

  function handleMove(id: string, status: Status) {
    dispatch({ type: "move", id, status, today });
  }

  function handleClearAll() {
    if (window.confirm("Remove all applications? This cannot be undone.")) {
      dispatch({ type: "replaceAll", applications: [] });
    }
  }

  return (
    <div className="app">
      <Sidebar
        view={view}
        onNavigate={setView}
        weekCount={stats.thisWeek}
        weeklyGoal={goal}
      />

      <main className="main">
        <header className="topbar">
          <div>
            <h1>{view === "dashboard" ? "Job Application Tracker" : VIEW_LABELS[view]}</h1>
            <p className="muted">{SUBTITLES[view]}</p>
          </div>
          <div className="topbar-actions">
            {view !== "settings" && (
              <form className="search" role="search" onSubmit={handleSearch}>
                <label>
                  <span className="visually-hidden">Search applications</span>
                  <input type="search" placeholder="Search company or role" value={draft} onChange={(e) => setDraft(e.target.value)} />
                </label>
                {draft !== "" || committed !== "" ? (
                  <button type="button" className="search-button" aria-label="Clear search" onClick={clearSearch}>×</button>
                ) : (
                  <span className="search-button" aria-hidden="true">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4a7 7 0 100 14 7 7 0 000-14z M21 21l-5-5" /></svg>
                  </span>
                )}
              </form>
            )}
            <button type="button" className="primary-button" onClick={() => setFormTarget("new")}>+ Add application</button>
          </div>
        </header>

        {query !== "" && visible.length === 0 && view !== "settings" && (
          <p className="filter-row muted" role="status">No results for &quot;{query}&quot;.</p>
        )}
        {draft.trim() === "" && committed !== "" && visible.length > 0 && view !== "settings" && (
          <div className="filter-row" role="status">
            <span className="chip">
              Showing results for &quot;{committed}&quot; ({visible.length})
              <button type="button" className="chip-close" aria-label="Clear search" onClick={clearSearch}>×</button>
            </span>
          </div>
        )}

        {view === "dashboard" && (
          <>
            <StatCards stats={stats} />
            <div className="calendar-row">
              <Calendar apps={apps} today={today} selected={selected} onSelect={setSelected} />
              <TodayCard today={today} stats={stats} onLog={() => setFormTarget("new")} />
            </div>
            <Board apps={visible} onOpen={setFormTarget} onMove={handleMove} onDelete={handleDelete} />
            <div className="bottom-row">
              <UpcomingCard apps={apps} today={today} onOpen={setFormTarget} onSeeAll={() => setView("interviews")} />
              <WeeklyChart weeks={weeks} />
            </div>
          </>
        )}
        {view === "applications" && <ApplicationsView apps={visible} onOpen={setFormTarget} onMove={handleMove} onDelete={handleDelete} />}
        {view === "interviews" && <InterviewsView apps={visible} today={today} onOpen={setFormTarget} onDelete={handleDelete} />}
        {view === "companies" && <CompaniesView apps={visible} query={query} onOpen={setFormTarget} onDelete={handleDelete} />}
        {view === "settings" && (
          <SettingsView
            apps={apps}
            theme={theme}
            weeklyGoal={goal}
            onThemeChange={setTheme}
            onGoalChange={setGoal}
            onImport={(list) => dispatch({ type: "replaceAll", applications: list })}
            onClearAll={handleClearAll}
          />
        )}
      </main>

      {formTarget !== null && (
        <ApplicationForm
          editing={formTarget === "new" ? null : formTarget}
          defaultAppliedDate={today}
          onSave={handleSave}
          onDelete={handleDelete}
          onClose={() => setFormTarget(null)}
        />
      )}
    </div>
  );
}