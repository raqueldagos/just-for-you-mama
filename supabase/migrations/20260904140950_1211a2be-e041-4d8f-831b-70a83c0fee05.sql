CREATE TABLE public.profiles (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email text UNIQUE,
  display_name text,
  reminder_enabled boolean NOT NULL DEFAULT false,
  reminder_label text NOT NULL DEFAULT 'after the house is quiet',
  plant_stage integer NOT NULL DEFAULT 0,
  minutes_kept integer NOT NULL DEFAULT 0,
  checkins_count integer NOT NULL DEFAULT 0,
  last_checkin_at timestamptz,
  onboarding_done boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role manages profiles" ON public.profiles FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE TABLE public.checkins (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  email text,
  prompt_key text,
  feeling_key text NOT NULL,
  optional_note text,
  slip_id text,
  quest_done boolean NOT NULL DEFAULT false,
  quest_key text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX checkins_feeling_created_idx ON public.checkins (feeling_key, created_at DESC);
CREATE INDEX checkins_email_idx ON public.checkins (email);
GRANT ALL ON public.checkins TO service_role;
ALTER TABLE public.checkins ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role manages checkins" ON public.checkins FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE TABLE public.slips_unlocked (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL,
  slip_id text NOT NULL,
  unlocked_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (email, slip_id)
);
GRANT ALL ON public.slips_unlocked TO service_role;
ALTER TABLE public.slips_unlocked ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role manages slips" ON public.slips_unlocked FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE TABLE public.feeling_cheers (
  feeling_key text NOT NULL PRIMARY KEY,
  cheer_count integer NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.feeling_cheers TO service_role;
ALTER TABLE public.feeling_cheers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role manages cheers" ON public.feeling_cheers FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE OR REPLACE FUNCTION public.bump_cheer(_feeling_key text)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE v integer;
BEGIN
  INSERT INTO public.feeling_cheers (feeling_key, cheer_count)
  VALUES (_feeling_key, 1)
  ON CONFLICT (feeling_key) DO UPDATE SET cheer_count = public.feeling_cheers.cheer_count + 1, updated_at = now()
  RETURNING cheer_count INTO v;
  RETURN v;
END;
$$;