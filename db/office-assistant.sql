-- Isolated DG97 chat ledger. Apply once to the dedicated DG97 database.
-- Stores only a salted visitor hash, timestamps and cost; never chat messages.
CREATE TABLE IF NOT EXISTS public.dg97_assistant_months (
  month text PRIMARY KEY CHECK (month ~ '^\d{4}-\d{2}$'),
  reserved_micro_usd bigint NOT NULL DEFAULT 0 CHECK (reserved_micro_usd BETWEEN 0 AND 5000000)
);

CREATE TABLE IF NOT EXISTS public.dg97_assistant_requests (
  id uuid PRIMARY KEY,
  month text NOT NULL REFERENCES public.dg97_assistant_months(month),
  visitor_hash text NOT NULL CHECK (visitor_hash ~ '^[a-f0-9]{64}$'),
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  reserved_micro_usd integer NOT NULL CHECK (reserved_micro_usd = 7040),
  actual_micro_usd integer CHECK (actual_micro_usd BETWEEN 0 AND reserved_micro_usd),
  completed_at timestamptz
);
CREATE INDEX IF NOT EXISTS dg97_assistant_visitor_recent
  ON public.dg97_assistant_requests(visitor_hash, created_at DESC);

-- The monthly row lock makes this cap global across concurrent Vercel instances.
-- Uncertain/failed calls keep their entire reservation. No automatic retries.
CREATE OR REPLACE FUNCTION public.dg97_assistant_reserve(request_id uuid, visitor text)
RETURNS text LANGUAGE plpgsql AS $$
DECLARE
  current_month text := to_char(CURRENT_TIMESTAMP AT TIME ZONE 'Europe/Stockholm', 'YYYY-MM');
  monthly_total bigint;
BEGIN
  IF visitor !~ '^[a-f0-9]{64}$' THEN RAISE EXCEPTION 'Invalid visitor hash'; END IF;
  INSERT INTO public.dg97_assistant_months(month) VALUES(current_month) ON CONFLICT DO NOTHING;
  SELECT reserved_micro_usd INTO monthly_total FROM public.dg97_assistant_months
    WHERE month = current_month FOR UPDATE;
  IF EXISTS(SELECT 1 FROM public.dg97_assistant_requests WHERE id = request_id) THEN RETURN 'duplicate'; END IF;
  IF (SELECT count(*) FROM public.dg97_assistant_requests
      WHERE visitor_hash = visitor AND created_at > CURRENT_TIMESTAMP - INTERVAL '24 hours') >= 24
    THEN RETURN 'rate_limit'; END IF;
  IF monthly_total + 7040 > 5000000 THEN RETURN 'budget_limit'; END IF;
  INSERT INTO public.dg97_assistant_requests(id, month, visitor_hash, reserved_micro_usd)
    VALUES(request_id, current_month, visitor, 7040);
  UPDATE public.dg97_assistant_months SET reserved_micro_usd = reserved_micro_usd + 7040
    WHERE month = current_month;
  RETURN 'accepted';
END $$;

-- Server-only ledger: no anonymous/Data API access if those are enabled later.
ALTER TABLE public.dg97_assistant_months ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dg97_assistant_requests ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.dg97_assistant_months FROM PUBLIC;
REVOKE ALL ON public.dg97_assistant_requests FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.dg97_assistant_reserve(uuid, text) FROM PUBLIC;

-- Refund only after exact provider usage is known; an id is settled once.
CREATE OR REPLACE FUNCTION public.dg97_assistant_settle(request_id uuid, actual integer)
RETURNS boolean LANGUAGE plpgsql AS $$
DECLARE
  request_month text;
  request_row public.dg97_assistant_requests%ROWTYPE;
BEGIN
  SELECT month INTO request_month FROM public.dg97_assistant_requests WHERE id = request_id;
  IF request_month IS NULL THEN RETURN false; END IF;
  PERFORM 1 FROM public.dg97_assistant_months WHERE month = request_month FOR UPDATE;
  SELECT * INTO request_row FROM public.dg97_assistant_requests WHERE id = request_id FOR UPDATE;
  IF request_row.completed_at IS NOT NULL THEN RETURN false; END IF;
  IF actual IS NULL OR actual < 0 OR actual > request_row.reserved_micro_usd
    THEN RAISE EXCEPTION 'Invalid usage'; END IF;
  UPDATE public.dg97_assistant_requests SET actual_micro_usd = actual, completed_at = CURRENT_TIMESTAMP
    WHERE id = request_id;
  UPDATE public.dg97_assistant_months
    SET reserved_micro_usd = reserved_micro_usd - (request_row.reserved_micro_usd - actual)
    WHERE month = request_month;
  RETURN true;
END $$;
REVOKE EXECUTE ON FUNCTION public.dg97_assistant_settle(uuid, integer) FROM PUBLIC;
