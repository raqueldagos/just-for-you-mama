// Even Me — the quiet companion layer.
// Soft accumulation only: collection, belonging, minutes kept.
// Nothing here can be failed. Missing days does nothing.

import { store } from "@/lib/evenme";

// ---------------------------------------------------------------- prompts

export const PROMPTS: { key: string; text: string }[] = [
  { key: "patience_tank", text: "How full is your patience tank?" },
  { key: "any_part_yours", text: "Did any part of today feel like yours?" },
  { key: "thin_or_tired", text: "Are you stretched thin, or just tired?" },
  { key: "how_much_quiet", text: "How much quiet do you need?" },
  { key: "felt_like_you", text: "Did you feel like yourself at any point?" },
  { key: "mental_load", text: "Is the mental load loud right now?" },
  { key: "enough_tonight", text: "What would feel like enough for tonight?" },
];

/** Same prompt for the whole calendar day. */
export function promptForToday(date = new Date()) {
  const days = Math.floor(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86400000,
  );
  return PROMPTS[((days % PROMPTS.length) + PROMPTS.length) % PROMPTS.length];
}

// ---------------------------------------------------------------- feelings

export type FeelingKey =
  | "stretched_thin"
  | "running_on_empty"
  | "okayish"
  | "had_one_thing_mine"
  | "felt_like_myself"
  | "snapped_and_hate_that"
  | "quiet_needed";

export const FEELINGS: { key: FeelingKey; label: string }[] = [
  { key: "stretched_thin", label: "Stretched thin" },
  { key: "running_on_empty", label: "Running on empty" },
  { key: "okayish", label: "Okayish" },
  { key: "had_one_thing_mine", label: "I had one thing that was mine" },
  { key: "felt_like_myself", label: "I felt like myself" },
  { key: "snapped_and_hate_that", label: "I snapped and I hate that" },
  { key: "quiet_needed", label: "I need quiet" },
];

export function feelingLabel(key: string): string {
  return FEELINGS.find((f) => f.key === key)?.label ?? "Okayish";
}

/** Baselines so the belonging line never reads 0 or 1. */
export const FEELING_BASELINE: Record<FeelingKey, number> = {
  stretched_thin: 847,
  running_on_empty: 612,
  okayish: 498,
  had_one_thing_mine: 236,
  felt_like_myself: 189,
  snapped_and_hate_that: 431,
  quiet_needed: 704,
};

// ---------------------------------------------------------------- slips

export type Slip = { id: string; text: string; rare?: boolean };

export const SLIPS: Slip[] = [
  { id: "1", text: "You can be boring tonight." },
  { id: "2", text: "The laundry can wait." },
  { id: "3", text: "Wanting quiet is not rejecting them." },
  { id: "4", text: "You don't have to narrate every feeling." },
  { id: "5", text: "You can close the kitchen." },
  { id: "6", text: "You don't have to be the fun parent tonight." },
  { id: "7", text: "One thing can stay unfinished." },
  { id: "8", text: "You are allowed to want the day to be over." },
  { id: "9", text: "You don't have to earn rest." },
  { id: "10", text: "Not every evening needs a lesson." },
  { id: "11", text: "You can let someone else figure it out." },
  { id: "12", text: "You disappearing into 90 seconds is not selfish." },
  { id: "13", text: "You can be short and still be a good mother." },
  { id: "14", text: "The house does not need you every minute." },
  { id: "15", text: "You can want your body left alone." },
  { id: "16", text: "You still exist when nobody needs you.", rare: true },
  { id: "17", text: "This app is not another way to be good.", rare: true },
];

export function slipById(id: string): Slip | undefined {
  return SLIPS.find((s) => s.id === id);
}

const MATCH: Record<FeelingKey, string[]> = {
  stretched_thin: ["1", "2", "7", "8", "9"],
  running_on_empty: ["1", "2", "7", "8", "9"],
  snapped_and_hate_that: ["4", "13", "10"],
  quiet_needed: ["3", "15", "5"],
  felt_like_myself: ["12", "16"],
  had_one_thing_mine: ["12", "16"],
  okayish: ["6", "11", "14"],
};

/** Draw one slip for a feeling. Rare slips only appear at 7 and 14 total check-ins. */
export function drawSlip(feeling: FeelingKey, totalCheckins: number): Slip {
  const rareReady = totalCheckins + 1 >= 7;
  const rareAllUnlocked = totalCheckins + 1 >= 14;
  const pool = (MATCH[feeling] ?? MATCH.okayish).filter((id) => {
    const s = slipById(id);
    if (!s?.rare) return true;
    return id === "16" ? rareReady : rareAllUnlocked;
  });
  const owned = new Set(getSlips());
  const fresh = pool.filter((id) => !owned.has(id));
  const from = fresh.length ? fresh : pool;
  const id = from[Math.floor(Math.random() * from.length)];
  return slipById(id) ?? SLIPS[0];
}

// ---------------------------------------------------------------- quests

export const QUESTS: { key: string; text: string }[] = [
  { key: "car_60", text: "Sit in the car for 60 seconds before going in." },
  { key: "hot_tea", text: "Drink the tea while it's still hot." },
  { key: "phone_down", text: "Put the phone down until the kettle boils." },
  { key: "laundry_waits", text: "Let the laundry wait tonight." },
  { key: "not_fun_parent", text: "You don't have to be the fun parent tonight." },
];

