ALTER TABLE analytics.all_pageview_raw
  ADD COLUMN prev_pageview_pathname text GENERATED ALWAYS AS (properties->>'$prev_pageview_pathname') STORED,
  ADD COLUMN prev_pathname text GENERATED ALWAYS AS (properties->>'$prev_pathname') STORED,
  ADD COLUMN prev_url text GENERATED ALWAYS AS (properties->>'$prev_url') STORED,
  ADD COLUMN referring_domain text GENERATED ALWAYS AS (properties->>'$referring_domain') STORED,
  ADD COLUMN posthog_user text GENERATED ALWAYS AS (COALESCE(properties->>'user', properties->>'User')) STORED,
  ADD COLUMN est_connecte text GENERATED ALWAYS AS (properties->>'est_connecte') STORED,
  ADD COLUMN user_id text GENERATED ALWAYS AS (properties->>'user_id') STORED;

ANALYZE analytics.all_pageview_raw;
