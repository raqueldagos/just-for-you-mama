import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { KEYS, store, ensureTrialStart } from "@/lib/evenme";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Even Me — A 90-second check-in, for you" },
      {
        name: "description",
        content:
          "A gentle 90-second daily check-in for mothers of neurodivergent kids. Not about your child — about you. Warm, non-clinical, no tracking of your kid.",
      },
      { property: "og:title", content: "Even Me — A 90-second check-in, for you" },
      {
        property: "og:description",
        content:
          "A 90-second daily emotional check-in for mothers of neurodivergent kids — for the mother, not the child.",
      },
      { property: "og:url", content: "https://evenme.online/" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "https://evenme.online/" }],
  }),
  component: Onboarding,
});

function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [reminder, setReminder] = useState("19:00");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (store.get(KEYS.onboarded) === "true") {
      navigate({ to: "/checkin" });
    }
  }, [navigate]);

  const finish = () => {
    if (name) store.set(KEYS.name, name);
    if (reminder) store.set(KEYS.reminder, reminder);
    if (email) store.set(KEYS.email, email);
    store.set(KEYS.onboarded, "true");
    ensureTrialStart();
    navigate({ to: "/checkin" });
  };

  const skip = () => {
    store.set(KEYS.onboarded, "true");
    ensureTrialStart();
    navigate({ to: "/checkin" });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex gap-2">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className={`h-1.5 w-8 rounded-full transition-colors ${
                  n <= step ? "bg-primary" : "bg-muted"
                }`}
              />
            ))}
          </div>
          <button
            onClick={skip}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Skip
          </button>
        </div>

        {step === 1 && (
          <div className="space-y-6">
            <div className="flex justify-center">
              <img src="/favicon.svg" alt="Even Me" className="h-20 w-20 rounded-2xl" />
            </div>
            <h1 className="text-3xl font-serif leading-tight text-foreground text-center">
              You're not here to log your kid.
              <br />
              <span className="text-primary">You're here for you.</span>
            </h1>
            <p className="text-muted-foreground text-center">
              90 seconds a day. No charts, no scores, no clinical stuff. Just a moment
              to notice how <em>you</em> are.
            </p>
            <button
              onClick={() => setStep(2)}
              className="w-full rounded-2xl bg-primary py-4 text-primary-foreground text-lg font-medium hover:opacity-90 transition"
            >
              Okay
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h1 className="text-2xl font-serif text-foreground">
              What should we call you?
            </h1>
            <p className="text-muted-foreground text-sm">Totally optional.</p>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="First name"
              className="w-full rounded-2xl border border-border bg-card px-5 py-4 text-lg outline-none focus:ring-2 focus:ring-ring"
            />
            <button
              onClick={() => setStep(3)}
              className="w-full rounded-2xl bg-primary py-4 text-primary-foreground text-lg font-medium hover:opacity-90 transition"
            >
              Continue
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <h1 className="text-2xl font-serif text-foreground">
              One gentle nudge a day, whenever you want it.
            </h1>
            <div>
              <label className="block text-sm text-muted-foreground mb-2">
                Reminder time
              </label>
              <input
                type="time"
                value={reminder}
                onChange={(e) => setReminder(e.target.value)}
                className="w-full rounded-2xl border border-border bg-card px-5 py-4 text-lg outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-2">
                Email (optional)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-2xl border border-border bg-card px-5 py-4 text-lg outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <button
              onClick={finish}
              className="w-full rounded-2xl bg-primary py-4 text-primary-foreground text-lg font-medium hover:opacity-90 transition"
            >
              Start with 1 free tip
            </button>
            <p className="text-xs text-center text-muted-foreground">
              No card required to start. Then $12/week or $79/year.
            </p>

          </div>
        )}

        <div className="mt-10 text-center">
          <Link to="/resources" className="text-xs text-muted-foreground underline">
            See crisis support resources
          </Link>
        </div>
      </div>
    </div>
  );
}

