import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { KEYS, store, isSubscribed, trialDaysLeft } from "@/lib/evenme";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Even Me" },
      { name: "description", content: "Reminder time and subscription." },
    ],
  }),
  component: Settings,
});

function Settings() {
  const [reminder, setReminder] = useState("19:00");
  const [name, setName] = useState("");
  const [subbed, setSubbed] = useState(false);
  const [daysLeft, setDaysLeft] = useState(7);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setReminder(store.get(KEYS.reminder) ?? "19:00");
    setName(store.get(KEYS.name) ?? "");
    setSubbed(isSubscribed());
    setDaysLeft(trialDaysLeft());
  }, []);

  const save = () => {
    store.set(KEYS.reminder, reminder);
    store.set(KEYS.name, name);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const cancelSub = () => {
    store.set(KEYS.subscribed, "false");
    setSubbed(false);
  };

  return (
    <div className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-xl">
        <Link to="/checkin" className="text-sm text-muted-foreground hover:text-foreground">
          ← Back
        </Link>
        <h1 className="mt-4 text-3xl font-serif text-foreground">Settings</h1>

        <section className="mt-8 space-y-4">
          <div>
            <label className="block text-sm text-muted-foreground mb-2">Your name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-2xl border border-border bg-card px-5 py-4 outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="block text-sm text-muted-foreground mb-2">
              Daily reminder time
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
            {saved ? "Saved" : "Save"}
          </button>
        </section>

        <section className="mt-10">
          <h2 className="text-sm uppercase tracking-widest text-muted-foreground">
            Subscription
          </h2>
          <div className="mt-4 rounded-3xl bg-card border border-border p-6">
            {subbed ? (
              <>
                <p className="text-foreground font-medium">You're subscribed. Thank you.</p>
                <button
                  onClick={cancelSub}
                  className="mt-4 text-sm text-muted-foreground underline hover:text-foreground"
                >
                  Cancel subscription
                </button>
              </>
            ) : (
              <>
                <p className="text-foreground">
                  {daysLeft > 0
                    ? `You have ${daysLeft} free day${daysLeft === 1 ? "" : "s"} left.`
                    : "Your free trial has ended."}
                </p>
                <Link
                  to="/paywall"
                  className="mt-4 inline-block rounded-2xl bg-primary px-5 py-3 text-primary-foreground font-medium hover:opacity-90 transition"
                >
                  See plans
                </Link>
              </>
            )}
          </div>
        </section>

        <footer className="mt-16 text-center">
          <Link to="/resources" className="text-xs text-muted-foreground underline">
            If you're in crisis, here's who to call.
          </Link>
        </footer>
      </div>
    </div>
  );
}
