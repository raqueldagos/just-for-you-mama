create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  stripe_subscription_id text not null unique,
  stripe_customer_id text not null,
  price_id text not null,
  status text not null default 'active',
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean default false,
  environment text not null default 'sandbox',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_subscriptions_email on public.subscriptions (lower(email));
create index idx_subscriptions_stripe_id on public.subscriptions (stripe_subscription_id);

grant all on public.subscriptions to service_role;

alter table public.subscriptions enable row level security;

create policy "Service role manages subscriptions"
  on public.subscriptions for all
  to service_role
  using (true) with check (true);