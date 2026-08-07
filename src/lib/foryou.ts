// Even Me — "For You Right Now" content library.
// All client-side. Expand freely.

export type Mood =
  | "tired"
  | "overwhelmed"
  | "anxious"
  | "low"
  | "neutral"
  | "content"
  | "energized"
  | "grateful"
  | "angry"
  | "lonely"
  | "guilty"
  | "numb";

export type Energy = "empty" | "low" | "steady" | "bright";

export type ItemKind =
  | "reflection" // warm answer
  | "affirmation"
  | "advice"
  | "action" // micro-action (<2 min)
  | "oneliner"
  | "permission"
  | "gratitude"
  | "kindness"; // surprise extra-kindness card

export type Item = {
  id: string;
  kind: ItemKind;
  text: string;
  moods: Mood[];
  // optional CTA label for `action` items
  cta?: string;
};

export const MOOD_META: Record<Mood, { label: string; emoji: string; blurb: string }> = {
  tired: { label: "Tired", emoji: "🌙", blurb: "Running on fumes." },
  overwhelmed: { label: "Overwhelmed", emoji: "🌊", blurb: "Too much, all at once." },
  anxious: { label: "Anxious", emoji: "🍃", blurb: "Wired, a little jumpy." },
  low: { label: "Low", emoji: "☁️", blurb: "Heavy, quiet, flat." },
  neutral: { label: "Neutral", emoji: "🫧", blurb: "Just here." },
  content: { label: "Content", emoji: "🌾", blurb: "Softly okay." },
  energized: { label: "Energized", emoji: "☀️", blurb: "A little spark." },
  grateful: { label: "Grateful", emoji: "🌼", blurb: "Something feels tender-good." },
  angry: { label: "Angry", emoji: "🔥", blurb: "Something's hot in your chest." },
  lonely: { label: "Lonely", emoji: "🪞", blurb: "Missing someone, or something." },
  guilty: { label: "Guilty", emoji: "🕊️", blurb: "That old chewing feeling." },
  numb: { label: "Numb", emoji: "🌫️", blurb: "Nothing's landing." },
};

export const ENERGY_META: Record<Energy, { label: string; blurb: string }> = {
  empty: { label: "Empty", blurb: "Barely any left." },
  low: { label: "Low", blurb: "Some, not much." },
  steady: { label: "Steady", blurb: "Enough for now." },
  bright: { label: "Bright", blurb: "There's something to spend." },
};

// ---- Content dataset ----
// Tagged with moods. An item can serve multiple moods.

let _id = 0;
const mk = (kind: ItemKind, text: string, moods: Mood[], cta?: string): Item => ({
  id: `${kind}-${++_id}`,
  kind,
  text,
  moods,
  cta,
});

