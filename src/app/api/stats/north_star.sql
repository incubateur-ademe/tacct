WITH base AS (
  -- 1) Pages cibles et découpe URL
  SELECT
    session_id,
    person_id,
    event_timestamp,
    current_url,
    properties,
    lower(split_part(regexp_replace(current_url, '^https?://[^/]+', ''), '?', 1)) AS raw_path,
    split_part(regexp_replace(current_url, '^https?://[^/]+', ''), '?', 2) AS qs
  FROM analytics.all_pageview_raw
  WHERE current_url ILIKE '%/thematiques%'
     OR current_url ILIKE '%/donnees-territoriales%'
     OR current_url ILIKE '%/donnees%'
),

kv AS (
  -- 2) Querystring → paires key=value
  SELECT
    b.session_id, b.person_id, b.event_timestamp, b.current_url, b.properties, b.raw_path, b.qs,
    regexp_split_to_table(COALESCE(b.qs, ''), '&') AS pair
  FROM base b
),

kv_parsed AS (
  -- 3) Séparation clé / valeur
  SELECT
    session_id, person_id, event_timestamp, current_url, properties, raw_path,
    lower(split_part(pair, '=', 1)) AS k,
    NULLIF(split_part(pair, '=', 2), '') AS v
  FROM kv
),

params AS (
  -- 4) Pivot des clés utiles
  SELECT
    session_id, person_id, event_timestamp, current_url, properties,
    regexp_replace(raw_path, '/+$', '') AS path_norm,
    MAX(v) FILTER (WHERE k = 'type')                       AS p_type,
    MAX(v) FILTER (WHERE k = 'code')                       AS p_code,
    MAX(v) FILTER (WHERE k = 'libelle')                    AS p_libelle,
    MAX(v) FILTER (WHERE k IN ('thematique','thématique')) AS p_thematique,
    MAX(v) FILTER (WHERE k = 'codgeo')                     AS p_codgeo,
    MAX(v) FILTER (WHERE k = 'codepci')                    AS p_codepci
  FROM kv_parsed
  GROUP BY session_id, person_id, event_timestamp, current_url, properties, raw_path
),

normalized AS (
  -- 5) Normalisations + mapping ancien/nouveau schéma
  SELECT
    session_id,
    person_id,
    event_timestamp,
    current_url,
    properties,
    path_norm,

    -- prev pathname normalisé depuis 3 sources
    regexp_replace(
      lower(
        COALESCE(
          properties->>'$prev_pageview_pathname',
          properties->>'$prev_pathname',
          NULLIF(split_part(regexp_replace(COALESCE(properties->>'$prev_url',''), '^https?://[^/]+', ''), '?', 1), '')
        )
      ),
      '/+$', ''
    ) AS prev_path_norm,

    CASE
      WHEN p_codgeo IS NOT NULL AND p_codepci IS NOT NULL THEN 'commune'
      WHEN p_codgeo IS NULL  AND p_codepci IS NOT NULL THEN 'epci'
      ELSE NULLIF(p_type, '')
    END AS type_norm,

    CASE
      WHEN p_codgeo IS NOT NULL AND p_codepci IS NOT NULL THEN p_codgeo
      WHEN p_codgeo IS NULL  AND p_codepci IS NOT NULL THEN p_codepci
      ELSE NULLIF(p_code, '')
    END AS code_norm,

    NULLIF(replace(COALESCE(p_libelle, ''), '+', ' '), '')    AS libelle_norm,
    NULLIF(replace(COALESCE(p_thematique, ''), '+', ' '), '') AS thematique
  FROM params
),

eligible_sessions AS (
  -- 6) Sessions qui respectent le "tunnel"
  SELECT session_id
  FROM normalized
  GROUP BY session_id
  HAVING
    (COUNT(*) FILTER (WHERE path_norm = '/donnees-territoriales') > 0
     OR COUNT(*) FILTER (WHERE path_norm = '/donnees') > 0)
    AND COUNT(*) FILTER (WHERE path_norm = '/thematiques') > 0
    AND (
      COUNT(*) FILTER (
        WHERE (path_norm = '/donnees-territoriales' OR path_norm = '/donnees')
          AND prev_path_norm = '/thematiques'
      ) > 0
      OR (
        MIN(event_timestamp) FILTER (WHERE path_norm = '/thematiques')
        <
        LEAST(
          COALESCE(MIN(event_timestamp) FILTER (WHERE path_norm = '/thematiques'), 'infinity'::timestamp),
          COALESCE(MIN(event_timestamp) FILTER (WHERE path_norm = '/donnees-territoriales'), 'infinity'::timestamp),
          COALESCE(MIN(event_timestamp) FILTER (WHERE path_norm = '/donnees'), 'infinity'::timestamp)
        )
      )
    )
),

