
## Why nothing shows up

Right now, when a visitor types their email during the check-in flow, it's only saved in **their browser's localStorage** — it never leaves their device. The only emails that reach your backend are from people who actually complete a Stripe subscription (stored in the `subscriptions` table). That's why you see nothing when testing before subscribing.

To capture every email (free-trial visitors included), we need to send it to the backend and store it in a new table you can query.

## Plan

### 1. New `leads` table (Lovable Cloud)
A migration to create `public.leads`:
- `id` (uuid, pk)
- `email` (text, unique, lowercased)
- `name` (text, nullable)
- `first_seen_at`, `last_seen_at` (timestamps)
- `check_in_count` (int, default 0)
- `subscribed` (boolean, default false — flipped true by the Stripe webhook)
- `source` (text, e.g. `checkin`)

Grants + RLS:
- `GRANT` to `service_role` only. No `anon` / `authenticated` SELECT — this table is admin-only.
- RLS enabled with no public policies (writes happen via a server function using the admin client).

### 2. New server function `captureLead` (`src/utils/leads.functions.ts`)
- Public (no auth middleware — visitors aren't signed in).
- Input: `{ email, name? }`, validated with Zod (email format, length limits).
- Uses `supabaseAdmin` loaded inside the handler to upsert by lowercased email, bump `last_seen_at` and increment `check_in_count`.
- Returns `{ ok: true }`; errors are swallowed to `{ ok: false }` so a backend hiccup never blocks the check-in UX.

### 3. Call it from the check-in email step
In `src/routes/checkin.tsx`, when the visitor submits the mandatory email step (and also on subsequent check-ins if we already have their email in localStorage), fire `captureLead({ email, name })` in the background. UI stays instant; no await gating.

### 4. Mark leads as subscribed from the Stripe webhook
In `src/routes/api/public/payments/webhook.ts`, on `customer.subscription.created`, also upsert the email into `leads` with `subscribed = true` so your leads table stays the single source of truth for "who ever gave us an email."

### 5. How you'll see the emails
Two options — I'd suggest both:
- **Immediately:** you'll be able to view rows via the backend (Cloud → Tables → `leads`). I'll confirm the table is visible after the migration runs.
- **Optional next step (not in this plan unless you want it):** a simple in-app `/admin/leads` page gated to your email that lists recent leads. Say the word and I'll add it.

## Technical notes
- Email is normalized to lowercase + trimmed before upsert to avoid duplicates.
- The capture call is fire-and-forget on the client so a slow/failed backend never breaks the check-in.
- No changes to trial logic, paywall, styling, or existing tables — purely additive.
