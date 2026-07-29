import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { KEYS, store, freeUsesLeft, setSubscribed, signOutLocal } from "@/lib/evenme";
import {
  checkSubscription,
  cancelSubscription,
  resumeSubscription,
  changePlan,
} from "@/utils/payments.functions";
import { getStripeEnvironment } from "@/lib/stripe";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Even Me" },
      {
        name: "description",
        content:
          "Update your name, daily reminder time, email, and manage your Even Me subscription — switch plans, cancel, or resume anytime.",
      },
      { property: "og:title", content: "Settings — Even Me" },
      {
        property: "og:description",
        content: "Update your reminder, email, and manage your Even Me subscription.",
      },
      { property: "og:url", content: "https://evenme.online/settings" },
      { property: "og:type", content: "website" },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "https://evenme.online/settings" }],
  }),
  component: Settings,
});

function Settings() {
  const t = useT();
  const [reminder, setReminder] = useState("19:00");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subStatus, setSubStatus] = useState<string | null>(null);
  const [subActive, setSubActive] = useState(false);
  const [periodEnd, setPeriodEnd] = useState<string | null>(null);
  const [cancelAtEnd, setCancelAtEnd] = useState(false);
  const [priceId, setPriceId] = useState<string | null>(null);
  const [usesLeft, setUsesLeft] = useState(1);
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const refresh = async (e: string) => {
    try {
      const res = await checkSubscription({
        data: { email: e, environment: getStripeEnvironment() },
      });
      setSubActive(res.active);
      setSubStatus(res.status);
      setPeriodEnd(res.currentPeriodEnd);
      setCancelAtEnd(res.cancelAtPeriodEnd);
      setPriceId(res.priceId);
      setSubscribed(res.active);
    } catch {}
  };

  useEffect(() => {
    setReminder(store.get(KEYS.reminder) ?? "19:00");
    setName(store.get(KEYS.name) ?? "");
    setEmail(store.get(KEYS.email) ?? "");
    setUsesLeft(freeUsesLeft());
    const e = store.get(KEYS.email);
    if (e) refresh(e);
  }, []);

  const save = () => {
    store.set(KEYS.reminder, reminder);
    store.set(KEYS.name, name);
    if (email) store.set(KEYS.email, email.trim().toLowerCase());
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const run = async (fn: () => Promise<{ ok: true } | { error: string }>, okMsg: string) => {
    if (!email) return;
    setBusy(true);
    setMsg(null);
    const res = await fn();
    if ("error" in res) setMsg(res.error);
    else {
      setMsg(okMsg);
      await refresh(email);
    }
    setBusy(false);
  };

  const doCancel = () =>
    run(
      () => cancelSubscription({ data: { email, environment: getStripeEnvironment() } }),
      t("Canceled. You'll keep access until your period ends."),
    );

  const doResume = () =>
    run(
      () => resumeSubscription({ data: { email, environment: getStripeEnvironment() } }),
      t("Subscription resumed."),
    );

  const doSwitch = (newPriceId: string) =>
    run(
      () => changePlan({ data: { email, newPriceId, environment: getStripeEnvironment() } }),
      t("Plan switched. You'll be prorated for the difference."),
    );

  const otherPlan =
    priceId === "even_me_annual" ? "even_me_weekly" : "even_me_annual";
  const otherLabel =
    priceId === "even_me_annual" ? t("Switch to weekly ($4.99/wk)") : t("Switch to annual ($79/yr)");

  return (
    <div className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-xl">
        <Link to="/checkin" className="text-sm text-muted-foreground hover:text-foreground">
          {t("← Back")}
        </Link>
        <h1 className="mt-4 text-3xl font-serif text-foreground">{t("Settings")}</h1>

        <section className="mt-8 space-y-4">
          <div>
            <label className="block text-sm text-muted-foreground mb-2">{t("Your name")}</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-2xl border border-border bg-card px-5 py-4 outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="block text-sm text-muted-foreground mb-2">
              {t("Daily reminder time")}
            </label>
            <input
              type="time"
              value={reminder}
              onChange={(e) => setReminder(e.target.value)}
              className="w-full rounded-2xl border border-border bg-card px-5 py-4 outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <button
            onClick={save}
            className="w-full rounded-2xl bg-primary py-3 text-primary-foreground font-medium hover:opacity-90 transition"
          >
            {saved ? t("Saved") : t("Save")}
          </button>
        </section>

        <section className="mt-10">
          <h2 className="text-sm uppercase tracking-widest text-muted-foreground">
            {t("Subscription")}
          </h2>
          <div className="mt-4 rounded-3xl bg-card border border-border p-6 space-y-4">
            {subActive ? (
              <>
                <p className="text-foreground font-medium">{t("You're subscribed. Thank you.")}</p>
                {periodEnd && (
                  <p className="text-sm text-muted-foreground">
                    {cancelAtEnd
                      ? `${t("Ends")} ${new Date(periodEnd).toLocaleDateString()}. ${t("You'll keep access until then.")}`
                      : `${t("Renews")} ${new Date(periodEnd).toLocaleDateString()}.`}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">{t("Status")}: {subStatus}</p>

                <div className="pt-2 flex flex-col gap-2">
                  {priceId && (priceId === "even_me_annual" || priceId === "even_me_weekly") && (
                    <button
                      disabled={busy}
                      onClick={() => doSwitch(otherPlan)}
                      className="w-full rounded-2xl border border-border py-3 text-sm hover:bg-muted transition disabled:opacity-50"
                    >
                      {otherLabel}
                    </button>
                  )}
                  {cancelAtEnd ? (
                    <button
                      disabled={busy}
                      onClick={doResume}
                      className="w-full rounded-2xl bg-primary py-3 text-primary-foreground text-sm font-medium hover:opacity-90 transition disabled:opacity-50"
                    >
                      {t("Resume subscription")}
                    </button>
                  ) : (
                    <button
                      disabled={busy}
                      onClick={doCancel}
                      className="w-full rounded-2xl border border-border py-3 text-sm text-muted-foreground hover:bg-muted transition disabled:opacity-50"
                    >
                      {t("Cancel subscription")}
                    </button>
                  )}
                </div>
                {msg && <p className="text-xs text-muted-foreground">{msg}</p>}
              </>
            ) : (
              <>
                <p className="text-foreground">
                  {usesLeft > 0 ? t("You have 1 free tip left.") : t("Your free tip is used.")}
                </p>

                <Link
                  to="/paywall"
                  className="mt-4 inline-block rounded-2xl bg-primary px-5 py-3 text-primary-foreground font-medium hover:opacity-90 transition"
                >
                  {t("See plans")}
                </Link>
              </>
            )}
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-sm uppercase tracking-widest text-muted-foreground">
            {t("Account")}
          </h2>
          <div className="mt-4 rounded-3xl bg-card border border-border p-6 space-y-4">
            <div>
              <button
                disabled={busy || !subActive || cancelAtEnd}
                onClick={doCancel}
                className="w-full rounded-2xl border border-border py-3 text-sm text-muted-foreground hover:bg-muted transition disabled:opacity-50"
              >
                {t("Unsubscribe")}
              </button>
              <p className="mt-2 text-xs text-muted-foreground">
                {subActive
                  ? t("You'll keep access until the end of your paid period.")
                  : t("You don't have an active subscription.")}
              </p>
            </div>
            <div className="pt-2 border-t border-border">
              <button
                onClick={() => {
                  signOutLocal();
                  navigate({ to: "/" });
                }}
                className="mt-4 w-full rounded-2xl border border-destructive/40 py-3 text-sm text-destructive hover:bg-destructive/5 transition"
              >
                {t("Log out")}
              </button>
              <p className="mt-2 text-xs text-muted-foreground">
                {t("This clears your name, email and check-ins saved on this device.")}
              </p>
            </div>
          </div>
        </section>

        <footer className="mt-16 text-center">
          <Link to="/resources" className="text-xs text-muted-foreground underline">
            {t("See crisis support resources")}
          </Link>
        </footer>
      </div>
    </div>
  );
}