export const ITEMS: Item[] = [
  // ---------- AFFIRMATIONS ----------
  mk("affirmation", "You're allowed to be tired and still be a good parent.", ["tired", "guilty", "low", "overwhelmed"]),
  mk("affirmation", "Rest is not a reward. It's maintenance.", ["tired", "overwhelmed", "low"]),
  mk("affirmation", "You did not fail today. You survived a hard one.", ["low", "guilty", "overwhelmed", "tired"]),
  mk("affirmation", "Being patient took work today. That counts.", ["tired", "guilty", "angry", "neutral"]),
  mk("affirmation", "You are more than the worst moment of your day.", ["guilty", "angry", "low"]),
  mk("affirmation", "Your feelings are information, not verdicts.", ["anxious", "guilty", "angry", "overwhelmed"]),
  mk("affirmation", "Slow is a legitimate speed.", ["tired", "overwhelmed", "low"]),
  mk("affirmation", "You don't have to earn a break.", ["tired", "guilty", "overwhelmed"]),
  mk("affirmation", "The love is there, even when the patience isn't.", ["guilty", "angry", "tired"]),
  mk("affirmation", "You are safe to feel this. It will move.", ["anxious", "angry", "low", "overwhelmed", "numb"]),
  mk("affirmation", "You are not what your inner critic says right now.", ["guilty", "low", "anxious"]),
  mk("affirmation", "Small and consistent is a whole strategy.", ["tired", "neutral", "content"]),
  mk("affirmation", "You are the calm your kid comes back to.", ["tired", "grateful", "content"]),
  mk("affirmation", "You get to be a person, not just a role.", ["lonely", "overwhelmed", "numb"]),
  mk("affirmation", "Nothing about you is broken for needing help.", ["low", "guilty", "lonely"]),
  mk("affirmation", "A rough hour is not a rough life.", ["low", "overwhelmed", "angry"]),
  mk("affirmation", "You can love your kid and hate today.", ["angry", "tired", "overwhelmed", "guilty"]),
  mk("affirmation", "You are doing something invisible and enormous.", ["tired", "lonely", "low"]),
  mk("affirmation", "Softness is not weakness.", ["low", "tired", "grateful"]),
  mk("affirmation", "You are allowed to change your mind about the plan.", ["overwhelmed", "anxious"]),
  mk("affirmation", "Not everything needs a solution today.", ["overwhelmed", "anxious", "tired"]),
  mk("affirmation", "You can pause without quitting.", ["overwhelmed", "tired"]),
  mk("affirmation", "You've done impossible things quietly.", ["tired", "low", "lonely"]),
  mk("affirmation", "Your nervous system is trying to protect you.", ["anxious", "overwhelmed", "angry"]),
  mk("affirmation", "You don't have to be okay to be loved.", ["low", "lonely", "numb"]),
  mk("affirmation", "Repair is more powerful than perfection.", ["guilty", "angry"]),
  mk("affirmation", "You are the parent your kid needs — not a perfect one.", ["guilty", "tired"]),
  mk("affirmation", "You are still growing. Even now.", ["low", "neutral", "content"]),
  mk("affirmation", "You are allowed to want your life to be easier.", ["tired", "overwhelmed", "lonely"]),
  mk("affirmation", "You matter in this house too.", ["lonely", "low", "numb"]),

  // ---------- REFLECTIONS (short warm answers) ----------
  mk("reflection", "The fact that you're checking in on yourself is already the work. Most people skip this step.", ["tired", "overwhelmed", "low", "neutral"]),
  mk("reflection", "Overwhelm often just means: too many open tabs in your head. You don't have to close them all — just pick one to look at.", ["overwhelmed", "anxious"]),
  mk("reflection", "Tired isn't a character flaw. It's a receipt for what you've been carrying.", ["tired", "overwhelmed"]),
  mk("reflection", "Anger is often grief and exhaustion wearing louder clothes. You don't have to interrogate it — just notice it.", ["angry", "tired"]),
  mk("reflection", "Guilt shows up loudest in parents who care the most. That's not proof you failed. It's proof you love.", ["guilty", "low"]),
  mk("reflection", "You don't need a good reason to feel low. Some days are just weather.", ["low", "numb", "neutral"]),
  mk("reflection", "You can be lonely inside a house full of people. It doesn't mean anything is wrong with you.", ["lonely"]),
  mk("reflection", "Numb is a nervous system doing its job. Not a sign you don't care.", ["numb", "tired"]),
  mk("reflection", "Contentment is quiet. That's why it's easy to miss. This is what it looks like when things are okay.", ["content", "grateful", "neutral"]),
  mk("reflection", "A little energy today doesn't have to be spent. You're allowed to bank some.", ["energized", "content"]),
  mk("reflection", "You're not behind. You're carrying more than the timeline accounts for.", ["overwhelmed", "tired", "guilty"]),
  mk("reflection", "You are allowed to want a version of this that's easier — and still love the life you have.", ["tired", "lonely", "low"]),
  mk("reflection", "The bar for a 'good day' can be: everyone's still breathing and someone got a hug.", ["tired", "overwhelmed", "low"]),
  mk("reflection", "Anxious brains rehearse. It doesn't mean the thing will happen. It means your brain is being thorough.", ["anxious"]),
  mk("reflection", "You are not the mood you woke up in.", ["low", "numb", "angry"]),
  mk("reflection", "It's okay if today's plan is 'less than yesterday.'", ["tired", "overwhelmed", "low"]),
  mk("reflection", "You don't need to be inspired. You just need to be here.", ["low", "numb", "tired"]),
  mk("reflection", "The right amount of doing today might be very little. That's still doing.", ["tired", "low", "overwhelmed"]),
  mk("reflection", "You're allowed to need what you need, even if no one else in the house needs it.", ["lonely", "overwhelmed", "tired"]),
  mk("reflection", "Being 'on' for someone else's nervous system is real work. Of course you're depleted.", ["tired", "overwhelmed"]),
  mk("reflection", "You can love hard and still need distance sometimes. Both are true.", ["overwhelmed", "guilty", "angry"]),
  mk("reflection", "Grateful and tired can share a chair.", ["grateful", "tired", "content"]),
  mk("reflection", "Not every feeling needs a next step. Some just want to be seen.", ["low", "numb", "anxious"]),
  mk("reflection", "You are allowed to be the one who needs care today.", ["tired", "low", "lonely"]),
  mk("reflection", "You already do the hardest parenting work: the invisible kind.", ["tired", "lonely", "guilty"]),
  mk("reflection", "Some days the win is just: I didn't disappear on myself.", ["low", "numb", "tired"]),

  // ---------- ADVICE ----------
  mk("advice", "If the day feels big, shrink the frame: what would help the next 20 minutes?", ["overwhelmed", "anxious"]),
  mk("advice", "Eat something with protein. Half your bad mood might be a snack.", ["low", "tired", "anxious", "angry"]),
  mk("advice", "Drink a full glass of water before you make any decisions.", ["tired", "anxious", "overwhelmed", "numb"]),
  mk("advice", "Lower one standard today on purpose. Pick which one.", ["overwhelmed", "tired"]),
  mk("advice", "If you can't rest, at least stop adding. Cancel one thing.", ["overwhelmed", "tired"]),
  mk("advice", "Get outside for 3 minutes. Not for a walk — just to change the air.", ["low", "anxious", "numb", "tired"]),
  mk("advice", "Text the friend you keep meaning to text. Two sentences is a full message.", ["lonely", "low"]),
  mk("advice", "Put your phone in another room for 10 minutes. See what shows up.", ["anxious", "overwhelmed"]),
  mk("advice", "Pick one micro-task under 2 minutes. Do only that. Stop.", ["overwhelmed", "low"]),
  mk("advice", "Make the coffee. Sit down while you drink it.", ["tired", "low"]),
  mk("advice", "Change your shirt. It sounds silly. It works.", ["low", "numb", "tired"]),
  mk("advice", "Warm your hands under running water for 30 seconds.", ["anxious", "numb"]),
  mk("advice", "If you can, lie flat on the floor for two minutes.", ["tired", "overwhelmed", "anxious"]),
  mk("advice", "Tomorrow-you does not need a lecture from today-you. Skip the pep talk. Just rest.", ["tired", "guilty", "low"]),
  mk("advice", "Say the thing you're dreading out loud, to yourself. It usually shrinks.", ["anxious", "overwhelmed"]),
  mk("advice", "If you're spiraling, name three things you can see. That's it.", ["anxious", "overwhelmed"]),
  mk("advice", "You don't have to answer the message today.", ["overwhelmed", "anxious"]),
  mk("advice", "Order the food. Cook tomorrow.", ["tired", "overwhelmed"]),
  mk("advice", "Ask for the smallest possible version of help.", ["overwhelmed", "lonely"]),
  mk("advice", "Turn one light off. Softer light, softer nervous system.", ["overwhelmed", "anxious"]),
  mk("advice", "Take off your shoes. Feet on the floor for a full minute.", ["anxious", "overwhelmed"]),
  mk("advice", "Do the dish. Just one. Not because you should — because momentum is kind to you.", ["low", "numb"]),
  mk("advice", "If everything feels urgent, nothing is. Pick.", ["overwhelmed", "anxious"]),
  mk("advice", "Sleep is a decision, not a reward. Go earlier than you think you should.", ["tired", "low"]),
  mk("advice", "Give the guilt a full minute. Then set it down and go do something small and kind for yourself.", ["guilty"]),
  mk("advice", "Being angry doesn't mean you have to do anything with it right now. Let it sit.", ["angry"]),
  mk("advice", "If you can't nap, close your eyes for 6 minutes. It's not nothing.", ["tired", "overwhelmed"]),
  mk("advice", "Loosen your jaw. Drop your shoulders. Unclench your hands. Repeat every hour.", ["anxious", "angry", "overwhelmed"]),
  mk("advice", "Put on the same song three times. Let your body catch up.", ["low", "numb", "energized"]),
  mk("advice", "Say 'no' to one small thing today. Practice for the bigger ones.", ["overwhelmed", "tired"]),
  mk("advice", "Praise yourself out loud for something tiny. It feels weird. Do it anyway.", ["low", "numb"]),
  mk("advice", "Give yourself the same voice you'd use with a scared kid. That's the voice.", ["anxious", "guilty", "low"]),
  mk("advice", "Don't clean up before you rest. Rest first. Clean if you feel like it.", ["tired", "overwhelmed"]),
  mk("advice", "Your body has been at DEFCON all day. It's allowed to take a while to come down.", ["anxious", "overwhelmed", "tired"]),

  // ---------- MICRO-ACTIONS ----------
  mk("action", "Take five slow breaths. Longer out than in.", ["anxious", "overwhelmed", "angry"], "Start breathing"),
  mk("action", "Ninety seconds of quiet. Nothing else on the plate.", ["tired", "overwhelmed", "anxious"], "Start 90-second reset"),
  mk("action", "Two-minute reset. Lie down or lean against something.", ["tired", "overwhelmed"], "Start 2-minute timer"),
  mk("action", "Five minutes of nothing. Set the timer, mean it.", ["tired", "overwhelmed", "low"], "Start 5-minute timer"),
  mk("action", "Ten quiet minutes. Somewhere in another room.", ["tired", "overwhelmed"], "Start 10-minute timer"),
  mk("action", "Name what you're feeling. Not the story around it — just the word.", ["angry", "anxious", "guilty", "numb", "low"], "Name it"),
  mk("action", "Try the 5-4-3-2-1 grounding walk.", ["anxious", "overwhelmed", "numb"], "Ground me"),
  mk("action", "Quick body scan — head to toes, one minute.", ["tired", "anxious", "numb"], "Start body scan"),
  mk("action", "Write one sentence in your journal. That's the whole thing.", ["low", "neutral", "content", "grateful"], "Get a prompt"),
  mk("action", "Write yourself a permission slip.", ["overwhelmed", "guilty", "tired"], "Give permission"),
  mk("action", "Name one tiny win from today.", ["low", "numb", "neutral", "grateful"], "Log a tiny win"),
  mk("action", "One thing you're grateful for. First one that comes.", ["grateful", "content", "neutral", "low"], "Gratitude prompt"),
  mk("action", "Ask yourself: what do I actually need right now?", ["numb", "overwhelmed", "tired", "low"], "Help me decide"),
  mk("action", "One minute of loosening — jaw, shoulders, hands.", ["anxious", "angry", "overwhelmed"], "Guide me"),
  mk("action", "Send a two-sentence text to a person who is safe for you.", ["lonely", "low"]),

  // ---------- ONELINERS ----------
  mk("oneliner", "You're not late. You're a person.", ["overwhelmed", "guilty", "tired"]),
  mk("oneliner", "Even five deep breaths count.", ["anxious", "overwhelmed"]),
  mk("oneliner", "You are the safe place. Even now.", ["tired", "guilty", "content"]),
  mk("oneliner", "This too, is parenting.", ["tired", "overwhelmed", "guilty"]),
  mk("oneliner", "You're doing better than the voice in your head says.", ["low", "guilty", "anxious"]),
  mk("oneliner", "You don't have to be fixed to be worthy.", ["low", "guilty", "lonely"]),
  mk("oneliner", "Softness first. Everything else later.", ["overwhelmed", "tired"]),
  mk("oneliner", "It's fine to be a person who needs help.", ["overwhelmed", "lonely", "low"]),
  mk("oneliner", "Nothing has to be figured out in the next hour.", ["anxious", "overwhelmed"]),
  mk("oneliner", "You are allowed to be tired without a reason.", ["tired", "low", "numb"]),
  mk("oneliner", "The house can be messy. You are still whole.", ["overwhelmed", "guilty"]),
  mk("oneliner", "Being seen is a form of rest.", ["lonely", "low", "grateful"]),
  mk("oneliner", "Your good enough is really good.", ["guilty", "tired", "neutral"]),
  mk("oneliner", "Not every hard thing needs to become a lesson.", ["low", "angry", "tired"]),
  mk("oneliner", "You already are the parent you were looking for.", ["guilty", "lonely", "low"]),
  mk("oneliner", "Feeling it is doing something.", ["numb", "low", "angry"]),
  mk("oneliner", "You are allowed to close the loop tomorrow.", ["overwhelmed", "tired", "anxious"]),
  mk("oneliner", "Being a soft place doesn't mean being an empty place.", ["tired", "lonely", "overwhelmed"]),
  mk("oneliner", "One kind thing to yourself is enough for today.", ["low", "tired", "guilty"]),
  mk("oneliner", "You are the best expert on your own tired.", ["tired", "overwhelmed"]),
  mk("oneliner", "You're allowed to be picky about what you carry.", ["overwhelmed", "angry", "tired"]),
  mk("oneliner", "The days that count are almost never the ones that feel like they count.", ["neutral", "content", "grateful"]),
  mk("oneliner", "You are not the only one. You just feel like it right now.", ["lonely", "low"]),
  mk("oneliner", "Being kind to yourself is not a detour.", ["guilty", "low", "tired"]),
  mk("oneliner", "You get to be tired and hopeful at the same time.", ["tired", "content", "grateful"]),
  mk("oneliner", "You are not doing it wrong. You're doing it hard.", ["overwhelmed", "guilty"]),

  // ---------- PERMISSION ----------
  mk("permission", "You have permission to be a B+ parent today.", ["tired", "guilty", "overwhelmed"]),
  mk("permission", "You have permission to leave the dishes.", ["tired", "overwhelmed"]),
  mk("permission", "You have permission to say 'not now.'", ["overwhelmed", "anxious"]),
  mk("permission", "You have permission to want something for yourself.", ["lonely", "low", "numb"]),
  mk("permission", "You have permission to cry without a plan.", ["low", "angry", "overwhelmed"]),
  mk("permission", "You have permission to skip the shower thoughts and just take the shower.", ["anxious", "overwhelmed"]),
  mk("permission", "You have permission to phone-it-in on one meal today.", ["tired", "overwhelmed"]),
  mk("permission", "You have permission to be less available.", ["overwhelmed", "tired"]),
  mk("permission", "You have permission to not enjoy every stage.", ["guilty", "tired"]),
  mk("permission", "You have permission to be soft with yourself, out loud.", ["low", "guilty", "lonely"]),
  mk("permission", "You have permission to take the easier route.", ["tired", "overwhelmed"]),
  mk("permission", "You have permission to not know yet.", ["anxious", "overwhelmed"]),
  mk("permission", "You have permission to stop performing.", ["tired", "lonely", "numb"]),
  mk("permission", "You have permission to have needs that inconvenience someone else.", ["lonely", "overwhelmed"]),

  // ---------- GRATITUDE PROMPTS ----------
  mk("gratitude", "One tiny thing today that didn't go wrong?", ["grateful", "content", "neutral", "low"]),
  mk("gratitude", "One person you're glad exists?", ["grateful", "lonely", "content"]),
  mk("gratitude", "One small comfort within reach right now?", ["grateful", "tired", "content"]),
  mk("gratitude", "One thing your body did for you today, no thanks required?", ["grateful", "content", "tired"]),
  mk("gratitude", "One tiny moment of your kid that made you smile this week?", ["grateful", "content"]),
  mk("gratitude", "One thing you'd tell past-you they eventually got right?", ["grateful", "content", "neutral"]),

  // ---------- KINDNESS (surprise extra-kindness cards) ----------
  mk("kindness", "You showed up today. That's a lot in a world that's often loud and fast.", ["tired", "low", "lonely", "overwhelmed"]),
  mk("kindness", "Someone, somewhere, feels safer because you exist.", ["low", "lonely", "numb"]),
  mk("kindness", "You are not the sum of what you got done today.", ["tired", "guilty", "overwhelmed"]),
  mk("kindness", "If no one has told you this today: you are doing enough.", ["tired", "guilty", "lonely", "low"]),
  mk("kindness", "The way you love your kid — quiet, stubborn, tired — is the good kind.", ["grateful", "tired", "guilty"]),
  mk("kindness", "You are allowed to take up space in your own life.", ["lonely", "numb", "low"]),
  mk("kindness", "The world is easier because you are gentle in it.", ["tired", "content", "grateful"]),
  mk("kindness", "You have already survived every worst day so far.", ["low", "anxious", "overwhelmed"]),
  mk("kindness", "You don't have to be exceptional to be worth loving.", ["low", "lonely", "guilty"]),
  mk("kindness", "You are the one your kid pictures when they picture 'safe.' That's not nothing.", ["tired", "guilty", "lonely"]),

  // ---------- MOTHERHOOD: the invisible load ----------
  mk("permission", "I can be a good mother and still need a minute.", ["guilty", "overwhelmed", "tired"]),
  mk("permission", "My nervous system matters too.", ["anxious", "overwhelmed", "tired"]),
  mk("permission", "This feeling doesn't make me a bad mom.", ["guilty", "angry", "low"]),
  mk("permission", "I don't have to earn rest.", ["tired", "guilty", "overwhelmed"]),
  mk("permission", "I'm allowed to be interrupted and still come back to myself.", ["overwhelmed", "numb"]),
  mk("permission", "I can love this life and still miss the person I was in it.", ["lonely", "low", "numb"]),
  mk("reflection", "The load nobody sees is still a load. Appointments, textures, who needs what at 4pm — that's work.", ["tired", "overwhelmed"]),
  mk("reflection", "You are the one holding the whole map in your head. Of course you're tired by evening.", ["tired", "overwhelmed", "numb"]),
  mk("reflection", "Some of what's in your head right now isn't yours to carry tonight. You're allowed to set it down without solving it.", ["overwhelmed", "anxious", "guilty"]),
  mk("reflection", "Motherhood changed who you are. Grieving part of that isn't ingratitude.", ["lonely", "low", "numb", "guilty"]),
  mk("reflection", "You get interrupted mid-sentence, mid-thought, mid-need. That's not a focus problem. That's the job.", ["overwhelmed", "anxious", "angry"]),
  mk("reflection", "Being the calm one all day doesn't mean you were calm. It means you did it anyway.", ["tired", "angry", "numb"]),
  mk("reflection", "You are still a person underneath the roles. She didn't leave. She's just been busy.", ["lonely", "numb", "low"]),
  mk("oneliner", "You showed up for yourself for 90 seconds. That's not nothing.", ["tired", "low", "neutral", "content"]),
  mk("oneliner", "The mother is also someone's whole person.", ["lonely", "numb", "low"]),
  mk("oneliner", "Nobody claps for the invisible parts. They still count.", ["tired", "guilty", "lonely"]),
  mk("advice", "Name three things living in your head that aren't yours to carry right now. Don't solve them. Just name them.", ["overwhelmed", "anxious", "tired"], "Mental-load dump"),
  mk("advice", "Ask where the tired is living in your body today — jaw, shoulders, lower back, hands.", ["tired", "numb", "overwhelmed"], "Body check"),
  mk("advice", "Pick one small thing in the next hour that's just for you. Thirty seconds of silence counts.", ["tired", "lonely", "low"], "Tiny reclamation"),
  mk("advice", "The bathroom, the car, the kitchen sink — a reset doesn't need a nice room.", ["overwhelmed", "tired"]),
  mk("advice", "If a child is nearby, do it anyway. Quiet and one long exhale is enough.", ["anxious", "overwhelmed"]),
  mk("action", "One long exhale. The 20-second reset between demands.", ["anxious", "overwhelmed", "angry", "tired"], "One-breath reset"),
  mk("action", "Ground with what's actually around you: five things in this room…", ["anxious", "overwhelmed", "numb"], "Ground me at home"),
  mk("action", "Carry one calm word with you for the rest of today.", ["neutral", "content", "tired", "grateful"], "Carry one word"),
  mk("kindness", "You have been someone's whole world today. You're allowed to be your own for a minute.", ["tired", "lonely", "guilty"]),
  mk("kindness", "Nobody handed you a manual for this kid. You've been writing it as you go.", ["guilty", "tired", "overwhelmed"]),
];


