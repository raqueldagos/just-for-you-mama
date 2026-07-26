import { createFileRoute, Link } from "@tanstack/react-router";
import { CATEGORIES, ITEMS, type Item } from "@/lib/foryou";
import { useAccessGuard } from "@/hooks/useAccessGuard";

export const Route = createFileRoute("/explore/$cat")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.cat} — Even Me` },
      { name: "description", content: "Small warm things to reach for." },
    ],
  }),
  component: ExploreCat,
});

function ExploreCat() {
  const ok = useAccessGuard();
  const { cat } = Route.useParams();
  const category = CATEGORIES.find((c) => c.key === cat);
  if (!ok) return null;

  if (!category) {
    return (
      <div className="min-h-screen p-6">
        <Link to="/explore" className="text-primary underline">
          Back to explore
        </Link>
      </div>
    );
  }

  const items: Item[] = ITEMS.filter((i) =>
    i.moods.some((m) => category.moods.includes(m)),
  ).slice(0, 30);

  return (
    <div className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-xl">
        <Link to="/explore" className="text-sm text-muted-foreground hover:text-foreground">
          ← Explore
        </Link>
        <h1 className="mt-4 text-3xl font-serif text-foreground">{category.label}</h1>
        <div className="mt-6 space-y-3">
          {items.map((it) => (
            <div
              key={it.id}
              className="rounded-2xl border border-border bg-card p-5 shadow-sm animate-fade-in"
            >
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                {it.kind}
              </p>
              <p className="mt-1 text-foreground leading-relaxed">{it.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
