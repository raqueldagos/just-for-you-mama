import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { KEYS, store } from "@/lib/evenme";

export const Route = createFileRoute("/paywall")({
  head: () => ({
    meta: [
      { title: "Keep going — Even Me" },
      { name: "description", content: "Subscribe to keep your streak." },
    ],
  }),
  component: Paywall,
});

function Paywall() {
  const [plan, setPlan] = useState<"annual" | "weekly">("annual");
  const navigate = useNavigate();

  const checkout = async () => {
    // TODO: Wire real Stripe Checkout here.
    // 1) Create a server function that calls Stripe with STRIPE_SECRET_KEY.
    // 2) Return the Checkout Session URL and redirect the browser to it.
    // 3) Handle the `checkout.session.completed` webhook and set subscription state.
    // For v1 we simulate a successful subscription client-side.
    store.set(KEYS.subscribed, "true");
    navigate({ to: "/checkin" });
  };

  return (
    <div className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-md">
        <Link to="/checkin" className="text-sm text-muted-foreground hover:text-foreground">
          ← Not now
        </Link>
        <h1 className="mt-4 text-3xl font-serif text-foreground">
          Keep showing up for you.
        </h1>
        <p className="mt-2 text-muted-foreground">
          Your 7 free days are done. Pick what works.
        </p>

        <div className="mt-8 space-y-3">
          <button
            onClick={() => setPlan("annual")}
            className={`w-full text-left rounded-3xl border p-5 transition ${
              plan === "annual"
                ? "border-primary bg-card ring-2 ring-primary"
                : "border-border bg-card"
            }`}
          >
            <div className="flex items-baseline justify-between">
              <span className="font-medium text-card-foreground">Annual</span>
              <span className="text-xs rounded-full bg-primary px-2 py-0.5 text-primary-foreground">
                35% off
              </span>
            </div>
            <p className="mt-1 text-2xl font-serif text-foreground">$79 / year</p>
            <p className="text-xs text-muted-foreground">≈ $1.52 / week</p>
          </button>

          <button
            onClick={() => setPlan("weekly")}
            className={`w-full text-left rounded-3xl border p-5 transition ${
              plan === "weekly"
                ? "border-primary bg-card ring-2 ring-primary"
                : "border-border bg-card"
            }`}
          >
            <span className="font-medium text-card-foreground">Weekly</span>
            <p className="mt-1 text-2xl font-serif text-foreground">$12 / week</p>
          </button>
        </div>

        <button
          onClick={checkout}
          className="mt-8 w-full rounded-2xl bg-primary py-4 text-primary-foreground text-lg font-medium hover:opacity-90 transition"
        >
          Continue
        </button>
        <p className="mt-3 text-center text-xs text-muted-foreground">
          Cancel anytime in Settings.
        </p>
      </div>
    </div>
  );
}
