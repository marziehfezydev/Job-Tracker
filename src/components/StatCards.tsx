import type { Stats } from "../lib/stats";

interface Card {
  label: string;
  value: number;
  note: string;
  featured?: boolean;
}

export function StatCards({ stats }: { stats: Stats }) {
  const cards: Card[] = [
    { label: "Total applications", value: stats.total, note: `${stats.thisWeek} this week`, featured: true },
    { label: "Active in pipeline", value: stats.active, note: "Applied + interview" },
    { label: "Interviews", value: stats.interviews, note: "In progress" },
    { label: "Offers", value: stats.offers, note: stats.offers > 0 ? "Congratulations!" : "Keep going" },
  ];

  return (
    <section aria-label="Summary" className="stats">
      {cards.map((c) => (
        <div key={c.label} className={c.featured ? "stat-card is-featured" : "stat-card"}>
          <span className="stat-label">{c.label}</span>
          <span className="stat-value">{c.value}</span>
          <span className="stat-note">{c.note}</span>
        </div>
      ))}
    </section>
  );
}
