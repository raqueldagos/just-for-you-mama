import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { KEYS, store, addMoodCheckin } from "@/lib/evenme";
import {
  FEELINGS,
  FEELING_BASELINE,
  type FeelingKey,
  promptForToday,
  questForToday,
  drawSlip,
  keepSlip,
  saveLocalCheckin,
  checkinsCount,
  minutesThisMonth,
  windowStage,
  feelingLabel,
  setOnboardingDone,
  setReminderEnabled,
  reminderLabel,
  a2hsSeen,
  setA2hsSeen,
  quietNoteDue,
  type Slip,
} from "@/lib/companion";
import { recordCheckin, cheerFeeling } from "@/utils/companion.functions";
import { captureLead } from "@/utils/leads.functions";
import { WindowScene } from "@/components/WindowScene";
import { AddToHomeSheet } from "@/components/AddToHomeSheet";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/checkin")({
  head: () => ({
    meta: [
      { title: "Your 90 seconds — Even Me" },
      {
        name: "description",
        content:
          "One prompt, one feeling, one permission slip. Ninety seconds for you, then you close it. No charts, no scores, nothing about your child.",
      },
      { property: "og:title", content: "Your 90 seconds — Even Me" },
      {
        property: "og:description",
        content: "One prompt, one feeling, one permission slip. Ninety seconds for you.",
      },
      { property: "og:url", content: "https://evenme.online/checkin" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "https://evenme.online/checkin" }],
  }),
  component: CheckIn,
});

type Step = 1 | 2 | 3 | 4;

