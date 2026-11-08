import { useState, type FormEvent } from "react";
import { STATUSES, STATUS_LABELS, WORK_MODES, type Application, type ApplicationDraft, type Status, type WorkMode } from "../types";

interface ApplicationFormProps {
  /** `null` means "create a new application". */
  editing: Application | null;
  defaultAppliedDate: string;
  onSave: (draft: ApplicationDraft, id: string | null) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

/** Form fields are strings; empty date strings become `null` on save. */
interface FormState {
  company: string;
  role: string;
  workMode: WorkMode;
  status: Status;
  appliedDate: string;
  interviewDate: string;
  notes: string;
}

export function ApplicationForm({ editing, defaultAppliedDate, onSave, onDelete, onClose }: ApplicationFormProps) {
  const [form, setForm] = useState<FormState>(() => ({
    company: editing?.company ?? "",
    role: editing?.role ?? "",
    workMode: editing?.workMode ?? "Remote",
    status: editing?.status ?? "applied",
    appliedDate: editing ? (editing.appliedDate ?? "") : defaultAppliedDate,
    interviewDate: editing?.interviewDate ?? "",
    notes: editing?.notes ?? "",
  }));

  /** One typed setter for every field: `K` ties the key to the matching value type. */
  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onSave(
      {
        company: form.company.trim(),
        role: form.role.trim(),
        workMode: form.workMode,
        status: form.status,
        appliedDate: form.appliedDate || null,
        interviewDate: form.interviewDate || null,
        notes: form.notes.trim(),
      },
      editing?.id ?? null,
    );
  }

  const title = editing ? "Edit application" : "Add application";

  return (
    <div className="overlay" role="presentation" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <form className="modal" onSubmit={handleSubmit} aria-labelledby="form-title" onKeyDown={(e) => e.key === "Escape" && onClose()}>
        <h2 id="form-title">{title}</h2>

        <label>Company
          <input required autoFocus value={form.company} onChange={(e) => set("company", e.target.value)} />
        </label>
        <label>Role
          <input required value={form.role} onChange={(e) => set("role", e.target.value)} />
        </label>

        <div className="form-row">
          <label>Work mode
            <select value={form.workMode} onChange={(e) => set("workMode", e.target.value as WorkMode)}>
              {WORK_MODES.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </label>
          <label>Status
            <select value={form.status} onChange={(e) => set("status", e.target.value as Status)}>
              {STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
            </select>
          </label>
        </div>

        <div className="form-row">
          <label>Applied on
            <input type="date" value={form.appliedDate} onChange={(e) => set("appliedDate", e.target.value)} />
          </label>
          <label>Interview on
            <input type="date" value={form.interviewDate} onChange={(e) => set("interviewDate", e.target.value)} />
          </label>
        </div>

        <label>Notes
          <textarea rows={3} value={form.notes} onChange={(e) => set("notes", e.target.value)} />
        </label>

        <div className="form-actions">
          {editing && (
            <button type="button" className="ghost-button danger" onClick={() => onDelete(editing.id)}>Delete</button>
          )}
          <span className="spacer" />
          <button type="button" className="ghost-button" onClick={onClose}>Cancel</button>
          <button type="submit" className="primary-button">Save</button>
        </div>
      </form>
    </div>
  );
}
