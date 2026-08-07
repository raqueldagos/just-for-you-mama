import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CATEGORIES, ITEMS, type Item } from "@/lib/foryou";
import { recommendForMoods } from "@/lib/toolmatch";
import { ToolReasonCard } from "@/routes/explore.index";
import { useAccessGuard } from "@/hooks/useAccessGuard";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/explore/$cat")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.cat} — Even Me` },
      { name: "description", content: "Small warm things to reach for." },
    ],
  }),
  component: ExploreCat,
});

function pickThree<T>(list: T[], round: number): T[] {
  if (list.length <= 3) return list;
  const start = (round * 3) % list.length;
  return Array.from({ length: 3 }, (_, i) => list[(start + i) % list.length]);
}

function ExploreCat() {
  const ok = useAccessGuard();
  const t = useT();
  const { cat } = Route.useParams();
  const category = CATEGORIES.find((c) => c.key === cat);
  const [round, setRound] = useState(0);

  const pool: Item[] = useMemo(
    () =>
      category
        ? ITEMS.filter((i) => i.moods.some((m) => category.moods.includes(m)))
        : [],
    [category],
  );
  const tools = useMemo(
    () => (category ? recommendForMoods(category.moods, 3) : []),
    [category],
  );

  if (!ok) return null;

  if (!category) {
    return (
      <div className="min-h-screen p-6">
        <Link to="/explore" className="text-primary underline">
          {t("Back to explore")}
        </Link>
      </div>
    );
  }

  const items = pickThree(pool, round);

  return (
    <div className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-xl">
        <Link to="/explore" className="text-sm text-muted-foreground hover:text-foreground">
          {t("← Explore")}
        </Link>
        <h1 className="mt-4 text-3xl font-serif text-foreground">{t(category.label)}</h1>

        {tools.length > 0 && (
          <>
            <h2 className="mt-8 text-sm uppercase tracking-widest text-muted-foreground">
              {t("Tools that help with this")}
            </h2>
            <div className="mt-3 space-y-3">
              {tools.map((k) => (
                <ToolReasonCard key={k} toolKey={k} />
              ))}
            </div>
          </>
        )}

        <h2 className="mt-10 text-sm uppercase tracking-widest text-muted-foreground">
          {t("Words for this")}
        </h2>
        <p className="mt-1 text-xs text-muted-foreground">
          {t("Three at a time. That's on purpose.")}
        </p>
        <div className="mt-3 space-y-3">
          {items.map((it) => (
            <div
              key={`${round}-${it.id}`}
              className="rounded-2xl border border-border bg-card p-5 shadow-sm animate-fade-in"
            >
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                {it.kind}
              </p>
              <p className="mt-1 text-foreground leading-relaxed">{t(it.text)}</p>
            </div>
          ))}
        </div>
        {pool.length > 3 && (
          <button
            onClick={() => setRound((r) => r + 1)}
            className="mt-4 w-full rounded-2xl border border-border py-3 text-foreground transition hover:bg-muted"
          >
            {t("Show me three more")}
          </button>
        )}
      </div>
    </div>
  );
}

