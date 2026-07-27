import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { pickMeToo, type TileKey, CONTENT } from "@/lib/evenme";

export const Route = createFileRoute("/metoo/$tile")({
  head: ({ params }) => ({
    meta: [
      { title: "Someone else, today — Even Me" },
      {
        name: "description",
        content:
          "A short anonymized line from another mother who picked the same hard thing today. You're not the only one carrying this.",
      },
      { property: "og:title", content: "Someone else, today — Even Me" },
      {
        property: "og:description",
        content: "A short anonymized line from another mother — you're not the only one.",
      },
      {
        property: "og:url",
        content: `https://evenme.online/metoo/${params.tile}`,
      },
      { property: "og:type", content: "article" },
    ],
    links: [
      {
        rel: "canonical",
        href: `https://evenme.online/metoo/${params.tile}`,
      },
    ],
  }),
  component: MeToo,
});

function MeToo() {
  const { tile } = Route.useParams();
  const key = tile as TileKey;
  const line = useMemo(() => (CONTENT[key] ? pickMeToo(key) : ""), [key]);

  return (
    <main className="min-h-screen px-6 py-10 flex items-center">
      <div className="mx-auto max-w-xl w-full">
        <h1 className="text-xs uppercase tracking-widest text-muted-foreground font-normal">
          Someone else, today
        </h1>
        <blockquote className="mt-6 rounded-3xl bg-accent p-8 border border-border">
          <p className="text-xl font-serif leading-relaxed text-accent-foreground">
            "{line}"
          </p>
        </blockquote>
        <Link
          to="/checkin"
          className="mt-10 block w-full text-center rounded-2xl bg-primary py-4 text-primary-foreground text-lg font-medium hover:opacity-90 transition"
        >
          Done for today
        </Link>
        <Link
          to="/history"
          className="mt-3 block text-center text-sm text-muted-foreground hover:text-foreground"
        >
          See your streak
        </Link>
      </div>
    </main>
  );
}
