import { createFileRoute, Link } from "@tanstack/react-router";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/resources")({
  head: () => ({
    meta: [
      { title: "If you're in crisis — Even Me" },
      {
        name: "description",
        content:
          "Crisis support lines you can call or text right now: 988 Lifeline, Crisis Text Line, Postpartum Support International, and international help.",
      },
      { property: "og:title", content: "If you're in crisis — Even Me" },
      {
        property: "og:description",
        content: "Crisis support phone and text lines you can reach right now.",
      },
      { property: "og:url", content: "https://evenme.online/resources" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "https://evenme.online/resources" }],
  }),
  component: Resources,
});

function Resources() {
  const t = useT();
  return (
    <main className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-xl">
        <Link to="/checkin" className="text-sm text-muted-foreground hover:text-foreground">
          {t("← Back")}
        </Link>
        <h1 className="mt-4 text-3xl font-serif text-foreground">
          {t("If you're in crisis")}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {t("This app isn't equipped for emergencies. These humans are.")}
        </p>

        <ul className="mt-8 space-y-4">
          <li className="rounded-3xl bg-card border border-border p-5">
            <p className="font-medium text-card-foreground">{t("988 Suicide & Crisis Lifeline (US)")}</p>
            <a href="tel:988" className="mt-1 block text-primary text-lg">{t("Call or text 988")}</a>
          </li>
          <li className="rounded-3xl bg-card border border-border p-5">
            <p className="font-medium text-card-foreground">{t("Crisis Text Line")}</p>
            <a href="sms:741741" className="mt-1 block text-primary text-lg">{t("Text HOME to 741741")}</a>
          </li>
          <li className="rounded-3xl bg-card border border-border p-5">
            <p className="font-medium text-card-foreground">{t("Postpartum Support International")}</p>
            <a href="tel:18009447773" className="mt-1 block text-primary text-lg">1-800-944-4773</a>
          </li>
          <li className="rounded-3xl bg-card border border-border p-5">
            <p className="font-medium text-card-foreground">{t("CVV — Centro de Valorização da Vida (Brasil)")}</p>
            <a href="tel:188" className="mt-1 block text-primary text-lg">{t("Call 188 — 24/7")}</a>
          </li>
          <li className="rounded-3xl bg-card border border-border p-5">
            <p className="font-medium text-card-foreground">{t("Outside the US")}</p>
            <a
              href="https://findahelpline.com"
              target="_blank"
              rel="noreferrer"
              className="mt-1 block text-primary text-lg"
            >
              findahelpline.com
            </a>
          </li>
        </ul>
      </div>
    </main>
  );
}
