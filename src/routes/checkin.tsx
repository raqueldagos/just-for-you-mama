import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { TILES, KEYS, store, hasAccess, trialDaysLeft } from "@/lib/evenme";

export const Route = createFileRoute("/checkin")({
  head: () => ({
    meta: [
      { title: "Today's check-in — Even Me" },
      { name: "description", content: "What was today's hard?" },
    ],
  }),
  component: Checkin,
});

function Checkin() {
  const navigate = useNavigate();
  const [name, setName] = useState<string | null>(null);
  const [access, setAccess] = useState(true);
  const [daysLeft, setDaysLeft] = useState(7);

  useEffect(() => {
    setName(store.get(KEYS.name));
    setAccess(hasAccess());
    setDaysLeft(trialDaysLeft());
  }, []);

  useEffect(() => {
    if (!access) navigate({ to: "/paywall" });
  }, [access, navigate]);

  return (
    <div className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-2xl">
        <header className="mb-8 flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground">
              {name ? `Hi ${name}.` : "Hi."}
            </p>
            <h1 className="mt-1 text-3xl font-serif text-foreground">
              What was today's hard?
            </h1>
          </div>
          <Link
            to="/settings"
            className="rounded-full p-2 text-muted-foreground hover:bg-muted"
            aria-label="Settings"
          >
            <SettingsIcon />
          </Link>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {TILES.map((t) => (
            <button
              key={t.key}
              onClick={() => navigate({ to: "/reset/$tile", params: { tile: t.key } })}
              className="group rounded-3xl bg-card p-6 text-left shadow-sm border border-border hover:border-primary hover:shadow-md transition min-h-32 flex items-end"
            >
              <span className="text-xl font-medium text-card-foreground leading-snug group-hover:text-primary transition">
                {t.label}
              </span>
            </button>
          ))}
        </div>

        <div className="mt-10 flex items-center justify-between text-sm">
          <Link to="/history" className="text-muted-foreground hover:text-foreground">
            Your streak →
          </Link>
          {daysLeft > 0 && daysLeft <= 7 && (
            <span className="text-muted-foreground">
              {daysLeft} free day{daysLeft === 1 ? "" : "s"} left
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function SettingsIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}
