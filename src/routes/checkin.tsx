import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  KEYS,
  store,
  hasAccess,
  freeUsesLeft,
  setSubscribed,
  isPremium,
  addMoodCheckin,
} from "@/lib/evenme";
import { MOOD_META, ENERGY_META, type Mood, type Energy } from "@/lib/foryou";
import { checkSubscription } from "@/utils/payments.functions";
import { captureLead } from "@/utils/leads.functions";
import { getStripeEnvironment } from "@/lib/stripe";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/checkin")({
  head: () => ({
    meta: [
      { title: "Today's check-in — Even Me" },
      {
        name: "description",
        content:
          "A gentle 90-second daily check-in for all mothers. Pick a mood, an energy level, and get something small for you.",
      },
      { property: "og:title", content: "Today's check-in — Even Me" },
      {
        property: "og:description",
        content: "A gentle 90-second daily check-in — for you, not your child.",
      },
      { property: "og:url", content: "https://evenme.online/checkin" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "https://evenme.online/checkin" }],
  }),
  component: Checkin,
});

const MOODS: Mood[] = [
  "tired", "overwhelmed", "anxious", "low",
  "neutral", "content", "energized", "grateful",
  "angry", "lonely", "guilty", "numb",
];
const ENERGIES: Energy[] = ["empty", "low", "steady", "bright"];

