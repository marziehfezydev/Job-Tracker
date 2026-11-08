import { useRef, useState, type ChangeEvent } from "react";
import type { Application, Theme } from "../types";
import { isApplicationList } from "../state/applications";

interface SettingsViewProps {
  apps: readonly Application[];
  theme: Theme;
  weeklyGoal: number;
  onThemeChange: (theme: Theme) => void;
  onGoalChange: (goal: number) => void;
  onImport: (apps: Application[]) => void;
  onClearAll: () => void;
}

const THEMES: readonly { value: Theme; label: string; swatches: readonly string[] }[] = [
  { value: "neutral", label: "Neutral Elegance", swatches: ["#463f3a", "#8a817c", "#bcb8b1", "#f4f3ee", "#e0afa0"] },
  { value: "warm", label: "Warm Sand", swatches: ["#ecf8f8", "#eee4e1", "#e7d8c9", "#e6beae", "#b2967d"] },
];

export function SettingsView({ apps, theme, weeklyGoal, onThemeChange, onGoalChange, onImport, onClearAll }: SettingsViewProps) {
  const fileInput = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<string | null>(null);

  function handleExport() {
    const blob = new Blob([JSON.stringify(apps, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "jobtrack-applications.json";
    link.click();
    URL.revokeObjectURL(url);
    setMessage(`Exported ${apps.length} application${apps.length === 1 ? "" : "s"}.`);
  }

  async function handleFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow choosing the same file again
    if (!file) return;
    try {
      const data: unknown = JSON.parse(await file.text());
      if (!isApplicationList(data)) throw new Error("invalid");
      if (window.confirm(`Replace your current list with ${data.length} imported application(s)?`)) {
        onImport(data);
        setMessage(`Imported ${data.length} application${data.length === 1 ? "" : "s"}.`);
      }
    } catch {
      setMessage("That file is not a valid Jobtrack export.");
    }
  }

  return (
    <div className="stack">
      <section className="panel" aria-label="Appearance">
        <div className="panel-head"><h2>Theme</h2></div>
        <div className="theme-options" role="radiogroup" aria-label="Theme">
          {THEMES.map((t) => (
            <button key={t.value} type="button" role="radio" aria-checked={theme === t.value} className={theme === t.value ? "theme-option is-selected" : "theme-option"} onClick={() => onThemeChange(t.value)}>
              <span className="swatches" aria-hidden="true">
                {t.swatches.map((c) => <i key={c} style={{ background: c }} />)}
              </span>
              <strong>{t.label}</strong>
            </button>
          ))}
        </div>
      </section>

      <section className="panel" aria-label="Goal">
        <div className="panel-head"><h2>Weekly goal</h2></div>
        <label className="inline-field">Applications per week
          <input
            type="number"
            min={1}
            max={50}
            value={weeklyGoal}
            onChange={(e) => onGoalChange(Math.min(50, Math.max(1, Math.round(Number(e.target.value)) || 1)))}
          />
        </label>
      </section>

      <section className="panel" aria-label="Data">
        <div className="panel-head"><h2>Your data</h2></div>
        <p className="muted small">Everything is stored in this browser only. Export a backup before clearing your browser data.</p>
        <div className="row-gap wrap settings-actions">
          <button type="button" className="ghost-button" onClick={handleExport}>Export JSON</button>
          <button type="button" className="ghost-button" onClick={() => fileInput.current?.click()}>Import JSON</button>
          <button type="button" className="ghost-button danger" onClick={onClearAll}>Clear all applications</button>
          <input ref={fileInput} type="file" accept="application/json,.json" className="visually-hidden" tabIndex={-1} aria-label="Import JSON file" onChange={handleFile} />
        </div>
        {message && <p role="status" className="small settings-message">{message}</p>}
      </section>
    </div>
  );
}
