import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CONTENT, TILES, addCheckin, type TileKey } from "@/lib/evenme";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/reset/$tile")({
  head: () => ({
    meta: [
      { title: "A moment for you — Even Me" },
      { name: "description", content: "90 seconds. Just for you." },
    ],
  }),
  component: Reset,
});

function Reset() {
  const { tile } = Route.useParams();
  const navigate = useNavigate();
  const t = useT();
  const [copied, setCopied] = useState(false);
  const key = tile as TileKey;
  const content = CONTENT[key];
  const label = TILES.find((x) => x.key === key)?.label ?? "";

  useEffect(() => {
    if (content) addCheckin(key);
  }, [key, content]);

  if (!content) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <Link to="/checkin" className="text-primary underline">
          {t("Back to check-in")}
        </Link>
      </div>
    );
  }

  const share = async () => {
    const text = content.send_template;
    if (typeof navigator !== "undefined" && "share" in navigator) {
      try {
        await navigator.share({ text });
        return;
      } catch {}
    }
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {}
  };

  return (
    <div className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-xl">
        <p className="text-sm text-muted-foreground">{t("You picked")}</p>
        <h1 className="mt-1 text-2xl font-serif text-foreground">{t(label)}</h1>

        <div className="mt-8 rounded-3xl bg-card p-7 border border-border shadow-sm">
          <p className="text-lg leading-relaxed text-card-foreground">
            {t(content.reset)}
          </p>
        </div>

        <button
          onClick={() => navigate({ to: "/metoo/$tile", params: { tile } })}
          className="mt-8 w-full rounded-2xl bg-primary py-4 text-primary-foreground text-lg font-medium hover:opacity-90 transition"
        >
          {t("I'm through it")}
        </button>

        <button
          onClick={share}
          className="mt-3 w-full rounded-2xl bg-transparent py-3 text-muted-foreground text-sm hover:text-foreground transition"
        >
          {copied ? t("Copied — paste it anywhere") : t("Send this to someone")}
        </button>
      </div>
    </div>
  );
}
