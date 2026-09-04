import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { KEYS, store, signOutLocal } from "@/lib/evenme";
import {
  checkinsCount,
  minutesThisMonth,
  windowStage,
  todaysCheckin,
  slipById,
  feelingLabel,
  quietNoteDue,
  onboardingDone,
  SHARE_TEXT,
  type LocalCheckin,
} from "@/lib/companion";
import { sameFeelingToday } from "@/utils/companion.functions";
import { WindowScene } from "@/components/WindowScene";
import { AddToHomeSheet } from "@/components/AddToHomeSheet";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/home")({
  head: () => ({
    meta: [
      { title: "Still here when you want it — Even Me" },
      {
        name: "description",
        content:
          "Your quiet home in Even Me: the window that waits for you, the minutes you kept, and the permission slips you collected.",
      },
      { property: "og:title", content: "Still here when you want it — Even Me" },
      {
        property: "og:description",
        content: "The window waits. Nothing gets mad if you disappear.",
      },
      { property: "og:url", content: "https://evenme.online/home" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "https://evenme.online/home" }],
  }),
  component: Home,
});

function Home() {
  const t = useT();
  const navigate = useNavigate();
  const [today, setToday] = useState<LocalCheckin | null>(null);
  const [count, setCount] = useState(0);
  const [monthMinutes, setMonthMinutes] = useState(0);
  const [others, setOthers] = useState<number | null>(null);
  const [showA2HS, setShowA2HS] = useState(false);
  const [name, setName] = useState<string | null>(null);

  useEffect(() => {
    if (!onboardingDone() && checkinsCount() === 0) {
      navigate({ to: "/" });
      return;
    }
    const c = todaysCheckin();
    setToday(c);
    setCount(checkinsCount());
    setMonthMinutes(minutesThisMonth());
    setName(store.get(KEYS.name));
    const key = c?.feeling ?? "stretched_thin";
    sameFeelingToday({ data: { feelingKey: key } })
      .then((r) => setOthers(r.count))
      .catch(() => {});
  }, [navigate]);

  const share = async () => {
    const nav = window.navigator as Navigator & {
      share?: (d: { text: string }) => Promise<void>;
    };
    try {
      if (nav.share) await nav.share({ text: SHARE_TEXT });
      else await navigator.clipboard.writeText(SHARE_TEXT);
    } catch {
      /* she changed her mind, that's fine */
    }
  };

  const todaySlip = today ? slipById(today.slipId) : null;

  return (
    <main className="min-h-screen px-6 pb-16 pt-[max(2.5rem,env(safe-area-inset-top))]">
      <div className="mx-auto max-w-md space-y-8">
        <header>
          <h1 className="text-3xl font-serif text-foreground">
            {t("Still here when you want it.")}
          </h1>
          {name && <p className="mt-1 text-sm text-muted-foreground">{name}</p>}
        </header>

        {!today ? (
          <button
            onClick={() => navigate({ to: "/checkin" })}
            className="w-full rounded-3xl bg-primary py-8 text-2xl font-medium text-primary-foreground transition hover:opacity-90"
          >
            {t("90 seconds")}
          </button>
        ) : (
          <div className="space-y-4">
            <p className="text-lg text-foreground">
              {t("You already kept 2 minutes today.")}
            </p>
            {todaySlip && (
              <div className="rounded-3xl border border-border bg-card p-6">
                <p className="text-xl font-serif leading-snug text-card-foreground">
                  {t(todaySlip.text)}
                </p>
              </div>
            )}
          </div>
        )}

        <WindowScene stage={windowStage(count)} />

        <div className="rounded-3xl border border-border p-6">
          <p className="text-sm text-muted-foreground">
            {t("Minutes that were yours this month")}
          </p>
          <p className="mt-1 text-4xl font-serif text-primary">{monthMinutes}</p>
          <p className="mt-3 text-sm text-muted-foreground">
            {others === null
              ? t("Other moms are here today too.")
              : `${others.toLocaleString()} ${t("other moms today felt")} \u201c${t(
                  feelingLabel(today?.feeling ?? "stretched_thin"),
                )}\u201d.`}
          </p>
        </div>

        {quietNoteDue() && (
          <Link
            to="/note"
            className="block rounded-3xl border border-border bg-card p-6 text-card-foreground"
          >
            <p className="font-serif text-xl">{t("A quiet note")}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("A few lines about your week. No charts.")}
            </p>
          </Link>
        )}

        {count >= 2 && (
          <button
            onClick={share}
            className="w-full rounded-2xl border border-border py-4 text-sm text-muted-foreground transition hover:bg-muted"
          >
            {t("Send this to one mom who is always \u201cfine\u201d.")}
          </button>
        )}

        <nav className="flex flex-col gap-3 text-sm">
          <Link to="/slips" className="text-foreground underline">
            {t("Your slips")}
          </Link>
          <button onClick={() => setShowA2HS(true)} className="text-left text-muted-foreground underline">
            {t("Add to Home Screen")}
          </button>
          <Link to="/settings" className="text-muted-foreground underline">
            {t("Settings")}
          </Link>
          <Link to="/resources" className="text-muted-foreground underline">
            {t("See crisis support resources")}
          </Link>
          <button
            onClick={() => {
              signOutLocal();
              navigate({ to: "/" });
            }}
            className="text-left text-muted-foreground underline"
          >
            {t("Sign out")}
          </button>
        </nav>
      </div>

      {showA2HS && <AddToHomeSheet onClose={() => setShowA2HS(false)} />}
    </main>
  );
}
