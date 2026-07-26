## Goal

1. Require the user's email before they can see any "For You" advice or open any tool — even during the free trial.
2. Replace the 3‑day free trial with a **1 free tip/tool** trial: after the first personalized result is shown, the next check‑in routes to the paywall (unless subscribed).

Nothing else changes — same warm branding, check‑in flow, crisis link, and content library.

## Changes

### 1. Email gate before results (`src/routes/checkin.tsx`)
- Add an email field to the check‑in flow as a new final step **before** navigating to `/foryou`. If `evenme:email` is already stored, skip this step automatically.
- Simple validation: trimmed, contains `@`, saved to `store.set(KEYS.email, …)`.
- Copy: "Your email — so we can remember you and send your welcome note." Keep tone warm, minimal.
- Only after email is captured does it call `addMoodCheckin(...)` + navigate to `/foryou`.
- Also guard `/foryou` directly (`src/routes/foryou.tsx`): if no stored email on mount, redirect back to `/checkin` (defensive — handles direct URL hits).

### 2. Trial = 1 free tip/tool (`src/lib/evenme.ts`)
- Remove day‑based trial. Replace with a "free uses remaining" counter:
  - New key `evenme:freeUsesLeft` (default `1`).
  - New helpers: `freeUsesLeft()`, `consumeFreeUse()`, and update `hasAccess()` → `isSubscribed() || freeUsesLeft() > 0`.
  - Keep `TRIAL_DAYS`/`trialDaysLeft` exports as thin shims (return based on `freeUsesLeft`) so existing imports keep compiling, or update call sites — see below.
- Update call sites:
  - `src/routes/checkin.tsx`: replace `trialDaysLeft()` UI ("N free days left") with "1 free tip left" / hide when 0. Access check uses `hasAccess()`.
  - `src/routes/foryou.tsx`: on first successful render of a picked result, call `consumeFreeUse()` (guarded so it decrements once per visit, not per "Give me another"). After consumption, if user is not subscribed and returns to `/checkin`, they'll be routed to `/paywall`.
  - `src/routes/index.tsx` onboarding: change "3 free days" copy to "1 free tip, then $12/week or $79/year".
  - `src/routes/settings.tsx`: adjust any "days left" copy to reflect the new model.
- Server subscription check (`checkSubscription`) is unchanged — subscribers still bypass the gate.

### 3. Paywall alignment (`src/routes/paywall.tsx`)
- Email input already exists there; no logic change needed. Update the sub‑headline copy from "Your free days are done." to "Your free tip is used. Pick what works." for consistency.

## Flow after changes

```text
Onboarding → Check‑in (mood → energy → word → email*) → /foryou (tip + tool)
                                                       └─ consumes the 1 free use
Next visit to /checkin (not subscribed) → /paywall
```
*email step skipped if already saved.

## Out of scope
- No changes to Stripe products, webhook, welcome email, or DB schema.
- No changes to the content library or tool components.
