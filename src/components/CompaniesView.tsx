import { STATUS_LABELS, type Application } from "../types";
import { formatShort } from "../lib/date";

interface CompaniesViewProps {
  apps: readonly Application[];
  /** The active search text, used to pick the right empty message. */
  query: string;
  onOpen: (app: Application) => void;
}

interface CompanyGroup {
  name: string;
  apps: Application[];
}

/** Group applications by company name, ignoring case and extra spaces. */
function groupByCompany(apps: readonly Application[]): CompanyGroup[] {
  const groups = new Map<string, CompanyGroup>();
  for (const app of apps) {
    const key = app.company.trim().toLowerCase();
    const group = groups.get(key);
    if (group) group.apps.push(app);
    else groups.set(key, { name: app.company.trim(), apps: [app] });
  }
  return [...groups.values()].toSorted((a, b) => b.apps.length - a.apps.length || a.name.localeCompare(b.name));
}

export function CompaniesView({ apps, query, onOpen }: CompaniesViewProps) {
  const groups = groupByCompany(apps);

  if (groups.length === 0) {
    return <section className="panel"><p className="muted">{query ? `No companies found for "${query}".` : "No companies yet. Add an application to get started."}</p></section>;
  }

  return (
    <div className="companies">
      {groups.map((g) => (
        <section key={g.name.toLowerCase()} className="panel company" aria-label={g.name}>
          <header className="company-head">
            <span className="avatar" aria-hidden="true">{g.name.charAt(0).toUpperCase()}</span>
            <div>
              <h2>{g.name}</h2>
              <span className="muted small">{g.apps.length} application{g.apps.length === 1 ? "" : "s"}</span>
            </div>
          </header>
          <ul className="list">
            {g.apps.map((a) => (
              <li key={a.id} className="list-row compact">
                <div className="grow">
                  <button type="button" className="card-title" onClick={() => onOpen(a)}>{a.role}</button>
                  <div className="muted small">{a.appliedDate ? `Applied ${formatShort(a.appliedDate)}` : "Not applied yet"} · {a.workMode}</div>
                </div>
                <span className={`tag tag-${a.status}`}>{STATUS_LABELS[a.status]}</span>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
