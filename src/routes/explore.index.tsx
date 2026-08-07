import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CATEGORIES, type Energy, type Mood } from "@/lib/foryou";
import { TOOL_META, type ToolKey } from "@/components/tools";
import {
  GROUP_META,
  TOOL_MATCH,
  recommendTools,
  toolsByGroup,
  type ToolGroup,
} from "@/lib/toolmatch";
import { useAccessGuard } from "@/hooks/useAccessGuard";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/explore/")({
  head: () => ({
    meta: [
      { title: "Explore — Even Me" },
      { name: "description", content: "Tools and small advice, by how you feel." },
    ],
  }),
  component: Explore,
});

function Explore() {
  const t = useT();
  const ok = useAccessGuard();
  const [picked, setPicked] = useState<ToolKey[]>([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const mood = window.localStorage.getItem("evenme:lastmood") as Mood | null;
    const energy = window.localStorage.getItem("evenme:lastenergy") as Energy | null;
    if (mood && energy) setPicked(recommendTools(mood, energy, 3));
  }, []);

  if (!ok) return null;

  return (
    <div className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-2xl">
        <Link to="/checkin" className="text-sm text-muted-foreground hover:text-foreground">
          {t("← Back")}
        </Link>
        <h1 className="mt-4 text-3xl font-serif text-foreground">{t("Explore")}</h1>
        <p className="mt-1 text-muted-foreground">
          {t("Small things to reach for. No commitment.")}
        </p>

        {picked.length > 0 && (
          <>
            <h2 className="mt-10 text-sm uppercase tracking-widest text-muted-foreground">
              {t("Picked for how you felt today")}
            </h2>
            <div className="mt-3 space-y-3">
              {picked.map((k) => (
                <ToolReasonCard key={k} toolKey={k} />
              ))}
            </div>
          </>
        )}

        <h2 className="mt-10 text-sm uppercase tracking-widest text-muted-foreground">
          {t("By how you feel")}
        </h2>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {CATEGORIES.map((c) => (
            <Link
              key={c.key}
              to="/explore/$cat"
              params={{ cat: c.key }}
              className="rounded-2xl border border-border bg-card p-4 text-card-foreground hover:border-primary transition"
            >
              {t(c.label)}
            </Link>
          ))}
        </div>

        <div className="mt-10">
          <button
            onClick={() => setShowAll((v) => !v)}
            className="w-full rounded-2xl border border-border bg-card px-5 py-4 text-left transition hover:border-primary"
          >
            <span className="font-medium text-card-foreground">{t("All tools")}</span>
            <span className="float-right text-muted-foreground">{showAll ? "−" : "+"}</span>
            <p className="text-xs text-muted-foreground">
              {t("Grouped by what they're for.")}
            </p>
          </button>

          {showAll && (
            <div className="mt-4 space-y-8 animate-fade-in">
              {toolsByGroup().map(({ group, tools }) => (
                <ToolGroupSection key={group} group={group as ToolGroup} tools={tools} />
              ))}
            </div>
          )}

        </div>

        <div className="mt-10 text-center">
          <Link to="/resources" className="text-xs text-muted-foreground underline">
            {t("If you're in crisis, tap here.")}
          </Link>
        </div>
      </div>
    </div>
  );
}

export function ToolReasonCard({ toolKey }: { toolKey: ToolKey }) {
  const t = useT();
  const tm = TOOL_META[toolKey];
  const match = TOOL_MATCH[toolKey];
  return (
    <Link
      to="/tool/$key"
      params={{ key: toolKey }}
      className="block rounded-2xl border border-secondary/60 bg-secondary/20 p-5 transition hover:border-primary"
    >
      <div className="font-medium text-foreground">{t(tm.title)}</div>
      <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{t(match.reason)}</p>
    </Link>
  );
}
