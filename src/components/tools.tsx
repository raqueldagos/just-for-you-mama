import { useEffect, useMemo, useRef, useState } from "react";
import {
  JOURNAL_PROMPTS,
  NEEDS,
  PERMISSION_TEMPLATES,
  addWin,
  getWins,
  type NeedKey,
} from "@/lib/foryou";

function haptic(ms = 12) {
  try {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      (navigator as Navigator & { vibrate: (p: number | number[]) => boolean }).vibrate(ms);
    }
  } catch {
    // ignore
  }
}

// -------- Breathing (animated circle) --------
export function BreathingTool({ seconds = 90 }: { seconds?: number }) {
  const [running, setRunning] = useState(false);
  const [remaining, setRemaining] = useState(seconds);
  const [phase, setPhase] = useState<"in" | "hold" | "out">("in");
  const phaseSecs = { in: 4, hold: 2, out: 6 } as const;

  useEffect(() => {
    if (!running) return;
    const tick = setInterval(() => {
      setRemaining((r) => Math.max(0, r - 1));
    }, 1000);
    return () => clearInterval(tick);
  }, [running]);

  useEffect(() => {
    if (!running) return;
    let alive = true;
    const cycle = async () => {
      const order: Array<"in" | "hold" | "out"> = ["in", "hold", "out"];
      let i = 0;
      while (alive) {
        const p = order[i % order.length];
        setPhase(p);
        haptic(p === "in" ? 20 : p === "out" ? 30 : 8);
        await new Promise((r) => setTimeout(r, phaseSecs[p] * 1000));
        i++;
      }
    };
    cycle();
    return () => {
      alive = false;
    };
  }, [running]);

  useEffect(() => {
    if (remaining <= 0 && running) setRunning(false);
  }, [remaining, running]);

  const scale = phase === "in" ? 1 : phase === "hold" ? 1 : 0.55;
  const dur = phase === "in" ? phaseSecs.in : phase === "out" ? phaseSecs.out : phaseSecs.hold;
  const label = phase === "in" ? "Breathe in" : phase === "hold" ? "Hold" : "Let it out";

  return (
    <div className="flex flex-col items-center py-6">
      <div className="relative h-56 w-56 flex items-center justify-center">
        <div
          className="absolute h-56 w-56 rounded-full bg-primary/10"
          style={{
            transform: `scale(${scale})`,
            transition: `transform ${dur}s ease-in-out`,
          }}
        />
        <div
          className="absolute h-40 w-40 rounded-full bg-primary/20"
          style={{
            transform: `scale(${scale})`,
            transition: `transform ${dur}s ease-in-out`,
          }}
        />
        <div className="relative text-center">
          <div className="text-xl font-serif text-foreground">{running ? label : "Ready?"}</div>
          <div className="mt-1 text-sm text-muted-foreground">
            {running ? `${remaining}s left` : `${seconds}s`}
          </div>
        </div>
      </div>
      <button
        onClick={() => {
          setRemaining(seconds);
          setRunning((v) => !v);
        }}
        className="mt-6 rounded-2xl bg-primary px-6 py-3 text-primary-foreground font-medium hover:opacity-90"
      >
        {running ? "Pause" : remaining < seconds ? "Resume" : "Begin"}
      </button>
    </div>
  );
}

// -------- Simple countdown reset --------
export function ResetTimer({ minutes }: { minutes: number }) {
  const total = minutes * 60;
  const [remaining, setRemaining] = useState(total);
  const [running, setRunning] = useState(false);
  const startedAt = useRef<number>(0);

  useEffect(() => {
    if (!running) return;
    startedAt.current = Date.now();
    const iv = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startedAt.current) / 1000);
      setRemaining(Math.max(0, total - elapsed));
    }, 250);
    return () => clearInterval(iv);
  }, [running, total]);

  useEffect(() => {
    if (remaining <= 0 && running) {
      setRunning(false);
      haptic(60);
    }
  }, [remaining, running]);

  const m = Math.floor(remaining / 60);
  const s = remaining % 60;

  return (
    <div className="flex flex-col items-center py-6">
      <div className="text-6xl font-serif tabular-nums text-foreground">
        {m}:{String(s).padStart(2, "0")}
      </div>
      <p className="mt-3 text-sm text-muted-foreground">
        {running ? "Just this. Nothing else." : "Set your phone down. Timer will do the counting."}
      </p>
      <div className="mt-6 flex gap-3">
        <button
          onClick={() => setRunning((v) => !v)}
          className="rounded-2xl bg-primary px-6 py-3 text-primary-foreground font-medium hover:opacity-90"
        >
          {running ? "Pause" : remaining < total ? "Resume" : "Start"}
        </button>
        <button
          onClick={() => {
            setRunning(false);
            setRemaining(total);
          }}
          className="rounded-2xl border border-border px-6 py-3 text-foreground hover:bg-muted"
        >
          Reset
        </button>
      </div>
    </div>
  );
}