export function questForToday(date = new Date()) {
  const days = Math.floor(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86400000,
  );
  return QUESTS[((days % QUESTS.length) + QUESTS.length) % QUESTS.length];
}

// ---------------------------------------------------------------- local state

const CK = {
  checkins: "evenme:c:checkins",
  slips: "evenme:c:slips",
  onboarded: "evenme:c:onboardingDone",
  reminderEnabled: "evenme:c:reminderEnabled",
  reminderLabel: "evenme:c:reminderLabel",
  lastNoteAt: "evenme:c:lastNoteAt",
  a2hsSeen: "evenme:c:a2hsSeen",
} as const;

export const COMPANION_KEYS = CK;

export type LocalCheckin = {
  ts: string;
  promptKey: string;
  feeling: FeelingKey;
  note?: string;
  slipId: string;
  questDone: boolean;
  questKey?: string;
};

function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = store.get(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function getLocalCheckins(): LocalCheckin[] {
  return readJSON<LocalCheckin[]>(CK.checkins, []);
}

export function getSlips(): string[] {
  return readJSON<string[]>(CK.slips, []);
}

export function keepSlip(id: string) {
  const list = getSlips();
  if (!list.includes(id)) {
    list.push(id);
    store.set(CK.slips, JSON.stringify(list));
  }
}

export function saveLocalCheckin(c: LocalCheckin) {
  const list = getLocalCheckins();
  list.push(c);
  store.set(CK.checkins, JSON.stringify(list));
}

export function checkinsCount(): number {
  return getLocalCheckins().length;
}

/** +2 minutes per completed check-in. Never goes down. */
export function minutesKept(): number {
  return checkinsCount() * 2;
}

export function minutesThisMonth(): number {
  const now = new Date();
  return (
    getLocalCheckins().filter((c) => {
      const d = new Date(c.ts);
      return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
    }).length * 2
  );
}

function sameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function todaysCheckin(): LocalCheckin | null {
  const now = new Date();
  const list = getLocalCheckins();
  for (let i = list.length - 1; i >= 0; i--) {
    if (sameDay(new Date(list[i].ts), now)) return list[i];
  }
  return null;
}

export function checkedInToday(): boolean {
  return todaysCheckin() !== null;
}

// ------------------------------------------------------------- the window

/** Stage 0-6 from total check-ins. Never reverses. */
const STAGE_THRESHOLDS = [0, 1, 2, 3, 5, 8, 12];

export function windowStage(count = checkinsCount()): number {
  let stage = 0;
  STAGE_THRESHOLDS.forEach((t, i) => {
    if (count >= t) stage = i;
  });
  return stage;
}

export const STAGE_CAPTIONS = [
  "The curtains are closed. That's fine.",
  "First light.",
  "Something small is growing on the sill.",
  "It's taller than last time.",
  "There's a mug up there now.",
  "The evening lamp is on.",
  "A fuller room. Still quiet.",
];

// ------------------------------------------------------------- onboarding

export function onboardingDone(): boolean {
  return store.get(CK.onboarded) === "true";
}
export function setOnboardingDone() {
  store.set(CK.onboarded, "true");
}

// ------------------------------------------------------------- reminder

export function reminderEnabled(): boolean {
  return store.get(CK.reminderEnabled) === "true";
}
export function setReminderEnabled(on: boolean) {
  store.set(CK.reminderEnabled, on ? "true" : "false");
  if (!store.get(CK.reminderLabel)) {
    store.set(CK.reminderLabel, "after the house is quiet");
  }
}
export function reminderLabel(): string {
  return store.get(CK.reminderLabel) ?? "after the house is quiet";
}

// ------------------------------------------------------- the quiet note

/** Due after the 3rd check-in in a rolling 7 days, then weekly. */
export function quietNoteDue(): boolean {
  const list = getLocalCheckins();
  const weekAgo = Date.now() - 7 * 86400000;
  const recent = list.filter((c) => new Date(c.ts).getTime() >= weekAgo);
  if (recent.length < 3) return false;
  const last = store.get(CK.lastNoteAt);
  if (!last) return true;
  return Date.now() - new Date(last).getTime() >= 7 * 86400000;
}

export function markQuietNoteSeen() {
  store.set(CK.lastNoteAt, new Date().toISOString());
}

export function quietNoteData() {
  const weekAgo = Date.now() - 7 * 86400000;
  const recent = getLocalCheckins().filter(
    (c) => new Date(c.ts).getTime() >= weekAgo,
  );
  const tally = new Map<string, number>();
  recent.forEach((c) => tally.set(c.feeling, (tally.get(c.feeling) ?? 0) + 1));
  let top: string | null = null;
  let best = 0;
  tally.forEach((n, k) => {
    if (n > best) {
      best = n;
      top = k;
    }
  });
  const dayHours = recent.filter((c) => {
    const h = new Date(c.ts).getHours();
    return h >= 8 && h < 16;
  }).length;
  return {
    times: recent.length,
    topFeeling: top as string | null,
    schoolishLouder: recent.length >= 3 && dayHours > recent.length / 2,
  };
}

// ------------------------------------------------------------- add to home

export function a2hsSeen(): boolean {
  return store.get(CK.a2hsSeen) === "true";
}
export function setA2hsSeen() {
  store.set(CK.a2hsSeen, "true");
}

export const SHARE_TEXT =
  "This one is only 90 seconds and it's not about the kids. evenme.online";
