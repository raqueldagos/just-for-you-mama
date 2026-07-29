import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { checkSubscription } from "@/utils/payments.functions";
import { getStripeEnvironment } from "@/lib/stripe";
import { KEYS, setSubscribed, store } from "@/lib/evenme";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/checkout-return")({
  head: () => ({
    meta: [
      { title: "Thanks — Even Me" },
      { name: "description", content: "Confirming your subscription." },
    ],
  }),
  validateSearch: (search: Record<string, unknown>): { session_id?: string } => ({
    session_id:
      typeof search.session_id === "string" ? search.session_id : undefined,
  }),
  component: CheckoutReturn,
});

function CheckoutReturn() {
  const navigate = useNavigate();
  const t = useT();
  const [status, setStatus] = useState<"checking" | "active" | "pending">(
    "checking",
  );

  useEffect(() => {
    const email = store.get(KEYS.email);
    if (!email) {
      setStatus("pending");
      return;
    }
    let cancelled = false;
    let attempts = 0;

    const poll = async () => {
      attempts++;
      try {
        const res = await checkSubscription({
          data: { email, environment: getStripeEnvironment() },
        });
        if (cancelled) return;
        if (res.active) {
          setSubscribed(true);
          setStatus("active");
          setTimeout(() => navigate({ to: "/checkin" }), 1500);
          return;
        }
      } catch {}
      if (attempts < 10) {
        setTimeout(poll, 1500);
      } else {
        setStatus("pending");
      }
    };
    poll();
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-md text-center">
        {status === "checking" && (
          <>
            <h1 className="text-3xl font-serif text-foreground">
              {t("Confirming your subscription…")}
            </h1>
            <p className="mt-3 text-muted-foreground">
              {t("Just a moment while we save this on our end.")}
            </p>
          </>
        )}
        {status === "active" && (
          <>
            <h1 className="text-3xl font-serif text-primary">{t("Thank you.")}</h1>
            <p className="mt-3 text-muted-foreground">
              {t("You're all set. Taking you back to your check-in.")}
            </p>
          </>
        )}
        {status === "pending" && (
          <>
            <h1 className="text-3xl font-serif text-foreground">
              {t("Almost there.")}
            </h1>
            <p className="mt-3 text-muted-foreground">
              {t("Your payment went through, but we're still syncing. It usually takes a few seconds — try heading back to the app.")}
            </p>
            <Link
              to="/checkin"
              className="mt-6 inline-block rounded-2xl bg-primary px-5 py-3 text-primary-foreground font-medium"
            >
              {t("Back to check-in")}
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
