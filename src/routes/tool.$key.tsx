import { createFileRoute, Link } from "@tanstack/react-router";
import { ToolRenderer, TOOL_META, type ToolKey } from "@/components/tools";
import { ALL_TOOLS, TOOL_MATCH } from "@/lib/toolmatch";
import { useAccessGuard } from "@/hooks/useAccessGuard";
import { useT } from "@/lib/i18n";

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
  const t = useT();
  const { key } = Route.useParams();
  const k = key as ToolKey;
  if (!ok) return null;
  if (!ALL_TOOLS.includes(k)) {
    return (
      <div className="min-h-screen p-6">
        <Link to="/explore" className="text-primary underline">{t("← Back")}</Link>
      </div>
    );
  }
  const tm = TOOL_META[k];
  const match = TOOL_MATCH[k];
  return (
    <div className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-xl">
        <Link to="/explore" className="text-sm text-muted-foreground hover:text-foreground">
          {t("← Explore")}
        </Link>
        <h1 className="mt-4 text-2xl font-serif text-foreground">{t(tm.title)}</h1>
        <p className="text-sm text-muted-foreground">{t(tm.blurb)}</p>
        {match && (
          <p className="mt-3 rounded-2xl border border-secondary/60 bg-secondary/20 p-4 text-sm leading-relaxed text-foreground/90">
            {t(match.reason)}
          </p>
        )}
        <div className="mt-6 rounded-3xl bg-card border border-border p-6 animate-fade-in">
          <ToolRenderer tool={k} />
        </div>
      </div>
    </div>
  );
}
