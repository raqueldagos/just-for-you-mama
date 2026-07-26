// Even Me — local content + storage helpers. No backend for v1.

export type TileKey =
  | "meltdown"
  | "school_call"
  | "sensory_overload"
  | "masking"
  | "guilt_spiral"
  | "lost_it";

export const TILES: { key: TileKey; label: string }[] = [
  { key: "meltdown", label: "Meltdown just happened" },
  { key: "school_call", label: "School called" },
  { key: "sensory_overload", label: "Sensory overload" },
  { key: "masking", label: "I've been masking all day" },
  { key: "guilt_spiral", label: "Guilt spiral" },
  { key: "lost_it", label: "I lost it" },
];

export const CONTENT: Record<
  TileKey,
  { reset: string; send_template: string; me_too: string[] }
> = {
  meltdown: {
    reset:
      "That was a lot, and it's over now. His nervous system got flooded — not because of anything you did wrong. Take one slow breath. You don't have to analyze it yet. You just have to get through the next five minutes, and you're already doing that.",
    send_template:
      "That was a rough one. I'm pretty depleted right now — can you take the next bit?",
    me_too: [
      "Just had one in the cereal aisle. Sitting in my car for a minute before I go back in.",
      "Second one today. I'm so tired but he's okay now and so am I.",
    ],
  },
  school_call: {
    reset:
      "A phone call from school can make your whole chest go tight before you even answer. Whatever they said, you can respond later, calmer, in writing if you want to. You don't owe anyone an instant reaction.",
    send_template: "School just called. I need a minute before I talk about it, ok?",
    me_too: [
      "Got 'the call' again at 2pm. I used to panic, now I just sigh and go pick him up.",
      "Same. Third time this month. I'm learning to breathe before I call back.",
    ],
  },
  sensory_overload: {
    reset:
      "Overload isn't dramatic, it's real. Whether it's his or yours, the fix is the same: less input, right now. Dim something, quiet something, sit somewhere plain for two minutes.",
    send_template: "I need five minutes of quiet, no talking, before I can be fully here.",
    me_too: [
      "Both of us were overloaded by 4pm today. We just sat in the dark for a bit.",
      "I didn't know moms could get sensory overload too until I found this app, honestly.",
    ],
  },
  masking: {
    reset:
      "Holding it together all day is its own kind of exhausting, even though nobody sees the effort. You don't have to keep performing calm right now. This is a safe place to stop.",
    send_template:
      "I've been holding it together all day and I'm running on empty. Can we talk tonight?",
    me_too: [
      "Smiled through an entire birthday party today while screaming internally. Made it home.",
      "Masking at work AND at pickup today. I'm so tired of performing fine.",
    ],
  },
  guilt_spiral: {
    reset:
      "You are not failing him. You are parenting a kid whose needs are genuinely harder than average, with genuinely less support than you deserve. That's not the same as doing it wrong.",
    send_template:
      "Having a hard guilt day. Not asking you to fix it, just wanted to say it out loud to someone.",
    me_too: [
      "Cried in the shower about something dumb I said this morning. Still love him more than anything.",
      "Guilt is so loud today. Trying to remember it's not the same as truth.",
    ],
  },
  lost_it: {
    reset:
      "You yelled. That's human, not a verdict on you as a mother. Repair matters more than perfection — a short, honest 'I'm sorry I yelled, that wasn't about you' goes a long way, when you're ready.",
    send_template:
      "I lost my temper earlier and I feel bad about it. Just needed to say that out loud.",
    me_too: [
      "Snapped hard at dinner. Going to go apologize once we've both cooled down.",
      "Yelled today. Repaired it after. Still a good mom. Repeating that to myself.",
    ],
  },
};

export type Checkin = { date: string; tile: TileKey };

const K = {
  onboarded: "evenme:onboarded",
  name: "evenme:name",
  reminder: "evenme:reminderTime",
  email: "evenme:email",
  checkins: "evenme:checkins",
  trialStart: "evenme:trialStart",
  subscribed: "evenme:subscribed",
} as const;

const isBrowser = () => typeof window !== "undefined";

export const store = {
  get(key: string): string | null {
    if (!isBrowser()) return null;
    return window.localStorage.getItem(key);
  },
  set(key: string, value: string) {
    if (!isBrowser()) return;
    window.localStorage.setItem(key, value);
  },
};

export const KEYS = K;

export function todayISO() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function getCheckins(): Checkin[] {
  try {
    const raw = store.get(K.checkins);
    return raw ? (JSON.parse(raw) as Checkin[]) : [];
  } catch {
    return [];
  }
}

export function addCheckin(tile: TileKey) {
  const list = getCheckins();
  const today = todayISO();
  // one per day — replace if exists
  const filtered = list.filter((c) => c.date !== today);
  filtered.push({ date: today, tile });
  store.set(K.checkins, JSON.stringify(filtered));
}

const MOOD_CHECKINS_KEY = "evenme:moodCheckins";
export type MoodCheckin = { date: string; mood: string; energy?: string; note?: string };
export function getMoodCheckins(): MoodCheckin[] {
  try {
    const raw = store.get(MOOD_CHECKINS_KEY);
    return raw ? (JSON.parse(raw) as MoodCheckin[]) : [];
  } catch {
    return [];
  }
}
export function addMoodCheckin(mood: string, energy?: string, note?: string) {
  const list = getMoodCheckins();
  const today = todayISO();
  const filtered = list.filter((c) => c.date !== today);
  filtered.push({ date: today, mood, energy, note });
  store.set(MOOD_CHECKINS_KEY, JSON.stringify(filtered));
}

export function streakCount(): number {
  const tiles = getCheckins();
  const moods = getMoodCheckins();
  const dates = new Set<string>([
    ...tiles.map((c) => c.date),
    ...moods.map((c) => c.date),
  ]);
  if (!dates.size) return 0;
  let count = 0;
  const d = new Date();
  while (dates.has(fmt(d))) {
    count++;
    d.setDate(d.getDate() - 1);
  }
  return count;
}

function fmt(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function ensureTrialStart(): string {
  let t = store.get(K.trialStart);
  if (!t) {
    t = new Date().toISOString();
    store.set(K.trialStart, t);
  }
  return t;
}

export const TRIAL_DAYS = 3;

export function trialDaysLeft(): number {
  const t = store.get(K.trialStart);
  if (!t) return TRIAL_DAYS;
  const started = new Date(t).getTime();
  const days = Math.floor((Date.now() - started) / (1000 * 60 * 60 * 24));
  return Math.max(0, TRIAL_DAYS - days);
}

export function isSubscribed(): boolean {
  return store.get(K.subscribed) === "true";
}

export function setSubscribed(active: boolean) {
  store.set(K.subscribed, active ? "true" : "false");
}

export function hasAccess(): boolean {
  return isSubscribed() || trialDaysLeft() > 0;
}


export function pickMeToo(tile: TileKey): string {
  const arr = CONTENT[tile].me_too;
  return arr[Math.floor(Math.random() * arr.length)];
}
