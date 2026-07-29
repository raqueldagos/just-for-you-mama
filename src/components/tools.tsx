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

// -------- Shared: a paced, tap-through script --------
function ScriptTool({ steps, done }: { steps: string[]; done: string }) {
  const [i, setI] = useState(0);
  const finished = i >= steps.length;
  return (
    <div className="py-6 text-center">
      <p className="min-h-[6rem] text-xl font-serif leading-relaxed text-foreground">
        {finished ? done : steps[i]}
      </p>
      <div className="mt-6 flex justify-center gap-1">
        {steps.map((_, n) => (
          <div
            key={n}
            className={`h-1.5 w-6 rounded-full ${n <= i ? "bg-primary" : "bg-muted"}`}
          />
        ))}
      </div>
      <button
        onClick={() => {
          haptic();
          setI((v) => (finished ? 0 : v + 1));
        }}
        className="mt-6 rounded-2xl bg-primary px-6 py-3 text-primary-foreground font-medium hover:opacity-90"
      >
        {finished ? "Again" : "Next"}
      </button>
    </div>
  );
}

// -------- Shared: one prompt with a short countdown --------
function CountdownPrompt({
  seconds,
  prompt,
  done,
}: {
  seconds: number;
  prompt: string;
  done: string;
}) {
  const [remaining, setRemaining] = useState(seconds);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    const iv = setInterval(() => setRemaining((r) => Math.max(0, r - 1)), 1000);
    return () => clearInterval(iv);
  }, [running]);

  useEffect(() => {
    if (remaining === 0 && running) {
      setRunning(false);
      haptic(60);
    }
  }, [remaining, running]);

  const finished = remaining === 0;

  return (
    <div className="py-6 text-center">
      <p className="text-xl font-serif leading-relaxed text-foreground">
        {finished ? done : prompt}
      </p>
      <div className="mt-6 text-6xl font-serif tabular-nums text-primary">{remaining}</div>
      <button
        onClick={() => {
          haptic();
          if (finished) {
            setRemaining(seconds);
            setRunning(true);
          } else {
            setRunning((v) => !v);
          }
        }}
        className="mt-6 rounded-2xl bg-primary px-6 py-3 text-primary-foreground font-medium hover:opacity-90"
      >
        {finished ? "Again" : running ? "Pause" : remaining < seconds ? "Resume" : "Start"}
      </button>
    </div>
  );
}

// -------- New easy tools --------
export function SighTool() {
  return (
    <ScriptTool
      steps={[
        "Breathe in through your nose. Then sip a little more air on top.",
        "Let it fall out of your mouth. Slow, longer than the way in.",
        "Again: in… and a second small sip in.",
        "Long sigh out. Let your shoulders come down with it.",
        "One more time. In, in… and out, all the way to empty.",
      ]}
      done="That's a physiological sigh. Your body knows this one."
    />
  );
}

export function ColdWaterTool() {
  return (
    <CountdownPrompt
      seconds={45}
      prompt="Cool water on your wrists, or your face. Hold it there while the timer runs."
      done="Your nervous system just got a different signal. That's all it needed."
    />
  );
}

export function UnclenchTool() {
  return (
    <ScriptTool
      steps={[
        "Jaw. Part your teeth a little. Let your tongue rest low.",
        "Shoulders. Drop them once, on purpose.",
        "Hands. Open your fingers. Let them be heavy.",
        "Belly. Stop holding it in. Nobody's looking.",
        "Forehead. Let the space between your eyebrows go loose.",
      ]}
      done="You were holding all of that. Now you're not."
    />
  );
}

export function HandOnHeartTool() {
  return (
    <ScriptTool
      steps={[
        "Put one hand flat on your chest. The other on your belly if you want.",
        "Feel the warmth. This is the same touch you give everyone else.",
        "Say quietly: this is hard, and I'm still here.",
        "Three slow breaths under your hand. No counting needed.",
      ]}
      done="You just got care from the person who gives it out all day."
    />
  );
}

export function ShakeItOutTool() {
  return (
    <CountdownPrompt
      seconds={30}
      prompt="Shake your hands, arms, legs — anything. Silly is fine. Then stand still after."
      done="Stillness now. Notice the buzz settling."
    />
  );
}

export function LookFarTool() {
  return (
    <CountdownPrompt
      seconds={20}
      prompt="Look at the furthest thing you can see. A window, a wall, the sky. Just look."
      done="Your eyes unwound a little. So did the rest of you."
    />
  );
}

export function SoundOffTool() {
  return (
    <CountdownPrompt
      seconds={60}
      prompt="Turn one noise off. TV, tap, music, fan. Sit with the missing sound."
      done="One less thing asking for you."
    />
  );
}

export function CountBackTool() {
  return (
    <ScriptTool
      steps={["Five.", "Four.", "Three.", "Two.", "One."]}
      done="Boring on purpose. The spiral lost the thread."
    />
  );
}

export function WarmDrinkTool() {
  return (
    <ScriptTool
      steps={[
        "Make one warm thing. Tea, water, whatever's fastest.",
        "Hold the cup with both hands before you drink.",
        "Feel the heat in your palms. Count five breaths.",
        "Now take the first sip. Slowly.",
      ]}
      done="That was a whole small kindness, start to finish."
    />
  );
}