// -------- Body scan --------
const BODY_STEPS = [
  "Notice your feet on the floor. Just their weight.",
  "Soften your calves. Let them be heavy.",
  "Unclench your thighs and hips.",
  "Let your belly be soft. No performance.",
  "Drop your shoulders away from your ears.",
  "Unclench your jaw. Part your teeth slightly.",
  "Let the space between your eyebrows go soft.",
  "One slow breath. You made it through.",
];
export function BodyScanTool() {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (i >= BODY_STEPS.length) return;
    const t = setTimeout(() => setI((v) => v + 1), 7000);
    return () => clearTimeout(t);
  }, [i]);
  const done = i >= BODY_STEPS.length;
  return (
    <div className="py-6 text-center">
      <p className="min-h-[6rem] text-xl font-serif leading-relaxed text-foreground">
        {done ? "That's it. Nothing to do next." : BODY_STEPS[i]}
      </p>
      <div className="mt-6 flex justify-center gap-1">
        {BODY_STEPS.map((_, n) => (
          <div
            key={n}
            className={`h-1.5 w-6 rounded-full ${n <= i ? "bg-primary" : "bg-muted"}`}
          />
        ))}
      </div>
      {done && (
        <button
          onClick={() => setI(0)}
          className="mt-6 rounded-2xl border border-border px-6 py-3 text-foreground hover:bg-muted"
        >
          Again
        </button>
      )}
    </div>
  );
}

// -------- Grounding 5-4-3-2-1 --------
const GROUND_STEPS: { n: number; sense: string; prompt: string }[] = [
  { n: 5, sense: "see", prompt: "Name 5 things you can see." },
  { n: 4, sense: "feel", prompt: "Name 4 things you can feel — clothes, chair, air." },
  { n: 3, sense: "hear", prompt: "Name 3 things you can hear, even quiet ones." },
  { n: 2, sense: "smell", prompt: "Name 2 things you can smell — or imagine two." },
  { n: 1, sense: "taste", prompt: "Name 1 thing you can taste, or want to." },
];
export function GroundingTool() {
  const [i, setI] = useState(0);
  const done = i >= GROUND_STEPS.length;
  return (
    <div className="py-6 text-center">
      {!done ? (
        <>
          <div className="text-6xl font-serif text-primary">{GROUND_STEPS[i].n}</div>
          <p className="mt-3 text-lg text-foreground">{GROUND_STEPS[i].prompt}</p>
          <button
            onClick={() => setI((v) => v + 1)}
            className="mt-6 rounded-2xl bg-primary px-6 py-3 text-primary-foreground font-medium hover:opacity-90"
          >
            Done
          </button>
        </>
      ) : (
        <>
          <p className="text-xl font-serif text-foreground">You're here. That's the whole point.</p>
          <button
            onClick={() => setI(0)}
            className="mt-6 rounded-2xl border border-border px-6 py-3 text-foreground hover:bg-muted"
          >
            Again
          </button>
        </>
      )}
    </div>
  );
}

// -------- Name it to tame it --------
const EMOTIONS = [
  "tired", "wired", "sad", "angry", "resentful", "guilty", "lonely", "numb",
  "anxious", "afraid", "hurt", "grieving", "disappointed", "ashamed",
  "overwhelmed", "flat", "tender", "hopeful", "grateful", "content", "proud", "relieved",
];
export function NameItTool() {
  const [picked, setPicked] = useState<string[]>([]);
  const toggle = (w: string) =>
    setPicked((p) => (p.includes(w) ? p.filter((x) => x !== w) : [...p, w]));
  return (
    <div className="py-4">
      <p className="text-sm text-muted-foreground">Tap what fits. No wrong answers.</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {EMOTIONS.map((w) => (
          <button
            key={w}
            onClick={() => toggle(w)}
            className={`rounded-full border px-4 py-2 text-sm transition ${
              picked.includes(w)
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-foreground hover:bg-muted"
            }`}
          >
            {w}
          </button>
        ))}
      </div>
      {picked.length > 0 && (
        <p className="mt-6 text-foreground">
          Right now I'm feeling{" "}
          <span className="font-serif italic">{picked.join(", ")}</span>. That's allowed.
        </p>
      )}
    </div>
  );
}

