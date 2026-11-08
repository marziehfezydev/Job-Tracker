import { useState, type DragEvent } from "react";
import { STATUSES, STATUS_LABELS, type Application, type Status } from "../types";
import { ApplicationCard } from "./ApplicationCard";

interface BoardProps {
  apps: readonly Application[];
  onOpen: (app: Application) => void;
  onMove: (id: string, status: Status) => void;
}

export function Board({ apps, onOpen, onMove }: BoardProps) {
  const [dragOver, setDragOver] = useState<Status | null>(null);

  function handleDrop(e: DragEvent<HTMLElement>, status: Status) {
    e.preventDefault();
    setDragOver(null);
    const id = e.dataTransfer.getData("text/plain");
    if (id) onMove(id, status);
  }

  return (
    <section aria-label="Pipeline" className="board-section">
      <h2>Pipeline</h2>
      <div className="board">
        {STATUSES.map((status) => {
          const cards = apps.filter((a) => a.status === status);
          return (
            <section
              key={status}
              className={dragOver === status ? "column is-over" : "column"}
              aria-label={STATUS_LABELS[status]}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(status);
              }}
              onDragLeave={() => setDragOver((current) => (current === status ? null : current))}
              onDrop={(e) => handleDrop(e, status)}
            >
              <header className="column-head">
                <h3><span className={`status-dot dot-${status}`} aria-hidden="true" />{STATUS_LABELS[status]}</h3>
                <span className="count">{cards.length}</span>
              </header>
              {cards.map((app) => (
                <ApplicationCard key={app.id} app={app} onOpen={onOpen} onMove={onMove} />
              ))}
              {cards.length === 0 && <p className="empty muted small">Drop a card here</p>}
            </section>
          );
        })}
      </div>
    </section>
  );
}
