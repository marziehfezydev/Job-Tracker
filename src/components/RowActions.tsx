import type { Application } from "../types";

interface RowActionsProps {
  app: Application;
  onEdit: (app: Application) => void;
  onDelete: (id: string) => void;
}

/** Edit and delete buttons shown next to an application wherever it appears. */
export function RowActions({ app, onEdit, onDelete }: RowActionsProps) {
  const name = `${app.role} at ${app.company}`;
  return (
    <div className="row-actions">
      <button type="button" className="icon-button small" aria-label={`Edit ${name}`} title="Edit" onClick={() => onEdit(app)}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 20h9 M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z" />
        </svg>
      </button>
      <button type="button" className="icon-button small danger" aria-label={`Delete ${name}`} title="Delete" onClick={() => onDelete(app.id)}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M3 6h18 M8 6V4h8v2 M6 6l1 14h10l1-14 M10 10v6 M14 10v6" />
        </svg>
      </button>
    </div>
  );
}