// -------- Journal (one sentence) --------
export function JournalPromptTool() {
  const [i, setI] = useState(() => Math.floor(Math.random() * JOURNAL_PROMPTS.length));
  return (
    <div className="py-4">
      <p className="text-xl font-serif text-foreground">{JOURNAL_PROMPTS[i]}</p>
      <p className="mt-2 text-sm text-muted-foreground">
        One sentence. You don't have to write it down.
      </p>
      <button
        onClick={() => setI((v) => (v + 1) % JOURNAL_PROMPTS.length)}
        className="mt-5 rounded-2xl border border-border px-5 py-2.5 text-sm text-foreground hover:bg-muted"
      >
        Another prompt
      </button>
    </div>
  );
}

// -------- Permission slip generator --------
export function PermissionSlipTool() {
  const [i, setI] = useState(() => Math.floor(Math.random() * PERMISSION_TEMPLATES.length));
  const [custom, setCustom] = useState("");
  return (
    <div className="py-4">
      <div className="rounded-2xl bg-background border border-dashed border-primary/40 p-5">
        <p className="text-sm uppercase tracking-wide text-primary">Permission slip</p>
        <p className="mt-2 text-xl font-serif text-foreground">
          {custom.trim() ? `I give myself permission to ${custom.trim()}.` : PERMISSION_TEMPLATES[i]}
        </p>
      </div>
      <input
        value={custom}
        onChange={(e) => setCustom(e.target.value)}
        placeholder="or write your own…"
        className="mt-4 w-full rounded-2xl border border-border bg-card px-4 py-3 outline-none focus:ring-2 focus:ring-ring"
      />
      <button
        onClick={() => setI((v) => (v + 1) % PERMISSION_TEMPLATES.length)}
        className="mt-4 rounded-2xl border border-border px-5 py-2.5 text-sm text-foreground hover:bg-muted"
      >
        Another
      </button>
    </div>
  );
}

