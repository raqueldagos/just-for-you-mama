import { createFileRoute, Link } from "@tanstack/react-router";
import { CATEGORIES } from "@/lib/foryou";
import { TOOL_META, type ToolKey } from "@/components/tools";

export const Route = createFileRoute("/explore")({
  head: () => ({
    meta: [
      { title: "Explore — Even Me" },
      { name: "description", content: "Tools and small advice, by how you feel." },
    ],
  }),
  component: Explore,
});

const TOOL_LIST: ToolKey[] = [
  "breath-60", "breath-90", "timer-2", "timer-5", "timer-10",
  "body-scan", "grounding", "name-it", "journal", "permission", "need", "wins", "gratitude",
];

function Explore() {
  return (
    <div className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-2xl">
        <Link to="/checkin" className="text-sm text-muted-foreground hover:text-foreground">
          ← Back
        </Link>
        <h1 className="mt-4 text-3xl font-serif text-foreground">Explore</h1>
        <p className="mt-1 text-muted-foreground">
          Small things to reach for. No commitment.
        </p>

        <h2 className="mt-10 text-sm uppercase tracking-widest text-muted-foreground">
          By how you feel
        </h2>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {CATEGORIES.map((c) => (
            <Link
              key={c.key}
              to="/explore/$cat"
              params={{ cat: c.key }}
              className="rounded-2xl border border-border bg-card p-4 text-card-foreground hover:border-primary transition"
            >
              {c.label}
            </Link>
          ))}
        </div>

        <h2 className="mt-10 text-sm uppercase tracking-widest text-muted-foreground">
          Tools
        </h2>
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
          {TOOL_LIST.map((k) => {
            const t = TOOL_META[k];
            return (
              <Link
                key={k}
                to="/tool/$key"
                params={{ key: k }}
                className="rounded-2xl border border-border bg-card p-4 hover:border-primary transition"
              >
                <div className="font-medium text-card-foreground">{t.title}</div>
                <div className="text-xs text-muted-foreground">{t.blurb}</div>
              </Link>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <Link to="/resources" className="text-xs text-muted-foreground underline">
            If you're in crisis, tap here.
          </Link>
        </div>
      </div>
    </div>
  );
}
