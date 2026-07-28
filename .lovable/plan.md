## Change weekly price to $4.99

Update the weekly subscription price from $12/week to $4.99/week. Yearly ($79) stays as-is.

### Steps

1. Call `create_price` with the existing price ID `even_me_weekly` and amount `499` (USD, recurring monthly=week). This replaces the old amount while keeping the lookup key stable, so existing checkout code keeps working with no code changes required.
2. Update user-facing copy that hardcodes "$12/week":
   - `src/routes/paywall.tsx`
   - `src/routes/settings.tsx`
   - `src/routes/index.tsx` (if referenced in onboarding)
   - any other route mentioning the weekly price

Existing subscribers on the old price are unaffected; only new checkouts use $4.99.