clean AS (
  -- 7) Événements DT des sessions éligibles ; autorise (code OU libelle) avec type non null
  SELECT
    n.session_id,
    n.person_id,
    n.event_timestamp,
    n.current_url,
    n.path_norm,
    n.type_norm    AS type,
    n.code_norm    AS code,
    n.libelle_norm AS libelle,
    n.thematique,
    CASE
      WHEN n.code_norm IS NOT NULL THEN 'code:'  || n.code_norm
      ELSE 'label:' || n.libelle_norm
    END AS territory_key
  FROM normalized n
  JOIN eligible_sessions es USING (session_id)
  WHERE (n.path_norm = '/donnees-territoriales' OR n.path_norm = '/donnees')
    AND n.type_norm IS NOT NULL
    AND (n.code_norm IS NOT NULL OR n.libelle_norm IS NOT NULL)
),

per_session_territory AS (
  -- 8) Dédup par (session, type, territory_key) + date de session (Europe/Paris)
  SELECT
    session_id,
    type,
    territory_key,
    MAX(code)    FILTER (WHERE code IS NOT NULL) AS code_any,
    COALESCE(MAX(libelle) FILTER (WHERE libelle IS NOT NULL AND libelle <> ''), '') AS libelle_any,
    MIN(event_timestamp) AS first_ts,
    -- date locale (Europe/Paris) de la session pour ce territoire
    (MIN(event_timestamp) AT TIME ZONE 'Europe/Paris')::date AS session_day,
    array_agg(DISTINCT NULLIF(thematique, '')) FILTER (WHERE thematique IS NOT NULL AND thematique <> '') AS session_thematiques,
    array_agg(DISTINCT current_url) AS session_urls_dt
  FROM clean
  GROUP BY session_id, type, territory_key
),

sessions_by_day AS (
  -- 9) Nb de sessions par jour et territoire
  SELECT
    type,
    territory_key,
    session_day,
    COUNT(*) AS sessions_day
  FROM per_session_territory
  GROUP BY type, territory_key, session_day
),

themes_first_day AS (
  -- 10) Pour chaque thématique d’un territoire : son premier jour d’apparition
  SELECT
    type,
    territory_key,
    t AS thematique,
    MIN(session_day) AS theme_first_day
  FROM (
    SELECT
      type,
      territory_key,
      session_day,
      unnest(session_thematiques) AS t
    FROM per_session_territory
  ) u
  GROUP BY type, territory_key, t
),

cumulative AS (
  -- 11) Cumuls par territoire et jour :
  --     - cum_sessions : cumul des sessions
  --     - cum_thematiques : nb de thématiques dont le premier jour <= jour courant
  SELECT
    d.type,
    d.territory_key,
    d.session_day AS day,
    SUM(d.sessions_day) OVER (
      PARTITION BY d.type, d.territory_key
      ORDER BY d.session_day
      ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
    ) AS cum_sessions,
    (
      SELECT COUNT(*)
      FROM themes_first_day tf
      WHERE tf.type = d.type
        AND tf.territory_key = d.territory_key
        AND tf.theme_first_day <= d.session_day
    ) AS cum_thematiques
  FROM sessions_by_day d
),

-- 12) Premier jour (unlock_day) où le territoire atteint les 2 seuils
unlocks AS (
  SELECT
    type,
    territory_key,
    MIN(day) AS unlock_day
  FROM cumulative
  WHERE cum_sessions >= 3
    AND cum_thematiques >= 3
  GROUP BY type, territory_key
),

-- 13) Comptage par jour
counts AS (
  SELECT unlock_day::date AS day, COUNT(*) AS north_star
  FROM unlocks
  GROUP BY 1
),

-- 14) Série de dates (Europe/Paris) du 1er jour observé à aujourd'hui
series AS (
  SELECT d::date AS day
  FROM generate_series(
    COALESCE((SELECT MIN(day) FROM counts),
             (now() AT TIME ZONE 'Europe/Paris')::date),
    (now() AT TIME ZONE 'Europe/Paris')::date,
    INTERVAL '1 day'
  ) AS g(d)
)

-- Résultat final avec zéros quand absence de données
SELECT s.day, COALESCE(c.north_star, 0) AS north_star
FROM series s
LEFT JOIN counts c USING (day)
ORDER BY s.day DESC;
