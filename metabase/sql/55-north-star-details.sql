WITH base AS (
  SELECT
    session_id,
    event_timestamp,
    current_url,
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
raw_params AS (
  SELECT
    session_id,
    event_timestamp,
    current_url,
    path_norm,
    prev_path_norm,
    NULLIF(substring(qs from '(?i)(?:^|&)type=([^&]*)'), '')          AS p_type_raw,
    NULLIF(substring(qs from '(?i)(?:^|&)code=([^&]*)'), '')          AS p_code_raw,
    NULLIF(substring(qs from '(?i)(?:^|&)codgeo=([^&]*)'), '')        AS p_codgeo_raw,
    NULLIF(substring(qs from '(?i)(?:^|&)codepci=([^&]*)'), '')       AS p_codepci_raw,
    NULLIF(substring(qs from '(?i)(?:^|&)libelle=([^&]*)'), '')       AS p_libelle_raw,
    NULLIF(substring(qs from '(?i)(?:^|&)th[eé]matique=([^&]*)'), '') AS p_thematique_raw
  FROM base
),
decoded AS (
  SELECT
    session_id,
    event_timestamp,
    current_url,
    path_norm,
    prev_path_norm,
    CASE WHEN p_type_raw IS NULL THEN NULL
         WHEN position('%' IN p_type_raw) = 0 THEN replace(p_type_raw, '+', ' ')
         ELSE (SELECT string_agg(CASE WHEN m[1] IS NOT NULL
                    THEN convert_from(decode(replace(m[1],'%',''), 'hex'), 'UTF8')
                    ELSE m[2] END, '' ORDER BY ord)
               FROM regexp_matches(replace(p_type_raw,'+',' '),
                      '((?:%[0-9A-Fa-f]{2})+)|([^%]+)', 'g') WITH ORDINALITY AS q(m, ord))
    END AS p_type,
    CASE WHEN p_code_raw IS NULL THEN NULL
         WHEN position('%' IN p_code_raw) = 0 THEN replace(p_code_raw, '+', ' ')
         ELSE (SELECT string_agg(CASE WHEN m[1] IS NOT NULL
                    THEN convert_from(decode(replace(m[1],'%',''), 'hex'), 'UTF8')
                    ELSE m[2] END, '' ORDER BY ord)
               FROM regexp_matches(replace(p_code_raw,'+',' '),
                      '((?:%[0-9A-Fa-f]{2})+)|([^%]+)', 'g') WITH ORDINALITY AS q(m, ord))
    END AS p_code,
    CASE WHEN p_codgeo_raw IS NULL THEN NULL
         WHEN position('%' IN p_codgeo_raw) = 0 THEN replace(p_codgeo_raw, '+', ' ')
         ELSE (SELECT string_agg(CASE WHEN m[1] IS NOT NULL
                    THEN convert_from(decode(replace(m[1],'%',''), 'hex'), 'UTF8')
                    ELSE m[2] END, '' ORDER BY ord)
               FROM regexp_matches(replace(p_codgeo_raw,'+',' '),
                      '((?:%[0-9A-Fa-f]{2})+)|([^%]+)', 'g') WITH ORDINALITY AS q(m, ord))
    END AS p_codgeo,
    CASE WHEN p_codepci_raw IS NULL THEN NULL
         WHEN position('%' IN p_codepci_raw) = 0 THEN replace(p_codepci_raw, '+', ' ')
         ELSE (SELECT string_agg(CASE WHEN m[1] IS NOT NULL
                    THEN convert_from(decode(replace(m[1],'%',''), 'hex'), 'UTF8')
                    ELSE m[2] END, '' ORDER BY ord)
               FROM regexp_matches(replace(p_codepci_raw,'+',' '),
                      '((?:%[0-9A-Fa-f]{2})+)|([^%]+)', 'g') WITH ORDINALITY AS q(m, ord))
    END AS p_codepci,
    CASE WHEN p_libelle_raw IS NULL THEN NULL
         WHEN position('%' IN p_libelle_raw) = 0 THEN replace(p_libelle_raw, '+', ' ')
         ELSE (SELECT string_agg(CASE WHEN m[1] IS NOT NULL
                    THEN convert_from(decode(replace(m[1],'%',''), 'hex'), 'UTF8')
                    ELSE m[2] END, '' ORDER BY ord)
               FROM regexp_matches(replace(p_libelle_raw,'+',' '),
                      '((?:%[0-9A-Fa-f]{2})+)|([^%]+)', 'g') WITH ORDINALITY AS q(m, ord))
    END AS p_libelle,
    CASE WHEN p_thematique_raw IS NULL THEN NULL
         WHEN position('%' IN p_thematique_raw) = 0 THEN replace(p_thematique_raw, '+', ' ')
         ELSE (SELECT string_agg(CASE WHEN m[1] IS NOT NULL
                    THEN convert_from(decode(replace(m[1],'%',''), 'hex'), 'UTF8')
                    ELSE m[2] END, '' ORDER BY ord)
               FROM regexp_matches(replace(p_thematique_raw,'+',' '),
                      '((?:%[0-9A-Fa-f]{2})+)|([^%]+)', 'g') WITH ORDINALITY AS q(m, ord))
    END AS p_thematique
  FROM raw_params
),
normalized AS (
  SELECT
    session_id,
    event_timestamp,
    current_url,
    path_norm,
    prev_path_norm,
    CASE
      WHEN p_codgeo IS NOT NULL AND p_codepci IS NOT NULL THEN 'commune'
      WHEN p_codgeo IS NULL     AND p_codepci IS NOT NULL THEN 'epci'
      ELSE NULLIF(p_type, '')
    END AS type_norm,
    CASE
      WHEN p_codgeo IS NOT NULL AND p_codepci IS NOT NULL THEN p_codgeo
      WHEN p_codgeo IS NULL     AND p_codepci IS NOT NULL THEN p_codepci
      ELSE NULLIF(p_code, '')
    END AS code_norm,
    NULLIF(p_libelle, '')    AS libelle_norm,
    NULLIF(p_thematique, '') AS thematique
  FROM decoded
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
    n.current_url,
    n.type_norm    AS type,
    n.code_norm    AS code,
    n.libelle_norm AS libelle,
    n.thematique,
    CASE
      WHEN n.code_norm IS NOT NULL THEN 'code:'  || n.code_norm
      ELSE                              'label:' || n.libelle_norm
    END AS territory_key
  FROM normalized n
  JOIN eligible_sessions es USING (session_id)
  WHERE n.path_norm IN ('/donnees-territoriales', '/donnees')
    AND n.type_norm IS NOT NULL
    AND (n.code_norm IS NOT NULL OR n.libelle_norm IS NOT NULL)
),
territory_agg AS (
  SELECT
    type,
    territory_key,
    MAX(code)                  AS code,
    COUNT(DISTINCT session_id) AS recherche_count,
    COUNT(DISTINCT thematique) AS thematiques_count,
    array_agg(DISTINCT thematique  ORDER BY thematique)  FILTER (WHERE thematique IS NOT NULL) AS thematiques,
    array_agg(DISTINCT current_url ORDER BY current_url)                                       AS urls_brutes
  FROM clean
  GROUP BY type, territory_key
  HAVING COUNT(DISTINCT session_id) >= 3
     AND COUNT(DISTINCT thematique) >= 3
),
libelle_pick AS (
  SELECT DISTINCT ON (type, territory_key)
    type, territory_key, libelle_any AS libelle
  FROM (
    SELECT type, territory_key, libelle_any, COUNT(*) AS c
    FROM (
      SELECT session_id, type, territory_key,
             MAX(libelle) FILTER (WHERE libelle IS NOT NULL AND libelle <> '') AS libelle_any
      FROM clean
      GROUP BY session_id, type, territory_key
    ) pst
    WHERE libelle_any IS NOT NULL AND libelle_any <> ''
    GROUP BY type, territory_key, libelle_any
  ) x
  ORDER BY type, territory_key, c DESC, libelle_any ASC
)
SELECT
  a.code,
  COALESCE(p.libelle, '') AS libelle,
  a.type,
  a.recherche_count,
  a.thematiques_count,
  COALESCE(a.thematiques, ARRAY[]::text[]) AS thematiques,
  COALESCE(a.urls_brutes, ARRAY[]::text[]) AS urls_brutes
FROM territory_agg a
LEFT JOIN libelle_pick p USING (type, territory_key)
ORDER BY a.recherche_count DESC, a.thematiques_count DESC, a.code;
