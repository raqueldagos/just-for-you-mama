## Diagnosis (unconfirmed)

Annual checkout works but Weekly's Continue fails. Same `createCheckoutSession` server fn is used for both — the only difference is the priceId (`even_me_weekly` vs `even_me_annual`). The most likely cause is that `even_me_weekly` doesn't exist in Stripe as a `lookup_key`, so `stripe.prices.list({ lookup_keys: ["even_me_weekly"] })` returns empty and the handler throws "Price not found". Needs to be verified against Stripe before fixing.

A secondary possibility: the frontend swallows the error message from the server function and shows nothing on mobile, making the failure look silent.

## Steps

1. **Verify in Stripe (test env)** which of `even_me_weekly` / `even_me_annual` currently exist as lookup keys via a quick server-fn invocation. This confirms whether the price is missing or the error is elsewhere.
2. **If the weekly price is missing** — recreate it via `payments--create_price` on the existing `even_me` product with:
   - `id: even_me_weekly`, `amount: 1200`, `currency: usd`, `recurring_interval: week`, `quantity_min/max: 1`.
3. **Surface the checkout error to the user** in `src/routes/paywall.tsx`: wrap `fetchClientSecret` so a thrown error (from `createCheckoutSession` returning `{ error }`) sets the `error` state and closes the embedded checkout instead of leaving a blank iframe on mobile.
4. Re-test both Continue buttons in preview after the deploy propagates.

## Technical notes

- `createCheckoutSession` already returns `{ error }` on failure; `paywall.tsx` throws inside `fetchClientSecret` but Stripe's `EmbeddedCheckoutProvider` shows nothing when `fetchClientSecret` rejects — hence "nothing happens" on mobile.
- No changes needed to server fn logic itself; the earlier module-scope helper fix stays.