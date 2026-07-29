import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { z } from "zod";
import { MOOD_META, type Item, type Mood, type Energy } from "@/lib/foryou";
import { buildSession, TOOL_MATCH, type SessionStep } from "@/lib/toolmatch";
import { ToolRenderer, TOOL_META, type ToolKey } from "@/components/tools";
import { KEYS, store, isPremium, consumeFreeUse, hasAccess, freeUsesLeft } from "@/lib/evenme";
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
  const [step, setStep] = useState(0);
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
    if (isPremium()) return;
    if (consumedForSeed.current === seed) return;
    consumedForSeed.current = seed;
    consumeFreeUse();
    if (freeUsesLeft() <= 0) setLocked(true);
  }, [seed]);

  const session = useMemo(
    () => buildSession(m, e, { seed, exclude: seen }),
    [m, e, seed, seen],
  );

  const current: SessionStep = session[Math.min(step, session.length - 1)];
  const isLast = step >= session.length - 1;

  const another = () => {
    if (!isPremium() && !hasAccess()) {
      navigate({ to: "/paywall" });
      return;
    }
    setSeen((s) =>
      [
        ...s,
        ...session.flatMap((st) => (st.kind === "card" ? [st.item.id] : [])),
      ].slice(-40),
    );
    setSeed(Math.floor(Math.random() * 1e9));
    setStep(0);
  };

  const openToolGuarded = (k: ToolKey) => {
    if (!isPremium() && !hasAccess()) {
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
      <div className="mx-auto flex min-h-[80vh] max-w-xl flex-col">
        <div>
          <p className="text-sm text-muted-foreground">
            {t("Because you said you're feeling")}
          </p>
          <h1 className="mt-1 text-2xl font-serif text-foreground">
            <span className="mr-2">{meta.emoji}</span>
            {t(meta.label).toLowerCase()}
            {note ? <span className="text-muted-foreground"> · {note}</span> : null}
          </h1>

          <div className="mt-4 flex gap-1.5">
            {session.map((_, n) => (
              <div
                key={n}
                className={`h-1.5 flex-1 rounded-full transition ${
                  n <= step ? "bg-primary" : "bg-muted"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-1 flex-col justify-center py-8">
          <div key={`${seed}-${step}`} className="animate-fade-in">
            {current.kind === "open" && (
              <p className="text-2xl font-serif leading-snug text-foreground">
                {t(current.text)}
              </p>
            )}

            {current.kind === "card" && <ContentCard item={current.item} />}

            {current.kind === "tool" && (
              <ToolStep tools={current.tools} onOpen={openToolGuarded} />
            )}

            {current.kind === "close" && (
              <div className="text-center">
                <p className="text-2xl font-serif leading-snug text-foreground">
                  {t(current.text)}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {!isLast ? (
            <button
              onClick={() => setStep((s) => s + 1)}
              className="w-full rounded-2xl bg-primary py-4 text-lg font-medium text-primary-foreground transition hover:opacity-90"
            >
              {t("Next")}
            </button>
          ) : locked && !isPremium() ? (
            <div className="rounded-2xl border border-primary/30 bg-primary/5 p-5 text-center">
              <p className="text-sm text-foreground">
                {t("Your free tip is used. Subscribe to keep going.")}
              </p>
              <button
                onClick={() => navigate({ to: "/paywall" })}
                className="mt-3 w-full rounded-2xl bg-primary py-3 font-medium text-primary-foreground transition hover:opacity-90"
              >
                {t("Continue")}
              </button>
            </div>
          ) : (
            <button
              onClick={another}
              className="w-full rounded-2xl bg-primary py-4 text-lg font-medium text-primary-foreground transition hover:opacity-90"
            >
              {t("Give me another moment")}
            </button>
          )}

          <div className="flex items-center gap-3">
            {step > 0 && (
              <button
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                className="rounded-2xl border border-border px-5 py-3 text-foreground transition hover:bg-muted"
              >
                {t("← Back")}
              </button>
            )}
            <button
              onClick={() => {
                if (!isPremium() && !hasAccess()) {
                  navigate({ to: "/paywall" });
                  return;
                }
                navigate({ to: "/explore" });
              }}
              className="flex-1 rounded-2xl border border-border py-3 text-foreground transition hover:bg-muted"
            >
              {t("Explore more tools & advice")}
            </button>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link to="/resources" className="text-xs text-muted-foreground underline">
            {t("If you're in crisis, tap here.")}
          </Link>
        </div>
      </div>
    </div>
  );
}

function ContentCard({ item }: { item: Item }) {
  const t = useT();
  const styleByKind: Record<string, string> = {
    affirmation: "bg-card border-border",
    reflection: "bg-card border-border",
    advice: "bg-card border-border",
    action: "bg-secondary/20 border-secondary/60",
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
    action: "Try this next",
  };
  return (
    <div
      className={`rounded-3xl border p-8 shadow-sm ${styleByKind[item.kind] ?? "bg-card border-border"}`}
    >
      {label[item.kind] && (
        <p className="text-xs uppercase tracking-widest text-muted-foreground">
          {t(label[item.kind])}
        </p>
      )}
      <p
        className={`mt-3 text-foreground ${
          item.kind === "oneliner" || item.kind === "kindness"
            ? "text-2xl font-serif leading-snug"
            : "text-xl leading-relaxed"
        }`}
      >
        {t(item.text)}
      </p>
    </div>
  );
}

function ToolStep({
  tools,
  onOpen,
}: {
  tools: ToolKey[];
  onOpen: (k: ToolKey) => void;
}) {
  const t = useT();
  const [i, setI] = useState(0);
  const key = tools[i % tools.length];
  const tm = TOOL_META[key];
  const match = TOOL_MATCH[key];
  return (
    <div className="rounded-3xl border border-secondary/60 bg-secondary/20 p-8">
      <p className="text-xs uppercase tracking-widest text-muted-foreground">
        {t("Picked for you")}
      </p>
      <h2 className="mt-2 text-2xl font-serif text-foreground">{t(tm.title)}</h2>
      <p className="mt-3 text-foreground/90 leading-relaxed">{t(match.reason)}</p>
      <button
        onClick={() => onOpen(key)}
        className="mt-6 w-full rounded-2xl bg-foreground/90 px-5 py-4 font-medium text-background hover:opacity-90"
      >
        {t("Start this")}
      </button>
      {tools.length > 1 && (
        <button
          onClick={() => setI((v) => v + 1)}
          className="mt-3 w-full text-sm text-muted-foreground underline"
        >
          {t("Show me a different one")}
        </button>
      )}
    </div>
  );
}