// ---- Selection helpers ----

// Priority moods per mood — softer nets so items with overlapping tags still pull.
function scoreFor(item: Item, mood: Mood, energy: Energy): number {
  let s = item.moods.includes(mood) ? 3 : 0;
  // energy softly biases what we surface
  if (energy === "empty" || energy === "low") {
    if (item.kind === "affirmation" || item.kind === "kindness" || item.kind === "permission") s += 1;
    if (item.kind === "advice" || item.kind === "action") s += 0.5;
  } else {
    if (item.kind === "action" || item.kind === "advice") s += 1;
  }
  return s;
}

// Seedable RNG for deterministic-per-day rotation option.
function rng(seed: number) {
  let s = seed || 1;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

export function pickForYou(
  mood: Mood,
  energy: Energy,
  opts?: { seed?: number; exclude?: string[] }
): { cards: Item[]; toolAction: Item | null } {
  const exclude = new Set(opts?.exclude ?? []);
  const rand = rng(opts?.seed ?? Math.floor(Math.random() * 1e9));
  const scored = ITEMS
    .filter((i) => !exclude.has(i.id))
    .map((i) => ({ i, s: scoreFor(i, mood, energy) + rand() * 0.6 }))
    .sort((a, b) => b.s - a.s);

  // pick 1-2 non-action cards (varied kinds) and 1 action tool
  const nonAction = scored.filter((x) => x.i.kind !== "action");
  const actions = scored.filter((x) => x.i.kind === "action");

  const pickedCards: Item[] = [];
  const usedKinds = new Set<ItemKind>();
  for (const { i } of nonAction) {
    if (pickedCards.length >= 2) break;
    if (usedKinds.has(i.kind)) continue;
    pickedCards.push(i);
    usedKinds.add(i.kind);
  }

  // 15% chance to include an "extra kindness" swap-in if not already picked
  if (rand() < 0.15) {
    const kindness = ITEMS.filter((i) => i.kind === "kindness");
    const pick = kindness[Math.floor(rand() * kindness.length)];
    if (pick && !pickedCards.find((p) => p.id === pick.id)) {
      pickedCards[pickedCards.length - 1] = pick;
    }
  }

  return {
    cards: pickedCards,
    toolAction: actions[0]?.i ?? null,
  };
}

export function itemsForMood(mood: Mood): Item[] {
  return ITEMS.filter((i) => i.moods.includes(mood));
}

// Journal prompts (one-sentence).
export const JOURNAL_PROMPTS = [
  "One word for how today felt in my body:",
  "The moment I was proudest of myself today was…",
  "The thing I want to put down before bed is…",
  "If I could give past-me one sentence of relief, it would be…",
  "The smallest kind thing I noticed today was…",
  "What am I ready to stop apologizing for?",
  "What would 'enough' look like for the next hour?",
  "One thing I did today that no one saw:",
  "What am I carrying that isn't mine?",
  "If today had a color, it would be…",
  "One thing my body is asking for:",
  "A person I want to thank silently right now:",
  "Something I did today that took courage nobody noticed:",
  "What would today feel like if I forgave myself right now?",
  "The version of me I miss is…",
  "One thing I want tomorrow to be a little softer than today:",
  "What's a kind sentence I could say to myself, and mean?",
  "Where in my body am I holding today?",
  "What did I not say out loud today that I wish I had?",
  "What would rest look like if it wasn't a reward?",
];

export const PERMISSION_TEMPLATES = [
  "I give myself permission to do less today.",
  "I give myself permission to be soft with myself.",
  "I give myself permission to say no without a reason.",
  "I give myself permission to leave it undone.",
  "I give myself permission to need what I need.",
  "I give myself permission to change my mind.",
  "I give myself permission to rest before I 'deserve' it.",
  "I give myself permission to take up space.",
  "I give myself permission to not be inspiring today.",
  "I give myself permission to be the one who gets cared for.",
  "I give myself permission to be a person, not a plan.",
  "I give myself permission to protect my quiet.",
];

export const NEEDS = [
  { key: "water", label: "Water", why: "Half a glass. Right now, before you decide anything else." },
  { key: "food", label: "Food", why: "Not a whole meal. A handful of something with protein or fat." },
  { key: "rest", label: "Rest", why: "Even six minutes horizontal counts. Eyes closed if you can." },
  { key: "movement", label: "Movement", why: "Two minutes of literally any motion. Shake, stretch, stairs." },
  { key: "connection", label: "Connection", why: "Two-sentence text to someone safe. That's the whole ask." },
  { key: "alone", label: "Alone time", why: "Any door with a lock. Any bathroom. Any parked car. Five minutes." },
  { key: "air", label: "Fresh air", why: "Open a window. Or step outside for one full slow breath." },
  { key: "quiet", label: "Quiet", why: "Turn one thing off. Screen, light, or voice. Yours counts." },
] as const;

export type NeedKey = (typeof NEEDS)[number]["key"];

// Explore categories used by /explore.
export const CATEGORIES: { key: string; label: string; moods: Mood[] }[] = [
  { key: "tired", label: "Feeling tired", moods: ["tired"] },
  { key: "overwhelmed", label: "Overwhelmed", moods: ["overwhelmed", "anxious"] },
  { key: "reset", label: "Need a reset", moods: ["overwhelmed", "anxious", "angry"] },
  { key: "kindness", label: "Need kindness", moods: ["low", "guilty", "lonely"] },
  { key: "energy", label: "Need energy", moods: ["numb", "low", "tired"] },
  { key: "grateful", label: "Feeling grateful", moods: ["grateful", "content"] },
  { key: "angry", label: "Angry", moods: ["angry"] },
  { key: "guilty", label: "Guilt spiral", moods: ["guilty"] },
  { key: "lonely", label: "Lonely", moods: ["lonely"] },
];

// Tiny wins storage (client-only).
const WINS_KEY = "evenme:wins";
export type Win = { date: string; text: string };
const isBrowser = () => typeof window !== "undefined";
export function getWins(): Win[] {
  if (!isBrowser()) return [];
  try {
    return JSON.parse(window.localStorage.getItem(WINS_KEY) ?? "[]") as Win[];
  } catch {
    return [];
  }
}
export function addWin(text: string) {
  if (!isBrowser()) return;
  const list = getWins();
  const d = new Date();
  const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  list.push({ date: iso, text });
  window.localStorage.setItem(WINS_KEY, JSON.stringify(list.slice(-100)));
}
