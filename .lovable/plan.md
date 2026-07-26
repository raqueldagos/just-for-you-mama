## Problems

1. **Paywall only blocks `/checkin`.** `/foryou`, `/explore`, `/explore/$cat`, and `/tool/$key` have no gate, so a user with 0 free uses left and no subscription can still browse advice and open every tool.
2. **`/foryou` "Give me another" is unlimited.** The free-use counter decrements once per visit, but the same visit can reshuffle forever. That's what lets someone "ask infinite advices without hitting a paywall".
3. **Clicks on feelings in `/explore` appear to do nothing** for a non-subscribed, out-of-free-uses user — related to (1): the destination should send them somewhere (paywall), not silently render an empty-ish list.

## Fix

### 1. Central access gate (`src/lib/evenme.ts`)
Already exposes `hasAccess()` (subscribed OR `freeUsesLeft() > 0`). Keep as-is. Add a small `useAccessGuard()` hook (new file `src/hooks/useAccessGuard.ts`) that:
- On mount, reads `hasAccess()`; if false, `navigate({ to: "/paywall" })` and returns `false`.
- Otherwise returns `true`.

### 2. Gate every content route
Apply `useAccessGuard()` at the top of these components and render `null` when it returns false:
- `src/routes/foryou.tsx` — replace the ad-hoc email/consume `useEffect` with: guard → require email (redirect to `/checkin`) → consume one free use for non-subscribers.
- `src/routes/explore.tsx`
- `src/routes/explore.$cat.tsx`
- `src/routes/tool.$key.tsx`

This makes "click a feeling on Explore" resolve to a real destination (paywall) once the free tip is used, instead of appearing to do nothing.

### 3. Make "Give me another" respect the paywall (`src/routes/foryou.tsx`)
Change so 1 free use = 1 tip shown, not 1 visit:
- Consume a free use on **every** shuffle for non-subscribers, including the initial render (guarded so it decrements exactly once per rendered tip).
- After consuming, if `hasAccess()` is now false, disable / hide the "Give me another" button and show a small "Your free tip is used — subscribe to keep going" note with a Continue → `/paywall` button.
- Subscribers: unchanged, unlimited reshuffles.

### 4. Also gate tool-launch inside `/foryou`
When user clicks the tool CTA on the personalized card and they have no access, route to `/paywall` instead of opening the tool.

## Out of scope
- No changes to Stripe products, webhook, welcome email, DB, or content library.
- No changes to onboarding, check-in flow, or `/paywall` UI.
- Subscribed users keep full unlimited access everywhere.

## Verification
After changes, in a fresh browser: complete check-in once → see 1 tip on `/foryou` → "Give me another" is disabled → clicking any Explore feeling or Tool routes to `/paywall`. With `evenme:subscribed=true` in localStorage, everything stays open.
