// Even Me — which tool fits which state, and why.
// Keeps the "here's why this one" reasoning out of the components.

import type { ToolKey } from "@/components/tools";
import { pickForYou, type Energy, type Item, type Mood } from "@/lib/foryou";

export type ToolGroup = "calm" | "unstuck" | "connect" | "restore";

export const GROUP_META: Record<ToolGroup, { label: string; blurb: string }> = {
  calm: { label: "Calm down", blurb: "When your body is louder than your thoughts." },
  unstuck: { label: "Get unstuck", blurb: "When everything is a blur of next things." },
  connect: { label: "Feel less alone", blurb: "When the day was yours to carry by yourself." },
  restore: { label: "Restore energy", blurb: "When there's nothing left in the tank." },
};

type Match = {
  group: ToolGroup;
  moods: Mood[];
  energies: Energy[];
  reason: string;
};

export const TOOL_MATCH: Record<ToolKey, Match> = {
  sigh: {
    group: "calm",
    moods: ["anxious", "overwhelmed", "angry"],
    energies: ["empty", "low", "steady"],
    reason: "Your body is running hot. Three long sighs bring the alarm down faster than talking does.",
  },
  "breath-60": {
    group: "calm",
    moods: ["anxious", "overwhelmed", "angry", "tired"],
    energies: ["empty", "low"],
    reason: "You don't have much left, so this asks for one minute and nothing else.",
  },
  "breath-90": {
    group: "calm",
    moods: ["anxious", "overwhelmed", "angry"],
    energies: ["low", "steady", "bright"],
    reason: "A longer out-breath than in-breath tells your body the emergency is over.",
  },
  unclench: {
    group: "calm",
    moods: ["angry", "anxious", "overwhelmed", "tired"],
    energies: ["empty", "low", "steady"],
    reason: "You've been holding your jaw and shoulders all day. Letting go is quicker than calming down.",
  },
  "cold-water": {
    group: "calm",
    moods: ["angry", "anxious", "overwhelmed"],
    energies: ["low", "steady", "bright"],
    reason: "When feelings are too big for words, cool water gives your system a different signal to follow.",
  },
  shake: {
    group: "calm",
    moods: ["angry", "anxious", "numb"],
    energies: ["low", "steady", "bright"],
    reason: "That charge in your chest needs somewhere to go. Thirty seconds of movement moves it through.",
  },
  grounding: {
    group: "calm",
    moods: ["anxious", "overwhelmed", "numb"],
    energies: ["low", "steady"],
    reason: "Your head is somewhere else. Naming what's actually in the room brings you back to it.",
  },
  "count-back": {
    group: "calm",
    moods: ["anxious", "guilty", "overwhelmed"],
    energies: ["empty", "low", "steady"],
    reason: "The spiral needs something boring to trip over. Five slow numbers will do it.",
  },
  "body-scan": {
    group: "calm",
    moods: ["tired", "anxious", "numb"],
    energies: ["empty", "low"],
    reason: "You can do this lying down. It asks nothing except noticing.",
  },

  "one-thing": {
    group: "unstuck",
    moods: ["overwhelmed", "anxious", "numb"],
    energies: ["empty", "low", "steady"],
    reason: "Too much at once is the problem, not you. Pick one next thing and let the rest wait.",
  },
  need: {
    group: "unstuck",
    moods: ["tired", "overwhelmed", "numb", "low"],
    energies: ["empty", "low"],
    reason: "You've been deciding all day. This decides one small thing for you.",
  },
  "name-it": {
    group: "unstuck",
    moods: ["numb", "angry", "guilty", "low"],
    energies: ["low", "steady", "bright"],
    reason: "It's hard to soothe a feeling you haven't named. Naming it takes some of its power.",
  },
  permission: {
    group: "unstuck",
    moods: ["guilty", "overwhelmed", "tired"],
    energies: ["low", "steady", "bright"],
    reason: "The guilt loop keeps going until someone says it's allowed. Today that's you.",
  },
  journal: {
    group: "unstuck",
    moods: ["low", "numb", "guilty", "grateful"],
    energies: ["steady", "bright"],
    reason: "One sentence, not a page. Enough to get today out of your head.",
  },

  "text-someone": {
    group: "connect",
    moods: ["lonely", "low", "guilty", "overwhelmed"],
    energies: ["empty", "low", "steady"],
    reason: "Reaching out is heavy when you're this tired, so the words are already written for you.",
  },
  "hand-heart": {
    group: "connect",
    moods: ["lonely", "guilty", "low", "tired"],
    energies: ["empty", "low", "steady"],
    reason: "You give this exact kind of care all day. One minute of it comes back to you.",
  },
  wins: {
    group: "connect",
    moods: ["guilty", "low", "numb", "content"],
    energies: ["low", "steady", "bright"],
    reason: "Nobody saw what you did today. This is where it gets written down anyway.",
  },
  gratitude: {
    group: "connect",
    moods: ["grateful", "content", "neutral", "energized"],
    energies: ["steady", "bright"],
    reason: "Something felt tender-good today. Naming it makes it stay a little longer.",
  },

  "warm-drink": {
    group: "restore",
    moods: ["tired", "low", "lonely", "numb"],
    energies: ["empty", "low"],
    reason: "A small warm thing, made only for you. That's the whole point of it.",
  },
  "look-far": {
    group: "restore",
    moods: ["tired", "overwhelmed", "numb"],
    energies: ["empty", "low"],
    reason: "Your eyes have been close-up all day. Twenty seconds of distance unwinds more than you'd think.",
  },
  "sound-off": {
    group: "restore",
    moods: ["overwhelmed", "tired", "anxious"],
    energies: ["empty", "low", "steady"],
    reason: "Sensory overload is real for you too. Turning one noise off is one less thing asking for you.",
  },
  "timer-2": {
    group: "restore",
    moods: ["tired", "overwhelmed", "numb"],
    energies: ["empty", "low"],
    reason: "Two minutes of nothing. Short enough that you can actually take it.",
  },
  "timer-5": {
    group: "restore",
    moods: ["tired", "overwhelmed", "low"],
    energies: ["low", "steady"],
    reason: "A real pause, still short enough to fit in the day you're having.",
  },
  "timer-10": {
    group: "restore",
    moods: ["tired", "overwhelmed", "angry"],
    energies: ["steady", "bright"],
    reason: "You have a little to spend. Spend it somewhere that isn't this room.",
  },
  "tomorrow-kindness": {
    group: "restore",
    moods: ["content", "grateful", "energized", "neutral", "tired"],
    energies: ["low", "steady", "bright"],
    reason: "Today's nearly done. Leave one small kindness out for tomorrow-you.",
  },
};

