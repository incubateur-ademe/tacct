import { Prisma } from '@/generated/client/client';
import { COLONNES_DATE, filtreDate, tronquerDate } from '../filtres';
import type { Requetes } from '../types';

export const requetesNorthStar: Requetes = {
  55: () => Prisma.sql`
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
            prev_pageview_pathname,
            prev_pathname,
            NULLIF(split_part(
              regexp_replace(COALESCE(prev_url,''), '^https?://[^/]+', ''),
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
        array_agg(DISTINCT thematique  ORDER BY thematique)  FILTER (WHERE thematique IS NOT NULL) AS thematiques
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
      COALESCE(a.thematiques, ARRAY[]::text[]) AS thematiques
    FROM territory_agg a
    LEFT JOIN libelle_pick p USING (type, territory_key)
    ORDER BY a.recherche_count DESC, a.thematiques_count DESC, a.code
  `,

  56: (p) => Prisma.sql`
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
            prev_pageview_pathname,
            prev_pathname,
            NULLIF(split_part(
              regexp_replace(COALESCE(prev_url,''), '^https?://[^/]+', ''),
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
      ${filtreDate(COLONNES_DATE.pageviews, p.periode)}
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
    ) t
  `,

  58: () => Prisma.sql`
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
            prev_pageview_pathname,
            prev_pathname,
            NULLIF(split_part(
              regexp_replace(COALESCE(prev_url,''), '^https?://[^/]+', ''),
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
    ORDER BY s.day DESC
  `,

  69: (p) => Prisma.sql`
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
            prev_pageview_pathname,
            prev_pathname,
            NULLIF(split_part(
              regexp_replace(COALESCE(prev_url,''), '^https?://[^/]+', ''),
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
    ),
    final_daily AS (
      SELECT s.day, COALESCE(c.north_star, 0) AS north_star
      FROM series s
      LEFT JOIN counts c USING (day)
    )
    SELECT
      EXTRACT(DAY FROM ${tronquerDate(p.granularite, 'final_daily.day')}) || ' ' ||
      CASE EXTRACT(MONTH FROM ${tronquerDate(p.granularite, 'final_daily.day')})
        WHEN 1 THEN 'janvier'   WHEN 2 THEN 'février'   WHEN 3 THEN 'mars'
        WHEN 4 THEN 'avril'     WHEN 5 THEN 'mai'       WHEN 6 THEN 'juin'
        WHEN 7 THEN 'juillet'   WHEN 8 THEN 'août'      WHEN 9 THEN 'septembre'
        WHEN 10 THEN 'octobre'  WHEN 11 THEN 'novembre' WHEN 12 THEN 'décembre'
      END || ' ' || EXTRACT(YEAR FROM ${tronquerDate(p.granularite, 'final_daily.day')}) AS date,
      SUM(north_star) AS north_star
    FROM final_daily
    GROUP BY ${tronquerDate(p.granularite, 'final_daily.day')}
    ORDER BY ${tronquerDate(p.granularite, 'final_daily.day')} ASC
  `,

  75: (p) => Prisma.sql`
    WITH base AS (
      SELECT
        id,
        session_id,
        person_id,
        event_timestamp,
        current_url,
        lower(split_part(regexp_replace(current_url, '^https?://[^/]+', ''), '?', 1)) AS raw_path,
        split_part(regexp_replace(current_url, '^https?://[^/]+', ''), '?', 2) AS qs,
        regexp_replace(
          lower(
            COALESCE(
              prev_pageview_pathname,
              prev_pathname,
              NULLIF(split_part(regexp_replace(COALESCE(prev_url,''), '^https?://[^/]+', ''), '?', 1), '')
            )
          ),
          '/+$', ''
        ) AS prev_path_norm
      FROM analytics.all_pageview_raw
      WHERE current_url ILIKE '%/thematiques%'
         OR current_url ILIKE '%/donnees-territoriales%'
         OR current_url ILIKE '%/donnees%'
    ),

    kv AS (
      SELECT
        b.id, b.session_id, b.person_id, b.event_timestamp, b.current_url, b.raw_path, b.prev_path_norm, b.qs,
        regexp_split_to_table(COALESCE(b.qs, ''), '&') AS pair
      FROM base b
    ),

    kv_parsed AS (
      SELECT
        id, session_id, person_id, event_timestamp, current_url, raw_path, prev_path_norm,
        lower(split_part(pair, '=', 1)) AS k,
        NULLIF(split_part(pair, '=', 2), '') AS v
      FROM kv
    ),

    params AS (
      SELECT
        session_id, person_id, event_timestamp, current_url, prev_path_norm,
        regexp_replace(raw_path, '/+$', '') AS path_norm,
        MAX(v) FILTER (WHERE k = 'type')                       AS p_type,
        MAX(v) FILTER (WHERE k = 'code')                       AS p_code,
        MAX(v) FILTER (WHERE k = 'libelle')                    AS p_libelle,
        MAX(v) FILTER (WHERE k IN ('thematique','thématique')) AS p_thematique,
        MAX(v) FILTER (WHERE k = 'codgeo')                     AS p_codgeo,
        MAX(v) FILTER (WHERE k = 'codepci')                    AS p_codepci
      FROM kv_parsed
      GROUP BY id, session_id, person_id, event_timestamp, current_url, raw_path, prev_path_norm
    ),

    normalized AS (
      SELECT
        session_id,
        person_id,
        event_timestamp,
        current_url,
        path_norm,
        prev_path_norm,

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
      SELECT
        session_id,
        type,
        territory_key,
        MAX(code)    FILTER (WHERE code IS NOT NULL) AS code_any,
        COALESCE(MAX(libelle) FILTER (WHERE libelle IS NOT NULL AND libelle <> ''), '') AS libelle_any,
        MIN(event_timestamp) AS first_ts,
        (MIN(event_timestamp) AT TIME ZONE 'Europe/Paris')::date AS session_day,
        array_agg(DISTINCT NULLIF(thematique, '')) FILTER (WHERE thematique IS NOT NULL AND thematique <> '') AS session_thematiques,
        array_agg(DISTINCT current_url) AS session_urls_dt
      FROM clean
      GROUP BY session_id, type, territory_key
    ),

    sessions_by_day AS (
      SELECT
        type,
        territory_key,
        session_day,
        COUNT(*) AS sessions_day
      FROM per_session_territory
      GROUP BY type, territory_key, session_day
    ),

    themes_first_day AS (
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

    themes_by_day AS (
      SELECT type, territory_key, theme_first_day AS day, COUNT(*) AS new_themes
      FROM themes_first_day
      GROUP BY type, territory_key, theme_first_day
    ),

    cumulative AS (
      SELECT
        d.type,
        d.territory_key,
        d.session_day AS day,
        SUM(d.sessions_day)            OVER w AS cum_sessions,
        SUM(COALESCE(t.new_themes, 0)) OVER w AS cum_thematiques
      FROM sessions_by_day d
      LEFT JOIN themes_by_day t
        ON  t.type          = d.type
        AND t.territory_key = d.territory_key
        AND t.day           = d.session_day
      WINDOW w AS (
        PARTITION BY d.type, d.territory_key
        ORDER BY d.session_day
        ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
      )
    ),

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

    counts AS (
      SELECT unlock_day::date AS day, COUNT(*) AS north_star
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
    ),
    final_daily AS (
      SELECT s.day, COALESCE(c.north_star, 0) AS north_star
      FROM series s
      LEFT JOIN counts c USING (day)
    )

    SELECT
      EXTRACT(DAY FROM ${tronquerDate(p.granularite, 'final_daily.day')}) || ' ' ||
      CASE EXTRACT(MONTH FROM ${tronquerDate(p.granularite, 'final_daily.day')})
        WHEN 1 THEN 'janvier'
        WHEN 2 THEN 'février'
        WHEN 3 THEN 'mars'
        WHEN 4 THEN 'avril'
        WHEN 5 THEN 'mai'
        WHEN 6 THEN 'juin'
        WHEN 7 THEN 'juillet'
        WHEN 8 THEN 'août'
        WHEN 9 THEN 'septembre'
        WHEN 10 THEN 'octobre'
        WHEN 11 THEN 'novembre'
        WHEN 12 THEN 'décembre'
      END || ' ' || EXTRACT(YEAR FROM ${tronquerDate(p.granularite, 'final_daily.day')}) AS date,
      SUM(SUM(north_star)) OVER (
        ORDER BY ${tronquerDate(p.granularite, 'final_daily.day')}
        ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
      ) AS north_star_cumule
    FROM final_daily
    GROUP BY ${tronquerDate(p.granularite, 'final_daily.day')}
    ORDER BY ${tronquerDate(p.granularite, 'final_daily.day')} ASC
  `
};
