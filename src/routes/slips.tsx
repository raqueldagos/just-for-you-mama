import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SLIPS, getSlips, type Slip } from "@/lib/companion";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/slips")({
  head: () => ({
    meta: [
      { title: "Your slips — Even Me" },
      {
        name: "description",
        content:
          "The permission slips you've collected — small pieces of allowance you can keep, reread, and screenshot whenever you need them.",
      },
      { property: "og:title", content: "Your slips — Even Me" },
      {
        property: "og:description",
        content: "Small permissions you collected, one check-in at a time.",
      },
      { property: "og:url", content: "https://evenme.online/slips" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "https://evenme.online/slips" }],
  }),
  component: Slips,
});

function Slips() {
  const t = useT();
  const [owned, setOwned] = useState<string[]>([]);
  const [open, setOpen] = useState<Slip | null>(null);

  useEffect(() => {
    setOwned(getSlips());
  }, []);

  const ownedSet = new Set(owned);

  return (
    <main className="min-h-screen px-6 pb-16 pt-[max(2.5rem,env(safe-area-inset-top))]">
      <div className="mx-auto max-w-md">
        <Link to="/home" className="text-sm text-muted-foreground hover:text-foreground">
          {t("← Back")}
        </Link>

        <h1 className="mt-6 text-3xl font-serif text-foreground">{t("Your slips")}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {owned.length} {t("drawn so far. The rest are just waiting.")}
        </p>

        <div className="mt-8 grid grid-cols-2 gap-3">
          {SLIPS.map((s) => {
            const have = ownedSet.has(s.id);
            return (
              <button
                key={s.id}
                onClick={() => have && setOpen(s)}
                className={`min-h-32 rounded-2xl border p-4 text-left text-sm leading-snug transition ${
                  have
                    ? "border-border bg-card text-card-foreground hover:border-primary/60"
                    : "border-border/50 bg-card/40 text-muted-foreground/40"
                }`}
              >
                {have ? t(s.text) : t("Not drawn yet.")}
              </button>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <Link to="/checkin" className="text-sm text-muted-foreground underline">
            {t("90 seconds")}
          </Link>
        </div>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background px-8"
          onClick={() => setOpen(null)}
        >
          <div className="max-w-md text-center">
            <p className="text-3xl font-serif leading-snug text-foreground">{t(open.text)}</p>
            <p className="mt-10 text-xs text-muted-foreground">{t("Tap anywhere to close.")}</p>
          </div>
        </div>
      )}
    </main>
  );
}