function Checkin() {
  const navigate = useNavigate();
  const t = useT();
  const [name, setName] = useState<string | null>(null);
  const [access, setAccess] = useState(true);
  const [usesLeft, setUsesLeft] = useState(1);
  const [step, setStep] = useState<0 | 1 | 2 | 3>(0);
  const [mood, setMood] = useState<Mood | null>(null);
  const [energy, setEnergy] = useState<Energy | null>(null);
  const [note, setNote] = useState("");
  const [email, setEmail] = useState<string>(() => store.get(KEYS.email) ?? "");
  const [emailError, setEmailError] = useState<string | null>(null);

  useEffect(() => {
    setName(store.get(KEYS.name));
    setUsesLeft(freeUsesLeft());
    const savedEmail = store.get(KEYS.email);
    let cancelled = false;
    (async () => {
      if (savedEmail) {
        try {
          const res = await checkSubscription({
            data: { email: savedEmail, environment: getStripeEnvironment() },
          });
          if (cancelled) return;
          setSubscribed(res.active);
        } catch {}
      }
      if (cancelled) return;
      const ok = isPremium() || freeUsesLeft() > 0;
      setAccess(ok);
      if (!ok) navigate({ to: "/paywall" });
    })();
    setAccess(hasAccess());
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  const finish = (m: Mood, e: Energy, n: string, mail: string) => {
    const clean = mail.trim().toLowerCase();
    store.set(KEYS.email, clean);
    const savedName = store.get(KEYS.name);
    captureLead({ data: { email: clean, name: savedName ?? undefined } }).catch(
      () => {},
    );
    addMoodCheckin(m, e, n || undefined);
    navigate({
      to: "/foryou",
      search: { mood: m, energy: e, note: n || undefined },
    });
  };

  const submitFinal = () => {
    if (!mood || !energy) return;
    const clean = email.trim();
    if (!clean || !clean.includes("@") || clean.length < 5) {
      setEmailError(t("Please enter a valid email so we can remember you."));
      return;
    }
    setEmailError(null);
    finish(mood, energy, note, clean);
  };

  if (!access) return null;

  return (
    <div className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-2xl">
        <header className="mb-8">
          <div>
            <p className="text-sm text-muted-foreground">
              {name ? `${t("Hi.").replace(".", "")} ${name}.` : t("Hi.")}
            </p>
            <h1 className="mt-1 text-3xl font-serif text-foreground">
              {step === 0 && t("How are you, right now?")}
              {step === 1 && t("How much do you have in the tank?")}
              {step === 2 && t("One word for today?")}
              {step === 3 && t("Where should we send it?")}
            </h1>
          </div>
        </header>

        <div className="mb-8 flex gap-2">
          {[0, 1, 2, 3].map((n) => (
            <div
              key={n}
              className={`h-1.5 w-8 rounded-full transition-colors ${
                n <= step ? "bg-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>

        {step === 0 && (
          <div className="animate-fade-in grid grid-cols-2 sm:grid-cols-3 gap-3">
            {MOODS.map((m) => {
              const meta = MOOD_META[m];
              const active = mood === m;
              return (
                <button
                  key={m}
                  onClick={() => {
                    setMood(m);
                    setTimeout(() => setStep(1), 120);
                  }}
                  className={`rounded-2xl border p-4 text-left transition min-h-24 ${
                    active
                      ? "border-primary bg-primary/5"
                      : "border-border bg-card hover:border-primary/60 hover:shadow-sm"
                  }`}
                >
                  <div className="text-2xl">{meta.emoji}</div>
                  <div className="mt-1 font-medium text-card-foreground">{t(meta.label)}</div>
                  <div className="text-xs text-muted-foreground">{t(meta.blurb)}</div>
                </button>
              );
            })}
          </div>
        )}

        {step === 1 && (
          <div className="animate-fade-in space-y-3">
            {ENERGIES.map((e) => {
              const meta = ENERGY_META[e];
              return (
                <button
                  key={e}
                  onClick={() => {
                    setEnergy(e);
                    setTimeout(() => setStep(2), 120);
                  }}
                  className={`w-full rounded-2xl border bg-card p-5 text-left transition ${
                    energy === e
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/60"
                  }`}
                >
                  <div className="font-medium text-card-foreground">{t(meta.label)}</div>
                  <div className="text-sm text-muted-foreground">{t(meta.blurb)}</div>
                </button>
              );
            })}
          </div>
        )}

        {step === 2 && (
          <div className="animate-fade-in space-y-4">
            <input
              value={note}
              onChange={(e) => setNote(e.target.value.slice(0, 24))}
              placeholder={t("foggy, tender, wired, okay…")}
              className="w-full rounded-2xl border border-border bg-card px-5 py-4 text-lg outline-none focus:ring-2 focus:ring-ring"
              autoFocus
            />
            <p className="text-xs text-muted-foreground">{t("Optional. One word is plenty.")}</p>
            <button
              onClick={() => {
                if (!mood || !energy) return;
                const saved = store.get(KEYS.email);
                if (saved) finish(mood, energy, note, saved);
                else setStep(3);
              }}
              className="w-full rounded-2xl bg-primary py-4 text-primary-foreground text-lg font-medium hover:opacity-90 transition"
            >
              {t("Show me something for right now")}
            </button>
            <button
              onClick={() => {
                if (!mood || !energy) return;
                const saved = store.get(KEYS.email);
                if (saved) finish(mood, energy, "", saved);
                else {
                  setNote("");
                  setStep(3);
                }
              }}
              className="w-full rounded-2xl bg-transparent py-2 text-sm text-muted-foreground hover:text-foreground"
            >
              {t("Skip the word")}
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="animate-fade-in space-y-4">
            <p className="text-muted-foreground">
              {t("Your email — so we can remember you and send your welcome note. No spam.")}
            </p>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-2xl border border-border bg-card px-5 py-4 text-lg outline-none focus:ring-2 focus:ring-ring"
              autoFocus
            />
            {emailError && (
              <p className="text-sm text-destructive">{emailError}</p>
            )}
            <button
              onClick={submitFinal}
              className="w-full rounded-2xl bg-primary py-4 text-primary-foreground text-lg font-medium hover:opacity-90 transition"
            >
              {t("Show me something for right now")}
            </button>
          </div>
        )}

        <div className="mt-10 flex items-center justify-between text-sm">
          <Link to="/history" className="text-muted-foreground hover:text-foreground">
            {t("Your streak →")}
          </Link>
          <Link to="/explore" className="text-muted-foreground hover:text-foreground">
            {t("Explore tools & advice →")}
          </Link>
        </div>

        {!isPremium() && usesLeft > 0 && (
          <p className="mt-4 text-right text-xs text-muted-foreground">
            {usesLeft} {t("free tip left")}
          </p>
        )}

        <div className="mt-8 flex flex-col items-center gap-3 text-center">
          <Link
            to="/settings"
            className="inline-flex items-center gap-2 rounded-2xl border border-border px-5 py-3 text-sm text-muted-foreground hover:bg-muted transition"
            aria-label={t("Settings")}
          >
            <SettingsIcon />
            {t("Settings")}
          </Link>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <Link to="/resources" className="underline">
              {t("See crisis support resources")}
            </Link>
            <Link to="/privacy" className="underline">
              {t("Privacy Policy")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingsIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}
