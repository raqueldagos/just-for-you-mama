import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { pickMeToo, type TileKey, CONTENT } from "@/lib/evenme";

export const Route = createFileRoute("/metoo/$tile")({
  head: () => ({
    meta: [
      { title: "Someone else, today — Even Me" },
      { name: "description", content: "You're not the only one." },
    ],
  }),
  component: MeToo,
});

function MeToo() {
  const { tile } = Route.useParams();
  const key = tile as TileKey;
  const line = useMemo(() => (CONTENT[key] ? pickMeToo(key) : ""), [key]);

  return (
    <div className="min-h-screen px-6 py-10 flex items-center">
      <div className="mx-auto max-w-xl w-full">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">
          Someone else, today
        </p>
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
    </div>
  );
}
