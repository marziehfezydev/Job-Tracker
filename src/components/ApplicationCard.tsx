import type { DragEvent } from "react";
import { STATUSES, STATUS_LABELS, type Application, type Status } from "../types";
import { formatShort } from "../lib/date";
import { RowActions } from "./RowActions";

interface ApplicationCardProps {
  app: Application;
  onOpen: (app: Application) => void;
  onMove: (id: string, status: Status) => void;
  onDelete: (id: string) => void;
}

export function ApplicationCard({ app, onOpen, onMove, onDelete }: ApplicationCardProps) {
  function handleDragStart(e: DragEvent<HTMLElement>) {
    e.dataTransfer.setData("text/plain", app.id);
    e.dataTransfer.effectAllowed = "move";
  }

  const tag =
    app.status === "interview" && app.interviewDate
      ? `Interview ${formatShort(app.interviewDate)}`
      : app.appliedDate
        ? `Applied ${formatShort(app.appliedDate)}`
        : "Saved";

  return (
    <article className="card" draggable onDragStart={handleDragStart}>
      <div className="card-top">
        <span className="avatar" aria-hidden="true">{app.company.charAt(0).toUpperCase()}</span>
        <div className="card-titles">
          <button type="button" className="card-title" onClick={() => onOpen(app)}>{app.role}</button>
          <div className="muted small">{app.company}</div>
        </div>
      </div>
      <div className="card-bottom">
        <span className="muted small">{app.workMode}</span>
        <span className={`tag tag-${app.status}`}>{tag}</span>
      </div>
      <div className="card-foot">
        <label className="move">
          <span className="visually-hidden">Move {app.role} to another column</span>
          <select value={app.status} onChange={(e) => onMove(app.id, e.target.value as Status)}>
            {STATUSES.map((s) => (
              <option key={s} value={s}>{STATUS_LABELS[s]}</option>
            ))}
          </select>
        </label>
        <RowActions app={app} onEdit={onOpen} onDelete={onDelete} />
      </div>
    </article>
  );
}