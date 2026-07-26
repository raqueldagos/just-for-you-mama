import { createFileRoute, Link } from "@tanstack/react-router";
import { ToolRenderer, TOOL_META, type ToolKey } from "@/components/tools";
import { useAccessGuard } from "@/hooks/useAccessGuard";

const KEYS: ToolKey[] = [
  "breath-60", "breath-90", "timer-2", "timer-5", "timer-10",
  "body-scan", "grounding", "name-it", "journal", "permission", "need", "wins", "gratitude",
];

export const Route = createFileRoute("/tool/$key")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.key} — Even Me` },
      { name: "description", content: "A small tool for right now." },
    ],
  }),
  component: ToolPage,
});

function ToolPage() {
  const ok = useAccessGuard();
  const { key } = Route.useParams();
  const k = key as ToolKey;
  if (!ok) return null;
  if (!KEYS.includes(k)) {
    return (
      <div className="min-h-screen p-6">
        <Link to="/explore" className="text-primary underline">Back</Link>
      </div>
    );
  }
  const t = TOOL_META[k];
  return (
    <div className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-xl">
        <Link to="/explore" className="text-sm text-muted-foreground hover:text-foreground">
          ← Explore
        </Link>
        <h1 className="mt-4 text-2xl font-serif text-foreground">{t.title}</h1>
        <p className="text-sm text-muted-foreground">{t.blurb}</p>
        <div className="mt-6 rounded-3xl bg-card border border-border p-6 animate-fade-in">
          <ToolRenderer tool={k} />
        </div>
      </div>
    </div>
  );
}