// -------- What do I need right now? --------
export function NeedDeciderTool() {
  const [picked, setPicked] = useState<NeedKey | null>(null);
  const need = useMemo(() => NEEDS.find((n) => n.key === picked) ?? null, [picked]);
  return (
    <div className="py-4">
      {!need ? (
        <div className="grid grid-cols-2 gap-2">
          {NEEDS.map((n) => (
            <button
              key={n.key}
              onClick={() => setPicked(n.key)}
              className="rounded-2xl border border-border bg-card px-4 py-4 text-left hover:border-primary hover:bg-muted transition"
            >
              <div className="text-foreground font-medium">{n.label}</div>
            </button>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl bg-background border border-border p-5">
          <p className="text-sm text-muted-foreground">You need: {need.label.toLowerCase()}.</p>
          <p className="mt-2 text-lg text-foreground">{need.why}</p>
          <button
            onClick={() => setPicked(null)}
            className="mt-5 rounded-2xl border border-border px-5 py-2.5 text-sm text-foreground hover:bg-muted"
          >
            Actually, something else
          </button>
        </div>
      )}
    </div>
  );
}

// -------- Tiny wins --------
export function TinyWinTool() {
  const [text, setText] = useState("");
  const [wins, setWins] = useState(() => getWins().slice(-5).reverse());
  const save = () => {
    if (!text.trim()) return;
    addWin(text.trim());
    setText("");
    setWins(getWins().slice(-5).reverse());
    haptic(20);
  };
  return (
    <div className="py-4">
      <p className="text-sm text-muted-foreground">
        The bar is low on purpose. "Put pants on" counts.
      </p>
      <div className="mt-3 flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="One small thing I did"
          className="flex-1 rounded-2xl border border-border bg-card px-4 py-3 outline-none focus:ring-2 focus:ring-ring"
          onKeyDown={(e) => e.key === "Enter" && save()}
        />
        <button
          onClick={save}
          className="rounded-2xl bg-primary px-5 text-primary-foreground font-medium hover:opacity-90"
        >
          Add
        </button>
      </div>
      {wins.length > 0 && (
        <ul className="mt-5 space-y-2">
          {wins.map((w, i) => (
            <li key={i} className="rounded-xl bg-muted/60 px-4 py-2 text-sm text-foreground">
              <span className="text-muted-foreground">{w.date} — </span>
              {w.text}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// -------- Gratitude (single-prompt) --------
export function GratitudeTool() {
  const prompts = [
    "One thing today that didn't go wrong.",
    "One person I'd thank silently right now.",
    "One small comfort I have right now.",
    "One thing about my body I don't hate today.",
    "One tiny moment this week that landed soft.",
  ];
  const [i, setI] = useState(() => Math.floor(Math.random() * prompts.length));
  return (
    <div className="py-4">
      <p className="text-xl font-serif text-foreground">{prompts[i]}</p>
      <p className="mt-2 text-sm text-muted-foreground">
        You don't have to write it. Just think of one.
      </p>
      <button
        onClick={() => setI((v) => (v + 1) % prompts.length)}
        className="mt-5 rounded-2xl border border-border px-5 py-2.5 text-sm text-foreground hover:bg-muted"
      >
        Another
      </button>
    </div>
  );
}

// -------- Registry (tool key -> renderer + title) --------
export type ToolKey =
  | "breath-60"
  | "breath-90"
  | "timer-2"
  | "timer-5"
  | "timer-10"
  | "body-scan"
  | "grounding"
  | "name-it"
  | "journal"
  | "permission"
  | "need"
  | "wins"
  | "gratitude";

export const TOOL_META: Record<ToolKey, { title: string; blurb: string }> = {
  "breath-60": { title: "60-second breathing", blurb: "One minute. Longer out than in." },
  "breath-90": { title: "90-second breathing", blurb: "The full reset." },
  "timer-2": { title: "2-minute reset", blurb: "Set it down. Do nothing." },
  "timer-5": { title: "5-minute reset", blurb: "A real pause." },
  "timer-10": { title: "10-minute reset", blurb: "Somewhere else. Any room but this one." },
  "body-scan": { title: "Body scan", blurb: "Head to toes. Soften as you go." },
  grounding: { title: "5-4-3-2-1 grounding", blurb: "For when the room feels too loud inside." },
  "name-it": { title: "Name it to tame it", blurb: "Pick the words. They lose some power once named." },
  journal: { title: "One-sentence journal", blurb: "Just one. That's the whole thing." },
  permission: { title: "Permission slip", blurb: "Write yourself out of the guilt loop." },
  need: { title: "What do I need right now?", blurb: "A tiny decision helper." },
  wins: { title: "Tiny wins", blurb: "The receipts you don't usually keep." },
  gratitude: { title: "Gratitude, one line", blurb: "One thing. Quiet. Yours." },
};

export function ToolRenderer({ tool }: { tool: ToolKey }) {
  switch (tool) {
    case "breath-60":
      return <BreathingTool seconds={60} />;
    case "breath-90":
      return <BreathingTool seconds={90} />;
    case "timer-2":
      return <ResetTimer minutes={2} />;
    case "timer-5":
      return <ResetTimer minutes={5} />;
    case "timer-10":
      return <ResetTimer minutes={10} />;
    case "body-scan":
      return <BodyScanTool />;
    case "grounding":
      return <GroundingTool />;
    case "name-it":
      return <NameItTool />;
    case "journal":
      return <JournalPromptTool />;
    case "permission":
      return <PermissionSlipTool />;
    case "need":
      return <NeedDeciderTool />;
    case "wins":
      return <TinyWinTool />;
    case "gratitude":
      return <GratitudeTool />;
  }
}

// Map an item's cta / action item id area to a tool key.
export function toolForItemCta(cta: string | undefined): ToolKey | null {
  if (!cta) return null;
  const c = cta.toLowerCase();
  if (c.includes("breath")) return "breath-90";
  if (c.includes("90-second")) return "breath-90";
  if (c.includes("2-minute")) return "timer-2";
  if (c.includes("5-minute")) return "timer-5";
  if (c.includes("10-minute")) return "timer-10";
  if (c.includes("ground")) return "grounding";
  if (c.includes("body")) return "body-scan";
  if (c.includes("prompt") && c.includes("gratitude")) return "gratitude";
  if (c.includes("prompt")) return "journal";
  if (c.includes("permission")) return "permission";
  if (c.includes("win")) return "wins";
  if (c.includes("name")) return "name-it";
  if (c.includes("decide") || c.includes("help me")) return "need";
  return null;
}
