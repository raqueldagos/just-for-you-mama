
CREATE TABLE public.leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  name text,
  first_seen_at timestamptz NOT NULL DEFAULT now(),
  last_seen_at timestamptz NOT NULL DEFAULT now(),
  check_in_count integer NOT NULL DEFAULT 0,
  subscribed boolean NOT NULL DEFAULT false,
  source text NOT NULL DEFAULT 'checkin',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_leads_email ON public.leads(email);

GRANT ALL ON public.leads TO service_role;

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role manages leads"
  ON public.leads FOR ALL
  TO service_role
  USING (true) WITH CHECK (true);
