import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { KEYS, store, freeUsesLeft, setSubscribed, signOutLocal } from "@/lib/evenme";
import {
  checkSubscription,
  cancelSubscription,
  resumeSubscription,
  changePlan,
} from "@/utils/payments.functions";
import { deleteAccount } from "@/utils/account.functions";

import { getStripeEnvironment } from "@/lib/stripe";
import { useT } from "@/lib/i18n";

const clampTimePart = (value: string, max: number) => {
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed)) return "00";
  return Math.min(Math.max(parsed, 0), max).toString().padStart(2, "0");
};

const normalizeReminderTime = (value: string) => {
  const [hours = "00", minutes = "00"] = value.split(":");
  return `${clampTimePart(hours, 23)}:${clampTimePart(minutes, 59)}`;
};

const cleanReminderTime = (value: string) => value.replace(/[^\d:]/g, "").slice(0, 5);

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
  const navigate = useNavigate();
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
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  async function doDeleteAccount() {
    setBusy(true);
    setMsg(null);
    try {
      const clean = (email || store.get(KEYS.email) || "").trim().toLowerCase();
      if (clean.includes("@")) {
        const res = await deleteAccount({ data: { email: clean } });
        if (!res.ok) {
          setMsg(t("We couldn't delete your account. Please try again."));
          setBusy(false);
          return;
        }
      }
      signOutLocal();
      setShowDeleteConfirm(false);
      navigate({ to: "/" });
    } catch {
      setMsg(t("We couldn't delete your account. Please try again."));
    } finally {
      setBusy(false);
    }
  }


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
    const normalizedReminder = normalizeReminderTime(reminder);
    setReminder(normalizedReminder);
    store.set(KEYS.reminder, normalizedReminder);
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
              type="text"
              inputMode="numeric"
              pattern="[0-9:]*"
              maxLength={5}
              aria-label={t("Daily reminder time")}
              value={reminder}
              onChange={(e) => setReminder(cleanReminderTime(e.target.value))}
              onBlur={() => setReminder((value) => normalizeReminderTime(value))}
              placeholder="19:00"
              className="block h-12 w-28 max-w-full rounded-xl border border-border bg-card px-3 text-center text-base font-medium outline-none focus:ring-2 focus:ring-ring box-border"
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
                      onClick={() => setShowCancelConfirm(true)}
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
                onClick={() => setShowCancelConfirm(true)}
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
            <div className="pt-2 border-t border-border">
              <button
                disabled={busy}
                onClick={() => setShowDeleteConfirm(true)}
                className="mt-4 w-full rounded-2xl bg-destructive py-3 text-sm font-medium text-destructive-foreground hover:opacity-90 transition disabled:opacity-50"
              >
                {t("Delete Account")}
              </button>
              <p className="mt-2 text-xs text-muted-foreground">
                {t("This permanently deletes your account and all data we store about you.")}
              </p>
            </div>

          </div>
        </section>

        <footer className="mt-16 flex flex-col items-center gap-3 text-center">
          <Link to="/resources" className="text-xs text-muted-foreground underline">
            {t("See crisis support resources")}
          </Link>
          <Link to="/privacy" className="text-xs text-muted-foreground underline">
            {t("Privacy Policy")}
          </Link>
        </footer>
      </div>

      {showCancelConfirm && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-3xl bg-card p-6 shadow-xl">
            <h3 className="text-lg font-serif text-foreground">
              {t("Cancel your subscription?")}
            </h3>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              {periodEnd
                ? t(
                    "Your subscription will be canceled, but you'll keep full access until {{date}}. After that, you can still use your free tip or resubscribe anytime."
                  ).replace("{{date}}", new Date(periodEnd).toLocaleDateString())
                : t(
                    "Your subscription will be canceled. You'll keep access until the end of your paid period, then you can still use your free tip or resubscribe anytime."
                  )}
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <button
                disabled={busy}
                onClick={() => {
                  setShowCancelConfirm(false);
                  doCancel();
                }}
                className="w-full rounded-2xl border border-border py-3 text-sm text-muted-foreground hover:bg-muted transition disabled:opacity-50"
              >
                {t("Yes, cancel subscription")}
              </button>
              <button
                onClick={() => setShowCancelConfirm(false)}
                className="w-full rounded-2xl bg-primary py-3 text-primary-foreground text-sm font-medium hover:opacity-90 transition"
              >
                {t("Keep my subscription")}
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-3xl bg-card p-6 shadow-xl">
            <h3 className="text-lg font-serif text-foreground">
              {t("Delete your account?")}
            </h3>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              {t(
                "Are you sure? This will permanently delete your account and data. Your email, saved check-ins and subscription records will be removed and this can't be undone.",
              )}
            </p>
            {msg && <p className="mt-3 text-xs text-destructive">{msg}</p>}
            <div className="mt-6 flex flex-col gap-3">
              <button
                disabled={busy}
                onClick={doDeleteAccount}
                className="w-full rounded-2xl bg-destructive py-3 text-sm font-medium text-destructive-foreground hover:opacity-90 transition disabled:opacity-50"
              >
                {busy ? t("Please wait…") : t("Yes, delete my account")}
              </button>
              <button
                disabled={busy}
                onClick={() => setShowDeleteConfirm(false)}
                className="w-full rounded-2xl bg-primary py-3 text-primary-foreground text-sm font-medium hover:opacity-90 transition disabled:opacity-50"
              >
                {t("Keep my account")}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
