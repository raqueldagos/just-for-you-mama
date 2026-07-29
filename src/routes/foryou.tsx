import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { z } from "zod";
import {
  MOOD_META,
  pickForYou,
  type Item,
  type Mood,
  type Energy,
} from "@/lib/foryou";
import { ToolRenderer, TOOL_META, toolForItemCta, type ToolKey } from "@/components/tools";
import { KEYS, store, isSubscribed, consumeFreeUse, hasAccess, freeUsesLeft } from "@/lib/evenme";
import { useT } from "@/lib/i18n";

const searchSchema = z.object({
  mood: z.string(),
  energy: z.string(),
  note: z.string().optional(),
});

export const Route = createFileRoute("/foryou")({
  validateSearch: (s) => searchSchema.parse(s),
  head: () => ({
    meta: [
      { title: "For you, right now — Even Me" },
      { name: "description", content: "A moment picked for how you are today." },
    ],
  }),
  component: ForYou,
});

function ForYou() {
  const { mood, energy, note } = Route.useSearch();
  const navigate = useNavigate();
  const t = useT();
  const m = mood as Mood;
  const e = energy as Energy;
  const meta = MOOD_META[m] ?? MOOD_META.neutral;

  const [seed, setSeed] = useState(() => Math.floor(Math.random() * 1e9));
  const [seen, setSeen] = useState<string[]>([]);
  const [openTool, setOpenTool] = useState<ToolKey | null>(null);
  const [locked, setLocked] = useState(false);
  const consumedForSeed = useRef<number | null>(null);

  useEffect(() => {
    const savedEmail = store.get(KEYS.email);
    if (!savedEmail) {
      navigate({ to: "/checkin" });
      return;
    }
    if (!hasAccess()) {
      navigate({ to: "/paywall" });
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isSubscribed()) return;
    if (consumedForSeed.current === seed) return;
    consumedForSeed.current = seed;
    consumeFreeUse();
    if (freeUsesLeft() <= 0) setLocked(true);
  }, [seed]);

  const picked = useMemo(() => pickForYou(m, e, { seed, exclude: seen }), [m, e, seed, seen]);

  const another = () => {
    if (!isSubscribed() && !hasAccess()) {
      navigate({ to: "/paywall" });
      return;
    }
    setSeen((s) => [
      ...s,
      ...picked.cards.map((c) => c.id),
      ...(picked.toolAction ? [picked.toolAction.id] : []),
    ].slice(-40));
    setSeed(Math.floor(Math.random() * 1e9));
  };

  const openToolGuarded = (k: ToolKey) => {
    if (!isSubscribed() && !hasAccess()) {
      navigate({ to: "/paywall" });
      return;
    }
    setOpenTool(k);
  };

  if (openTool) {
    const tm = TOOL_META[openTool];
    return (
      <div className="min-h-screen px-6 py-10">
        <div className="mx-auto max-w-xl">
          <button
            onClick={() => setOpenTool(null)}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            {t("← Back to your moment")}
          </button>
          <h1 className="mt-4 text-2xl font-serif text-foreground">{t(tm.title)}</h1>
          <p className="text-sm text-muted-foreground">{t(tm.blurb)}</p>
          <div className="mt-6 rounded-3xl bg-card border border-border p-6 animate-fade-in">
            <ToolRenderer tool={openTool} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-xl">
        <p className="text-sm text-muted-foreground">
          {t("Because you said you're feeling")}
        </p>
        <h1 className="mt-1 text-3xl font-serif text-foreground">
          <span className="mr-2">{meta.emoji}</span>
          {t(meta.label).toLowerCase()}
          {note ? <span className="text-muted-foreground"> · {note}</span> : null}
        </h1>

        <div className="mt-8 space-y-4">
          {picked.cards.map((it, idx) => (
            <ContentCard key={it.id} item={it} index={idx} />
          ))}

          {picked.toolAction && (
            <ToolCard
              item={picked.toolAction}
              onOpen={openToolGuarded}
            />
          )}
        </div>

        <div className="mt-8 flex flex-col gap-3">
          {locked && !isSubscribed() ? (
            <div className="rounded-2xl border border-primary/30 bg-primary/5 p-5 text-center">
              <p className="text-sm text-foreground">
                {t("Your free tip is used. Subscribe to keep going.")}
              </p>
              <button
                onClick={() => navigate({ to: "/paywall" })}
                className="mt-3 w-full rounded-2xl bg-primary py-3 text-primary-foreground font-medium hover:opacity-90 transition"
              >
                {t("Continue")}
              </button>
            </div>
          ) : (
            <button
              onClick={another}
              className="w-full rounded-2xl bg-primary py-4 text-primary-foreground text-lg font-medium hover:opacity-90 transition"
            >
              {t("Give me another")}
            </button>
          )}
          <button
            onClick={() => {
              if (!isSubscribed() && !hasAccess()) {
                navigate({ to: "/paywall" });
                return;
              }
              navigate({ to: "/explore" });
            }}
            className="w-full rounded-2xl border border-border py-3 text-foreground hover:bg-muted transition"
          >
            {t("Explore more tools & advice")}
          </button>
        </div>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          {t("That's enough for today. Come back tomorrow if you want to.")}
        </p>

        <div className="mt-6 text-center">
          <Link to="/resources" className="text-xs text-muted-foreground underline">
            {t("If you're in crisis, tap here.")}
          </Link>
        </div>
      </div>
    </div>
  );
}

function ContentCard({ item, index }: { item: Item; index: number }) {
  const t = useT();
  const styleByKind: Record<string, string> = {
    affirmation: "bg-card border-border",
    reflection: "bg-card border-border",
    advice: "bg-card border-border",
    oneliner: "bg-primary/5 border-primary/20",
    permission: "bg-background border-dashed border-primary/40",
    gratitude: "bg-accent/40 border-accent",
    kindness: "bg-primary/10 border-primary/30",
  };
  const label: Record<string, string> = {
    affirmation: "A gentle truth",
    reflection: "For a moment",
    advice: "Try this",
    oneliner: "Just this",
    permission: "Permission slip",
    gratitude: "A small prompt",
    kindness: "An extra kindness",
    action: "",
  };
  return (
    <div
      className={`animate-fade-in rounded-3xl border p-6 shadow-sm ${styleByKind[item.kind] ?? "bg-card border-border"}`}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {label[item.kind] && (
        <p className="text-xs uppercase tracking-widest text-muted-foreground">
          {t(label[item.kind])}
        </p>
      )}
      <p
        className={`mt-2 text-foreground ${
          item.kind === "oneliner" || item.kind === "kindness"
            ? "text-2xl font-serif leading-snug"
            : "text-lg leading-relaxed"
        }`}
      >
        {t(item.text)}
      </p>
    </div>
  );
}

function ToolCard({ item, onOpen }: { item: Item; onOpen: (k: ToolKey) => void }) {
  const t = useT();
  const key = toolForItemCta(item.cta) ?? "breath-90";
  const meta = TOOL_META[key];
  return (
    <div className="animate-fade-in rounded-3xl border border-secondary/60 bg-secondary/20 p-6">
      <p className="text-xs uppercase tracking-widest text-muted-foreground">{t("Try this next")}</p>
      <p className="mt-2 text-lg text-foreground">{t(item.text)}</p>
      <button
        onClick={() => onOpen(key)}
        className="mt-4 rounded-2xl bg-foreground/90 px-5 py-3 text-background font-medium hover:opacity-90"
      >
        {t(item.cta ?? meta.title)}
      </button>
    </div>
  );
}
