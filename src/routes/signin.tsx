import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { checkSubscription } from "@/utils/payments.functions";
import { getStripeEnvironment } from "@/lib/stripe";
import { KEYS, store, ensureTrialStart, setSubscribed, isUnlimitedUser } from "@/lib/evenme";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/signin")({
  head: () => ({
    meta: [
      { title: "Sign in — Even Me" },
      {
        name: "description",
        content:
          "Already using Even Me? Sign in with your email to bring your subscription and your check-in back to this device.",
      },
      { property: "og:title", content: "Sign in — Even Me" },
      {
        property: "og:description",
        content: "Enter the email you used before to restore your Even Me access on this device.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://evenme.online/signin" },
    ],
    links: [{ rel: "canonical", href: "https://evenme.online/signin" }],
  }),
  component: SignIn,
});

function SignIn() {
  const t = useT();
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>(() => store.get(KEYS.email) ?? "");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    const clean = email.trim().toLowerCase();
    setError(null);
    setNotice(null);
    if (!clean.includes("@")) {
      setError(t("Please enter the email you used before."));
      return;
    }
    setBusy(true);
    store.set(KEYS.email, clean);
    store.set(KEYS.onboarded, "true");
    ensureTrialStart();
    try {
      let environment: "sandbox" | "live" = "live";
      try {
        environment = getStripeEnvironment();
      } catch {
        /* keep default */
      }
      const res = await checkSubscription({ data: { email: clean, environment } });
      setSubscribed(res.active);
      if (res.active || isUnlimitedUser()) {
        navigate({ to: "/checkin" });
        return;
      }
      setNotice(
        t("We remembered your email, but we couldn't find an active subscription for it."),
      );
    } catch {
      setNotice(t("We saved your email on this device. You can continue."));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-10">
      <div className="w-full max-w-md">
        <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
          {t("← Back")}
        </Link>
        <h1 className="mt-4 text-3xl font-serif text-foreground">
          {t("Welcome back.")}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {t("Enter the email you used before and we'll bring your access back.")}
        </p>

        <input
          type="email"
          inputMode="email"
          autoCapitalize="none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="mt-6 w-full rounded-2xl border border-border bg-card px-5 py-4 text-lg outline-none focus:ring-2 focus:ring-ring"
        />
        {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
        {notice && <p className="mt-3 text-sm text-muted-foreground">{notice}</p>}

        <button
          onClick={submit}
          disabled={busy}
          className="mt-6 w-full rounded-2xl bg-primary py-4 text-lg font-medium text-primary-foreground transition hover:opacity-90 disabled:opacity-50"
        >
          {busy ? t("Please wait…") : t("Sign in")}
        </button>

        <div className="mt-6 flex flex-col gap-2 text-center">
          <button
            onClick={() => navigate({ to: "/checkin" })}
            className="text-sm text-muted-foreground underline"
          >
            {t("Continue to my check-in")}
          </button>
          <button
            onClick={() => navigate({ to: "/paywall" })}
            className="text-sm text-muted-foreground underline"
          >
            {t("Subscribe instead")}
          </button>
        </div>

        <div className="mt-10 text-center">
          <Link to="/resources" className="text-xs text-muted-foreground underline">
            {t("See crisis support resources")}
          </Link>
        </div>
      </div>
    </div>
  );
}