export const ALL_TOOLS = Object.keys(TOOL_MATCH) as ToolKey[];

export function toolsByGroup(): { group: ToolGroup; tools: ToolKey[] }[] {
  return (Object.keys(GROUP_META) as ToolGroup[]).map((group) => ({
    group,
    tools: ALL_TOOLS.filter((k) => TOOL_MATCH[k].group === group),
  }));
}

function rng(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

/** Best-fitting tools for a mood + energy, most relevant first. */
export function recommendTools(
  mood: Mood,
  energy: Energy,
  n = 3,
  seed?: number,
): ToolKey[] {
  const rand = rng(seed ?? 1);
  return ALL_TOOLS.map((key) => {
    const m = TOOL_MATCH[key];
    let s = 0;
    if (m.moods.includes(mood)) s += 3;
    if (m.energies.includes(energy)) s += 2;
    return { key, s: s + rand() * 0.9 };
  })
    .filter((x) => x.s > 1)
    .sort((a, b) => b.s - a.s)
    .slice(0, n)
    .map((x) => x.key);
}

/** Tools that fit any of a set of moods (used by explore categories). */
export function recommendForMoods(moods: Mood[], n = 3): ToolKey[] {
  return ALL_TOOLS.map((key) => {
    const m = TOOL_MATCH[key];
    const s = m.moods.filter((x) => moods.includes(x)).length;
    return { key, s };
  })
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, n)
    .map((x) => x.key);
}

// ---- Session flow ----

export type SessionStep =
  | { kind: "open"; text: string }
  | { kind: "card"; item: Item }
  | { kind: "tool"; tools: ToolKey[] }
  | { kind: "close"; text: string };

const OPENERS: Record<Energy, string> = {
  empty: "Let's keep this very small. One thing at a time.",
  low: "No rush. One thing at a time.",
  steady: "Here's your moment. One thing at a time.",
  bright: "You've got a little to spend today. One thing at a time.",
};

const CLOSERS = [
  "That's enough for today. Come back tomorrow if you want to.",
  "You showed up for yourself. That counted.",
  "Nothing else to do now. Put the phone down.",
];

export function buildSession(
  mood: Mood,
  energy: Energy,
  opts?: { seed?: number; exclude?: string[] },
): SessionStep[] {
  const seed = opts?.seed ?? Math.floor(Math.random() * 1e9);
  const picked = pickForYou(mood, energy, { seed, exclude: opts?.exclude });
  const tools = recommendTools(mood, energy, 4, seed);

  const steps: SessionStep[] = [{ kind: "open", text: OPENERS[energy] ?? OPENERS.steady }];
  for (const item of picked.cards) steps.push({ kind: "card", item });
  if (picked.toolAction) steps.push({ kind: "card", item: picked.toolAction });
  if (tools.length) steps.push({ kind: "tool", tools });
  steps.push({ kind: "close", text: CLOSERS[seed % CLOSERS.length] });
  return steps;
}
