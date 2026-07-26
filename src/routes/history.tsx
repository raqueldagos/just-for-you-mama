import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getCheckins, streakCount, type Checkin } from "@/lib/evenme";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "Your streak — Even Me" },
      { name: "description", content: "Days you showed up for you." },
    ],
  }),
  component: History,
});

const TILE_COLORS: Record<string, string> = {
  meltdown: "bg-primary",
  school_call: "bg-chart-3",
  sensory_overload: "bg-chart-4",
  masking: "bg-secondary",
  guilt_spiral: "bg-accent",
  lost_it: "bg-chart-5",
};

function History() {
  const [checkins, setCheckins] = useState<Checkin[]>([]);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    setCheckins(getCheckins());
    setStreak(streakCount());
  }, []);

  // build last 42 days grid
  const days: { date: string; tile?: string }[] = [];
  const today = new Date();
  const map = new Map(checkins.map((c) => [c.date, c.tile]));
  for (let i = 41; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    days.push({ date: iso, tile: map.get(iso) });
  }

  return (
    <div className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-xl">
        <Link to="/checkin" className="text-sm text-muted-foreground hover:text-foreground">
          ← Back
        </Link>

        <div className="mt-6 rounded-3xl bg-card border border-border p-8 text-center">
          <p className="text-6xl font-serif text-primary">{streak}</p>
          <p className="mt-2 text-muted-foreground">
            day{streak === 1 ? "" : "s"} you showed up for you
          </p>
        </div>

        <h2 className="mt-10 text-sm uppercase tracking-widest text-muted-foreground">
          Last 6 weeks
        </h2>
        <div className="mt-4 grid grid-cols-7 gap-2">
          {days.map((d) => (
            <div
              key={d.date}
              title={d.date + (d.tile ? ` — ${d.tile}` : "")}
              className={`aspect-square rounded-lg border border-border ${
                d.tile ? TILE_COLORS[d.tile] ?? "bg-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>
        <p className="mt-6 text-xs text-muted-foreground">
          Just dates. No notes, no exports, no data about your kid. Ever.
        </p>
      </div>
    </div>
  );
}
