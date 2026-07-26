## Diagnosis

The "Something went wrong" screen inside the embedded Stripe iframe is Stripe's generic client-side error, thrown after `checkout.sessions.create` succeeded but the session itself is misconfigured. The most likely trigger is `automatic_tax: { enabled: true }` in `src/utils/payments.functions.ts` — Stripe Tax requires:

- a registered origin address on the Stripe account, and
- a `tax_code` on every Product being sold.

Neither was set up for `even_me` / `even_me_weekly` / `even_me_annual`, so Stripe fails the session at render time inside the iframe. Annual "worked" before only up to Continue; once Continue actually rendered the form, both plans hit the same wall.

## Steps

1. Remove `automatic_tax: { enabled: true }` from the session creation in `src/utils/payments.functions.ts`. Ship a working checkout first; tax automation can be re-added later with proper setup.
2. Leave everything else (customer resolve, metadata, subscription_data) untouched.
3. Re-test both Weekly and Annual Continue flows in preview.

## Follow-up (not this turn)

If the user later wants tax handling:
- Add `tax_code: "txcd_10103001"` (SaaS) to `even_me` via a product update.
- Have the user set an origin address on the Stripe account.
- Re-enable `automatic_tax`.