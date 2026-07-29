# Even Me — guided flow, matched tools, more tools

## 1. Show cards one at a time (`/foryou`)

Today `/foryou` renders 2 content cards plus a tool card stacked on one screen. Change it to a paced, single-card flow:

- Build a small "session" of 4–6 steps from the mood + energy pick: an opening line, an affirmation, a reflection or advice card, an optional permission/kindness card, then a recommended tool, then a closing card.
- One card fills the screen at a time, with a large "Next" button and a quiet step indicator (dots) plus a "Back" arrow. Fade transition, no scrolling required.
- The final step offers: open the recommended tool, "Give me another moment" (reshuffles a new session), or "That's enough for today".
- Free vs paid stays as-is: non-premium users get one session, then the paywall card. Subscribed/unlimited users can start new sessions freely.

## 2. Tools are recommended, not listed

- Tag every tool with the moods/energies it fits and a one-line "why this helps you right now" reason.
- In the session flow, the tool step shows only the 1 best-matching tool with its reason ("Your chest is tight and your energy is low — 90 seconds of slower breathing settles the alarm"), plus a small "show me a different one" that swaps to the next best match.
- `/explore` stops being a flat tool dump: the top becomes "Picked for how you felt today" (2–3 matched tools with reasons), and the full list moves below into a collapsed "All tools" section grouped by purpose (Calm down, Get unstuck, Feel less alone, Restore energy).
- Category pages (`/explore/$cat`) get the same treatment: matching tools with reasons appear above the advice cards.

## 3. New easy tools

Add simple, low-effort tools (each under 2 minutes, no typing required unless noted):

- Sigh reset — three physiological sighs (double inhale, long exhale), animated.
- Cold water / face splash — guided 45-second prompt with timer.
- Unclench — jaw, shoulders, hands release sequence.
- Hand on heart — 60 seconds of self-contact with a short script.
- Shake it out — 30-second timed shake, then stillness.
- One thing rule — pick the single next thing; everything else waits.
- Text a safe person — pre-written two-sentence message you can copy/share.
- Sound off — 60 seconds with one noise source turned off.
- Look far away — 20 seconds of distance gazing to unwind the eyes.
- Count backwards from 5 — a slow, boring countdown to interrupt a spiral.
- Warm drink — make one and hold it before drinking.
- Tomorrow's one kindness — pick one small thing to give yourself tomorrow.

## Technical notes

- `src/lib/foryou.ts`: add a `TOOL_MATCH` map (tool key → moods, energies, reason text, purpose group) and a `buildSession(mood, energy, seed, exclude)` helper returning an ordered step list; add a `recommendTools(mood, energy, n)` helper.
- `src/components/tools.tsx`: add the new tool components, extend `ToolKey`, `TOOL_META` (title, blurb, group), and `ToolRenderer`.
- `src/routes/foryou.tsx`: rewrite as a step-indexed flow (`step` state) with Next/Back, keeping the existing access/free-use logic and the crisis-resources link.
- `src/routes/explore.index.tsx` and `explore.$cat.tsx`: add the recommended-tools block, group the full list.
- `src/lib/i18n.tsx`: add Portuguese strings for all new tool titles, blurbs, reasons, and flow labels.
- Branding, colors, calm aesthetic, and the crisis link stay untouched.
