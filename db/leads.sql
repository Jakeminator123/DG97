-- Lead capture for dg97.org. Applied to the existing Vercel Marketplace Neon
-- database (project dg97-members) that already stores the office-assistant ledger.
CREATE TABLE IF NOT EXISTS public.leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  name text NOT NULL CHECK (char_length(name) BETWEEN 1 AND 100),
  company text CHECK (company IS NULL OR char_length(company) <= 120),
  email text NOT NULL CHECK (char_length(email) BETWEEN 3 AND 254),
  phone text CHECK (phone IS NULL OR char_length(phone) <= 50),
  size_need text CHECK (size_need IS NULL OR size_need IN ('1-2', '3-4', '5-6', 'osaker')),
  start_date text CHECK (start_date IS NULL OR char_length(start_date) <= 40),
  message text NOT NULL CHECK (char_length(message) BETWEEN 1 AND 5000),
  ip_hash text CHECK (ip_hash IS NULL OR ip_hash ~ '^[a-f0-9]{64}$'),
  user_agent text CHECK (user_agent IS NULL OR char_length(user_agent) <= 300)
);

CREATE INDEX IF NOT EXISTS leads_created_at_idx ON public.leads (created_at DESC);
CREATE INDEX IF NOT EXISTS leads_ip_recent_idx ON public.leads (ip_hash, created_at DESC);

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.leads FROM PUBLIC;
