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
  [[ AND {{periode}} ]]
),
params AS (
  SELECT
    session_id,
    event_timestamp,
    path_norm,
    prev_path_norm,
    NULLIF(substring(qs from '(?i)(?:^|&)type=([^&]*)'), '')            AS p_type,
    NULLIF(substring(qs from '(?i)(?:^|&)code=([^&]*)'), '')            AS p_code,
    NULLIF(substring(qs from '(?i)(?:^|&)libelle=([^&]*)'), '')         AS p_libelle,
    NULLIF(substring(qs from '(?i)(?:^|&)th[eé]matique=([^&]*)'), '')   AS p_thematique,
    NULLIF(substring(qs from '(?i)(?:^|&)codgeo=([^&]*)'), '')          AS p_codgeo,
    NULLIF(substring(qs from '(?i)(?:^|&)codepci=([^&]*)'), '')         AS p_codepci
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
    n.type_norm AS type,
    CASE
      WHEN n.code_norm IS NOT NULL THEN 'code:'  || n.code_norm
      ELSE                              'label:' || n.libelle_norm
    END AS territory_key,
    n.thematique
  FROM normalized n
  JOIN eligible_sessions es USING (session_id)
  WHERE n.path_norm IN ('/donnees-territoriales', '/donnees')
    AND (n.code_norm IS NOT NULL OR n.libelle_norm IS NOT NULL)
    AND n.type_norm IS NOT NULL
)
SELECT COUNT(*) AS north_star
FROM (
  SELECT type, territory_key
  FROM clean
  GROUP BY type, territory_key
  HAVING COUNT(DISTINCT session_id) >= 3
     AND COUNT(DISTINCT thematique) >= 3
) t;
