WITH base AS (
  SELECT
    session_id,
    event_timestamp,
    regexp_replace(
      lower(split_part(regexp_replace(current_url, '^https?://[^/]+', ''), '?', 1)),
      '/+$', ''
    ) AS path_norm,
    regexp_replace(
      lower(COALESCE(
        properties->>'$prev_pageview_pathname',
        properties->>'$prev_pathname',
        NULLIF(split_part(
          regexp_replace(COALESCE(properties->>'$prev_url',''), '^https?://[^/]+', ''),
        '?', 1), '')
      )),
      '/+$', ''
    ) AS prev_path_norm,
    split_part(regexp_replace(current_url, '^https?://[^/]+', ''), '?', 2) AS qs
  FROM analytics.all_pageview_raw
  WHERE (
         current_url ILIKE '%/thematiques%'
      OR current_url ILIKE '%/donnees%'
  )
),
params AS (
  SELECT
    session_id,
    event_timestamp,
    path_norm,
    prev_path_norm,
    NULLIF(substring(qs from '(?i)(?:^|&)type=([^&]*)'), '')          AS p_type,
    NULLIF(substring(qs from '(?i)(?:^|&)code=([^&]*)'), '')          AS p_code,
    NULLIF(substring(qs from '(?i)(?:^|&)libelle=([^&]*)'), '')       AS p_libelle,
    NULLIF(substring(qs from '(?i)(?:^|&)th[eé]matique=([^&]*)'), '') AS p_thematique,
    NULLIF(substring(qs from '(?i)(?:^|&)codgeo=([^&]*)'), '')        AS p_codgeo,
    NULLIF(substring(qs from '(?i)(?:^|&)codepci=([^&]*)'), '')       AS p_codepci
  FROM base
),
normalized AS (
  SELECT
    session_id,
    event_timestamp,
    path_norm,
    prev_path_norm,
    CASE
      WHEN p_codgeo IS NOT NULL AND p_codepci IS NOT NULL THEN 'commune'
      WHEN p_codgeo IS NULL     AND p_codepci IS NOT NULL THEN 'epci'
      ELSE p_type
    END AS type_norm,
    CASE
      WHEN p_codgeo IS NOT NULL AND p_codepci IS NOT NULL THEN p_codgeo
      WHEN p_codgeo IS NULL     AND p_codepci IS NOT NULL THEN p_codepci
      ELSE p_code
    END AS code_norm,
    NULLIF(replace(COALESCE(p_libelle, ''), '+', ' '), '')    AS libelle_norm,
    NULLIF(replace(COALESCE(p_thematique, ''), '+', ' '), '') AS thematique
  FROM params
),
eligible_sessions AS (
  SELECT session_id
  FROM normalized
  GROUP BY session_id
  HAVING COUNT(*) FILTER (WHERE path_norm IN ('/donnees-territoriales', '/donnees')) > 0
     AND COUNT(*) FILTER (WHERE path_norm = '/thematiques') > 0
     AND (
       COUNT(*) FILTER (
         WHERE path_norm IN ('/donnees-territoriales', '/donnees')
           AND prev_path_norm = '/thematiques'
       ) > 0
       OR MIN(event_timestamp) FILTER (WHERE path_norm = '/thematiques')
          < MIN(event_timestamp) FILTER (WHERE path_norm IN ('/donnees-territoriales', '/donnees'))
     )
),
clean AS (
  SELECT
    n.session_id,
    n.event_timestamp,
    n.type_norm AS type,
    CASE
      WHEN n.code_norm IS NOT NULL THEN 'code:'  || n.code_norm
      ELSE                              'label:' || n.libelle_norm
    END AS territory_key,
    n.thematique
  FROM normalized n
  JOIN eligible_sessions es USING (session_id)
  WHERE n.path_norm IN ('/donnees-territoriales', '/donnees')
    AND n.type_norm IS NOT NULL
    AND (n.code_norm IS NOT NULL OR n.libelle_norm IS NOT NULL)
),
clean_day AS (
  SELECT
    session_id,
    type,
    territory_key,
    thematique,
    (MIN(event_timestamp) OVER (PARTITION BY session_id, type, territory_key)
       AT TIME ZONE 'Europe/Paris')::date AS session_day
  FROM clean
),
sessions_by_day AS (
  SELECT type, territory_key, session_day, COUNT(*) AS sessions_day
  FROM (SELECT DISTINCT session_id, type, territory_key, session_day FROM clean_day) pst
  GROUP BY type, territory_key, session_day
),
themes_by_day AS (
  SELECT type, territory_key, theme_first_day AS day, COUNT(*) AS new_themes
  FROM (
    SELECT type, territory_key, thematique, MIN(session_day) AS theme_first_day
    FROM clean_day
    WHERE thematique IS NOT NULL
    GROUP BY type, territory_key, thematique
  ) tf
  GROUP BY type, territory_key, theme_first_day
),
cumulative AS (
  SELECT
    s.type,
    s.territory_key,
    s.session_day AS day,
    SUM(s.sessions_day)            OVER w AS cum_sessions,
    SUM(COALESCE(t.new_themes, 0)) OVER w AS cum_thematiques
  FROM sessions_by_day s
  LEFT JOIN themes_by_day t
    ON  t.type          = s.type
    AND t.territory_key = s.territory_key
    AND t.day           = s.session_day
  WINDOW w AS (PARTITION BY s.type, s.territory_key ORDER BY s.session_day)
),
unlocks AS (
  SELECT type, territory_key, MIN(day) AS unlock_day
  FROM cumulative
  WHERE cum_sessions >= 3
    AND cum_thematiques >= 3
  GROUP BY type, territory_key
),
counts AS (
  SELECT unlock_day AS day, COUNT(*) AS north_star
  FROM unlocks
  GROUP BY 1
),
series AS (
  SELECT d::date AS day
  FROM generate_series(
    COALESCE((SELECT MIN(day) FROM counts),
             (now() AT TIME ZONE 'Europe/Paris')::date),
    (now() AT TIME ZONE 'Europe/Paris')::date,
    INTERVAL '1 day'
  ) AS g(d)
)
SELECT s.day, COALESCE(c.north_star, 0) AS north_star
FROM series s
LEFT JOIN counts c USING (day)
ORDER BY s.day DESC;