function CheckIn() {
  const t = useT();
  const navigate = useNavigate();
  const prompt = useMemo(() => promptForToday(), []);
  const quest = useMemo(() => questForToday(), []);

  const [step, setStep] = useState<Step>(1);
  const [feeling, setFeeling] = useState<FeelingKey | null>(null);
  const [note, setNote] = useState("");
  const [slip, setSlip] = useState<Slip | null>(null);
  const [kept, setKept] = useState(false);
  const [questAnswered, setQuestAnswered] = useState<boolean | null>(null);
  const [sameCount, setSameCount] = useState<number | null>(null);
  const [cheered, setCheered] = useState(false);
  const [showA2HS, setShowA2HS] = useState(false);
  const [reminderOn, setReminderOn] = useState(false);
  const [monthMinutes, setMonthMinutes] = useState(0);
  const [stage, setStage] = useState(0);

  useEffect(() => {
    setOnboardingDone();
  }, []);

  const chooseFeeling = (key: FeelingKey) => {
    setFeeling(key);
    setSlip(drawSlip(key, checkinsCount()));
  };

  const commit = (questDone: boolean) => {
    if (!feeling || !slip) return;
    setQuestAnswered(questDone);
    keepSlip(slip.id);
    saveLocalCheckin({
      ts: new Date().toISOString(),
      promptKey: prompt.key,
      feeling,
      note: note.trim() || undefined,
      slipId: slip.id,
      questDone,
      questKey: quest.key,
    });
    // keep the older local history in sync so nothing else breaks
    addMoodCheckin(feeling, undefined, note.trim() || undefined);

    const count = checkinsCount();
    setMonthMinutes(minutesThisMonth());
    setStage(windowStage(count));
    setSameCount(FEELING_BASELINE[feeling]);
    setStep(4);

    const email = (store.get(KEYS.email) ?? "").trim().toLowerCase() || null;
    recordCheckin({
      data: {
        email,
        promptKey: prompt.key,
        feelingKey: feeling,
        note: note.trim() || null,
        slipId: slip.id,
        questDone,
        questKey: quest.key,
        checkinsCount: count,
        minutesKept: count * 2,
        plantStage: windowStage(count),
      },
    })
      .then((res) => setSameCount(res.sameFeelingToday))
      .catch(() => {});

    if (email) {
      captureLead({ data: { email } }).catch(() => {});
    }
  };

  return (
    <main className="min-h-screen px-6 pb-16 pt-[max(2.5rem,env(safe-area-inset-top))]">
      <div className="mx-auto max-w-md">
        <div className="mb-8 flex gap-2" aria-hidden="true">
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                n <= step ? "bg-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>

        {/* ---------------------------------------------- step 1: the prompt */}
        {step === 1 && (
          <div className="animate-fade-in space-y-8">
            <h1 className="text-3xl font-serif leading-tight text-foreground">
              {t(prompt.text)}
            </h1>
            <p className="text-muted-foreground">
              {t("Ninety seconds. Then you close it.")}
            </p>
            <button
              onClick={() => setStep(2)}
              className="w-full rounded-2xl bg-primary py-5 text-lg font-medium text-primary-foreground transition hover:opacity-90"
            >
              {t("Okay")}
            </button>
          </div>
        )}

        {/* -------------------------------------------- step 2: the feeling */}
        {step === 2 && (
          <div className="animate-fade-in space-y-3">
            <h1 className="mb-6 text-2xl font-serif text-foreground">
              {t("Pick the one closest to true.")}
            </h1>
            {FEELINGS.map((f) => (
              <button
                key={f.key}
                onClick={() => {
                  chooseFeeling(f.key);
                  setTimeout(() => setStep(3), 140);
                }}
                className={`w-full rounded-2xl border bg-card px-5 py-5 text-left text-lg text-card-foreground transition ${
                  feeling === f.key
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/60"
                }`}
              >
                {t(f.label)}
              </button>
            ))}

            <div className="pt-4">
              <input
                value={note}
                onChange={(e) => setNote(e.target.value.slice(0, 140))}
                placeholder={t("One line, if you want. You can skip.")}
                maxLength={140}
                className="w-full rounded-2xl border border-border bg-card px-5 py-4 text-base outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>
        )}

        {/* ------------------------------------ step 3: slip + tiny invite */}
        {step === 3 && slip && (
          <div className="animate-fade-in space-y-6">
            <h1 className="text-sm uppercase tracking-widest text-muted-foreground">
              {t("A permission slip")}
            </h1>
            <div className="rounded-3xl border border-border bg-card p-8">
              <p className="text-2xl font-serif leading-snug text-card-foreground">
                {t(slip.text)}
              </p>
            </div>

            {!kept ? (
              <button
                onClick={() => {
                  keepSlip(slip.id);
                  setKept(true);
                }}
                className="w-full rounded-2xl bg-primary py-5 text-lg font-medium text-primary-foreground transition hover:opacity-90"
              >
                {t("Keep this one")}
              </button>
            ) : (
              <div className="space-y-4 rounded-3xl border border-border p-6">
                <p className="text-sm text-muted-foreground">{t("If you feel like it:")}</p>
                <p className="text-lg text-foreground">{t(quest.text)}</p>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    onClick={() => commit(true)}
                    className="flex-1 rounded-2xl bg-primary py-4 text-base font-medium text-primary-foreground transition hover:opacity-90"
                  >
                    {t("I did this")}
                  </button>
                  <button
                    onClick={() => commit(false)}
                    className="flex-1 rounded-2xl border border-border py-4 text-base text-muted-foreground transition hover:bg-muted"
                  >
                    {t("Not tonight")}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">
                  {t("Either answer is fine. Nothing counts against you.")}
                </p>
              </div>
            )}
          </div>
        )}

        {/* ------------------------------- step 4: belonging + quiet close */}
        {step === 4 && feeling && (
          <div className="animate-fade-in space-y-8">
            <div className="rounded-3xl border border-border bg-card p-6">
              <p className="text-lg text-card-foreground">
                {sameCount === null
                  ? t("Counting the others…")
                  : `${sameCount.toLocaleString()} ${t("moms checked in as")} \u201c${t(
                      feelingLabel(feeling),
                    )}\u201d ${t("today.")}`}
              </p>
              <button
                onClick={() => {
                  if (cheered) return;
                  setCheered(true);
                  cheerFeeling({ data: { feelingKey: feeling } }).catch(() => {});
                }}
                className={`mt-4 inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm transition ${
                  cheered
                    ? "border-primary text-primary"
                    : "border-border text-muted-foreground hover:border-primary/60"
                }`}
              >
                <span aria-hidden="true">{cheered ? "\u2665" : "\u2661"}</span>
                {cheered ? t("Noticed") : t("Same")}
              </button>
            </div>

            <div className="space-y-1 text-foreground">
              <p className="text-xl font-serif">{t("You just kept 2 minutes for you.")}</p>
              <p className="text-sm text-muted-foreground">
                {t("Minutes that were yours this month:")} {monthMinutes}
              </p>
              {questAnswered && (
                <p className="text-sm text-muted-foreground">{t("And you took the small one.")}</p>
              )}
            </div>

            <div>
              <WindowScene stage={stage} animate />
              <p className="mt-2 text-center text-sm text-primary">{t("Your window grew.")}</p>
            </div>

            <button
              onClick={() => navigate({ to: quietNoteDue() ? "/note" : "/home" })}
              className="w-full rounded-2xl bg-primary py-5 text-lg font-medium text-primary-foreground transition hover:opacity-90"
            >
              {t("Done")}
            </button>

            <div className="flex flex-col items-center gap-3 text-center">
              {!a2hsSeen() && (
                <button
                  onClick={() => {
                    setA2hsSeen();
                    setShowA2HS(true);
                  }}
                  className="text-sm text-muted-foreground underline"
                >
                  {t("Add to Home Screen")}
                </button>
              )}
              <button
                onClick={() => {
                  setReminderEnabled(true);
                  setReminderOn(true);
                }}
                disabled={reminderOn}
                className="text-sm text-muted-foreground underline disabled:no-underline disabled:opacity-70"
              >
                {reminderOn
                  ? `${t("Saved —")} ${t(reminderLabel())}`
                  : t("Turn on a quiet reminder")}
              </button>
              <Link to="/slips" className="text-sm text-muted-foreground underline">
                {t("Your slips")}
              </Link>
            </div>
          </div>
        )}

        <div className="mt-12 text-center">
          <Link to="/resources" className="text-xs text-muted-foreground underline">
            {t("See crisis support resources")}
          </Link>
        </div>
      </div>

      {showA2HS && <AddToHomeSheet onClose={() => setShowA2HS(false)} />}
    </main>
  );
}