const ONE_THING_KEY = "evenme:onething";
export function OneThingTool() {
  const [text, setText] = useState("");
  const [saved, setSaved] = useState<string | null>(null);

  useEffect(() => {
    try {
      setSaved(window.localStorage.getItem(ONE_THING_KEY));
    } catch {
      // ignore
    }
  }, []);

  if (saved) {
    return (
      <div className="py-6 text-center">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">The only thing</p>
        <p className="mt-3 text-2xl font-serif text-foreground">{saved}</p>
        <p className="mt-3 text-sm text-muted-foreground">Everything else waits. It really does.</p>
        <button
          onClick={() => {
            window.localStorage.removeItem(ONE_THING_KEY);
            setSaved(null);
            setText("");
          }}
          className="mt-6 rounded-2xl border border-border px-6 py-3 text-foreground hover:bg-muted"
        >
          Pick a different one
        </button>
      </div>
    );
  }

  return (
    <div className="py-2">
      <p className="text-lg text-foreground">
        What is the one next thing? Not the list. One.
      </p>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="e.g. put the kettle on"
        className="mt-4 w-full rounded-2xl border border-border bg-background px-5 py-4 outline-none focus:ring-2 focus:ring-ring"
      />
      <button
        disabled={!text.trim()}
        onClick={() => {
          const v = text.trim();
          window.localStorage.setItem(ONE_THING_KEY, v);
          setSaved(v);
          haptic();
        }}
        className="mt-4 w-full rounded-2xl bg-primary py-4 text-primary-foreground font-medium hover:opacity-90 disabled:opacity-40"
      >
        That's the one
      </button>
    </div>
  );
}

const SAFE_MESSAGES = [
  "Today was a lot. I don't need advice — just wanted someone to know.",
  "Hard day here. Can you send me something normal to think about?",
  "No emergency. I just wanted to say hi to someone who likes me.",
  "I'm running low. If you have ten minutes this week, I'd take them.",
];
export function TextSomeoneTool() {
  const [i, setI] = useState(0);
  const [copied, setCopied] = useState(false);
  const msg = SAFE_MESSAGES[i % SAFE_MESSAGES.length];
  return (
    <div className="py-2">
      <p className="text-sm text-muted-foreground">
        Two sentences. That's the whole ask.
      </p>
      <p className="mt-3 rounded-2xl border border-border bg-background p-5 text-lg text-foreground">
        {msg}
      </p>
      <div className="mt-4 flex flex-col gap-3">
        <button
          onClick={async () => {
            try {
              if (navigator.share) await navigator.share({ text: msg });
              else await navigator.clipboard.writeText(msg);
              setCopied(true);
              haptic();
            } catch {
              // ignore
            }
          }}
          className="w-full rounded-2xl bg-primary py-4 text-primary-foreground font-medium hover:opacity-90"
        >
          {copied ? "Copied" : "Send this to someone"}
        </button>
        <button
          onClick={() => {
            setCopied(false);
            setI((v) => v + 1);
          }}
          className="w-full rounded-2xl border border-border py-3 text-foreground hover:bg-muted"
        >
          Different words
        </button>
      </div>
    </div>
  );
}

const TOMORROW_KEY = "evenme:tomorrow";
const TOMORROW_OPTIONS = [
  "Ten minutes alone with the door shut",
  "A real breakfast, sitting down",
  "One walk outside, no phone",
  "Saying no to one thing",
  "Going to bed twenty minutes earlier",
  "A hot drink while it's still hot",
  "Asking someone for one small favour",
  "Leaving one mess exactly where it is",
];
export function TomorrowKindnessTool() {
  const [picked, setPicked] = useState<string | null>(null);
  useEffect(() => {
    try {
      setPicked(window.localStorage.getItem(TOMORROW_KEY));
    } catch {
      // ignore
    }
  }, []);
  return (
    <div className="py-2">
      <p className="text-lg text-foreground">Pick one kindness for tomorrow-you.</p>
      <div className="mt-4 flex flex-col gap-2">
        {TOMORROW_OPTIONS.map((o) => (
          <button
            key={o}
            onClick={() => {
              window.localStorage.setItem(TOMORROW_KEY, o);
              setPicked(o);
              haptic();
            }}
            className={`rounded-2xl border px-5 py-4 text-left transition ${
              picked === o
                ? "border-primary bg-primary/10 text-foreground"
                : "border-border bg-background text-foreground hover:bg-muted"
            }`}
          >
            {o}
          </button>
        ))}
      </div>
      {picked && (
        <p className="mt-4 text-sm text-muted-foreground">
          Saved. It'll be waiting for you.
        </p>
      )}
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
  | "gratitude"
  | "sigh"
  | "cold-water"
  | "unclench"
  | "hand-heart"
  | "shake"
  | "look-far"
  | "sound-off"
  | "count-back"
  | "warm-drink"
  | "one-thing"
  | "text-someone"
  | "tomorrow-kindness";

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
  sigh: { title: "Three sighs", blurb: "The fastest way down. Twenty seconds." },
  "cold-water": { title: "Cool water", blurb: "Wrists or face. Forty-five seconds." },
  unclench: { title: "Unclench", blurb: "Jaw, shoulders, hands. Let go on purpose." },
  "hand-heart": { title: "Hand on heart", blurb: "One minute of the care you give everyone else." },
  shake: { title: "Shake it out", blurb: "Thirty seconds of moving the feeling through." },
  "look-far": { title: "Look far away", blurb: "Twenty seconds of distance for tired eyes." },
  "sound-off": { title: "Sound off", blurb: "Turn one noise off for a minute." },
  "count-back": { title: "Count back from five", blurb: "Slow and boring. Interrupts the spiral." },
  "warm-drink": { title: "Warm drink", blurb: "Make one. Hold it before you drink it." },
  "one-thing": { title: "The one thing rule", blurb: "Pick the next thing. Everything else waits." },
  "text-someone": { title: "Text a safe person", blurb: "Words already written for you." },
  "tomorrow-kindness": { title: "Tomorrow's one kindness", blurb: "Choose something small for tomorrow-you." },
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
