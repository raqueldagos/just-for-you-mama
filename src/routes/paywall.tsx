import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useCallback } from "react";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import { getStripe, getStripeEnvironment } from "@/lib/stripe";
import { createCheckoutSession } from "@/utils/payments.functions";
import { KEYS, store } from "@/lib/evenme";
import { PaymentTestModeBanner } from "@/components/PaymentTestModeBanner";
import { useT } from "@/lib/i18n";
import { useIsNativeApp } from "@/hooks/useIap";
import { IapPaywall } from "@/components/IapPaywall";

export const Route = createFileRoute("/paywall")({
  head: () => ({
    meta: [
      { title: "Keep going — Even Me" },
      {
        name: "description",
        content:
          "Subscribe to keep showing up for you. $4.99 per week or $79 per year — a small daily companion for mothers of neurodivergent kids. Cancel anytime.",
      },
      { property: "og:title", content: "Even Me — subscribe" },
      {
        property: "og:description",
        content: "Subscribe to keep your daily check-in — $4.99/week or $79/year. Cancel anytime.",
      },
      { property: "og:url", content: "https://evenme.online/paywall" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "https://evenme.online/paywall" }],
  }),
  component: Paywall,
});

function Paywall() {
  const navigate = useNavigate();
  const t = useT();
  const isNative = useIsNativeApp();
  const [plan, setPlan] = useState<"annual" | "weekly">("annual");

  const [email, setEmail] = useState<string>(
    () => store.get(KEYS.email) ?? "",
  );
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const priceId = plan === "annual" ? "even_me_annual" : "even_me_weekly";

  const fetchClientSecret = useCallback(async (): Promise<string> => {
    const cleanEmail = email.trim().toLowerCase();
    store.set(KEYS.email, cleanEmail);
    try {
      const result = await createCheckoutSession({
        data: {
          priceId,
          email: cleanEmail,
          returnUrl: `${window.location.origin}/checkout-return?session_id={CHECKOUT_SESSION_ID}`,
          environment: getStripeEnvironment(),
        },
      });
      if ("error" in result) throw new Error(result.error);
      if (!result.clientSecret)
        throw new Error("Payments did not return a client secret");
      return result.clientSecret;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Couldn't start checkout. Please try again.";
      setError(msg);
      setCheckoutOpen(false);
      throw err;
    }
  }, [email, priceId]);

  const start = () => {
    setError(null);
    const clean = email.trim();
    if (!clean || !clean.includes("@")) {
      setError(t("Please enter a valid email so we can remember your subscription."));
      return;
    }
    setCheckoutOpen(true);
  };

  if (isNative) {
    return <IapPaywall />;
  }

  if (checkoutOpen) {
    return (
      <div className="min-h-screen">
        <PaymentTestModeBanner />
        <div className="mx-auto max-w-2xl px-4 py-6">
          <button
            onClick={() => setCheckoutOpen(false)}
            className="mb-4 text-sm text-muted-foreground hover:text-foreground"
          >
            {t("← Change plan")}
          </button>
          <EmbeddedCheckoutProvider
            stripe={getStripe()}
            options={{ fetchClientSecret }}
          >
            <EmbeddedCheckout />
          </EmbeddedCheckoutProvider>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <PaymentTestModeBanner />
      <div className="mx-auto max-w-md px-6 py-10">
        <Link
          to="/checkin"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          {t("← Not now")}
        </Link>
        <h1 className="mt-4 text-3xl font-serif text-foreground">
          {t("Keep showing up for you.")}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {t("Your free tip is used. Pick what works.")}
        </p>

        <div className="mt-6">
          <label className="block text-sm text-muted-foreground mb-2">
            {t("Your email")}
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-2xl border border-border bg-card px-5 py-4 outline-none focus:ring-2 focus:ring-ring"
          />
          {error && (
            <p className="mt-2 text-sm text-destructive">{error}</p>
          )}
        </div>

        <div className="mt-6 space-y-3">
          <button
            onClick={() => setPlan("annual")}
            className={`w-full text-left rounded-3xl border p-5 transition ${
              plan === "annual"
                ? "border-primary bg-card ring-2 ring-primary"
                : "border-border bg-card"
            }`}
          >
            <div className="flex items-baseline justify-between">
              <span className="font-medium text-card-foreground">
                {t("EvenMe Annual")}
              </span>
              <span className="text-xs rounded-full bg-primary px-2 py-0.5 text-primary-foreground">
                {t("35% off")}
              </span>
            </div>
            <p className="mt-1 text-2xl font-serif text-foreground">
              {t("$79 / year")}
            </p>
            <p className="text-xs text-muted-foreground">{t("≈ $1.52 / week")}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {t("Subscription length: 1 year. Billed once per year.")}
            </p>
            <p className="text-xs text-muted-foreground">
              {t("Auto-renews until canceled. Cancel anytime in Settings.")}
            </p>
          </button>

          <button
            onClick={() => setPlan("weekly")}
            className={`w-full text-left rounded-3xl border p-5 transition ${
              plan === "weekly"
                ? "border-primary bg-card ring-2 ring-primary"
                : "border-border bg-card"
            }`}
          >
            <span className="font-medium text-card-foreground">
              {t("EvenMe Weekly")}
            </span>
            <p className="mt-1 text-2xl font-serif text-foreground">
              {t("$4.99 / week")}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {t("Subscription length: 1 week. Billed every week.")}
            </p>
            <p className="text-xs text-muted-foreground">
              {t("Auto-renews until canceled. Cancel anytime in Settings.")}
            </p>
          </button>
        </div>

        <button
          onClick={start}
          className="mt-8 w-full rounded-2xl bg-primary py-4 text-primary-foreground text-lg font-medium hover:opacity-90 transition"
        >
          {t("Continue")}
        </button>
        <p className="mt-3 text-center text-xs text-muted-foreground">
          {t("Cancel anytime in Settings.")}
        </p>
        <p className="mt-6 text-center">
          <button
            onClick={() => navigate({ to: "/checkin" })}
            className="text-xs text-muted-foreground underline"
          >
            {t("I already subscribed — refresh my access")}
          </button>
        </p>
        <p className="mt-4 text-center text-xs text-muted-foreground">
          {t("By subscribing, you agree to our")}{" "}
          <a
            href="https://evenme.online/terms"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-foreground"
          >
            {t("Terms of Use")}
          </a>{" "}
          {t("and")}{" "}
          <a
            href="https://evenme.online/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-foreground"
          >
            {t("Privacy Policy")}
          </a>
          .
        </p>

      </div>
    </div>
  );
}
