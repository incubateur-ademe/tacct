import { Prisma } from '@/generated/client/client';
import { COLONNES_DATE, filtreDate } from '../filtres';
import type { Requetes } from '../types';

export const requetesTerritoires: Requetes = {
  51: () => Prisma.sql`
    SELECT COUNT(DISTINCT territory_id) AS total_unique_territories
    FROM (
        SELECT
            CASE
                WHEN (regexp_match(current_url, 'type=([^&]+)'))[1] IN ('petr', 'ept')
                THEN (regexp_match(current_url, 'libelle=([^&]+)'))[1]
                ELSE (regexp_match(current_url, 'code=([^&]+)'))[1]
            END AS territory_id
        FROM analytics.all_pageview_raw
        WHERE current_url LIKE '%/donnees%'
          AND current_url LIKE '%thematique%'
          AND current_url LIKE '%type%'
          AND current_url LIKE '%libelle%'
          AND regexp_match(current_url, 'type=([^&]+)') IS NOT NULL
          AND (
              ( (regexp_match(current_url, 'type=([^&]+)'))[1] IN ('petr', 'ept')
                AND regexp_match(current_url, 'libelle=([^&]+)') IS NOT NULL )
              OR
              ( (regexp_match(current_url, 'type=([^&]+)'))[1] NOT IN ('petr', 'ept')
                AND regexp_match(current_url, 'code=([^&]+)') IS NOT NULL )
          )

        UNION

        SELECT
            CASE
                WHEN regexp_match(current_url, 'codgeo=([^&]+)') IS NOT NULL
                THEN (regexp_match(current_url, 'codgeo=([^&]+)'))[1]
                ELSE (regexp_match(current_url, 'codepci=([^&]+)'))[1]
            END AS territory_id
        FROM analytics.all_pageview_raw
        WHERE current_url LIKE '%/donnees%'
          AND current_url LIKE '%thematique%'
          AND (current_url LIKE '%codepci%' OR current_url LIKE '%codgeo%')
          AND (
              (regexp_match(current_url, 'codgeo=([^&]+)') IS NOT NULL)
              OR
              (regexp_match(current_url, 'codepci=([^&]+)') IS NOT NULL)
          )
    ) AS combined
  `,

  52: (p) => Prisma.sql`
    SELECT * FROM (
        SELECT
            type,
            COUNT(DISTINCT territory_id) AS "visités",
            CASE
                type
                WHEN 'commune' THEN 34875
                WHEN 'epci' THEN 1254
                WHEN 'petr' THEN 122
                WHEN 'pnr' THEN 59
                WHEN 'ept' THEN 11
                WHEN 'departement' THEN 103
                ELSE NULL
            END AS "Nombre total",
            ROUND(
                (COUNT(DISTINCT territory_id) * 100.0) / CASE
                    type
                    WHEN 'commune' THEN 34875
                    WHEN 'epci' THEN 1254
                    WHEN 'petr' THEN 122
                    WHEN 'pnr' THEN 59
                    WHEN 'ept' THEN 11
                    WHEN 'departement' THEN 103
                    ELSE NULL
                END,
                2
            ) AS "Part de territoires visités"
        FROM
            (
                SELECT
                    CASE
                        WHEN (regexp_match(current_url, 'type=([^&]+)')) [1] IN ('petr', 'ept') THEN (regexp_match(current_url, 'libelle=([^&]+)')) [1]
                        ELSE (regexp_match(current_url, 'code=([^&]+)')) [1]
                    END AS territory_id,
                    (regexp_match(current_url, 'type=([^&]+)')) [1] AS type
                FROM
                    analytics.all_pageview_raw
                WHERE
                    current_url LIKE '%/donnees%'
                    AND current_url LIKE '%thematique%'
                    AND current_url LIKE '%type%'
                    AND current_url LIKE '%libelle%'
                    AND regexp_match(current_url, 'type=([^&]+)') IS NOT NULL
                    AND (
                        (
                            (regexp_match(current_url, 'type=([^&]+)')) [1] IN ('petr', 'ept')
                            AND regexp_match(current_url, 'libelle=([^&]+)') IS NOT NULL
                        )
                        OR (
                            (regexp_match(current_url, 'type=([^&]+)')) [1] NOT IN ('petr', 'ept')
                            AND regexp_match(current_url, 'code=([^&]+)') IS NOT NULL
                        )
                    )
                    ${filtreDate(COLONNES_DATE.pageviews, p.periode)}
                UNION
                SELECT
                    CASE
                        WHEN regexp_match(current_url, 'codgeo=([^&]+)') IS NOT NULL THEN (regexp_match(current_url, 'codgeo=([^&]+)')) [1]
                        ELSE (regexp_match(current_url, 'codepci=([^&]+)')) [1]
                    END AS territory_id,
                    CASE
                        WHEN regexp_match(current_url, 'codgeo=([^&]+)') IS NOT NULL THEN 'commune'
                        ELSE 'epci'
                    END AS type
                FROM
                    analytics.all_pageview_raw
                WHERE
                    current_url LIKE '%/donnees%'
                    AND current_url LIKE '%thematique%'
                    AND (
                        current_url LIKE '%codepci%'
                        OR current_url LIKE '%codgeo%'
                    )
                    AND (
                        (
                            regexp_match(current_url, 'codgeo=([^&]+)') IS NOT NULL
                        )
                        OR (
                            regexp_match(current_url, 'codepci=([^&]+)') IS NOT NULL
                        )
                    )
                    ${filtreDate(COLONNES_DATE.pageviews, p.periode)}
            ) AS combined
        GROUP BY
            type
        HAVING type IN ('commune', 'ept', 'epci', 'departement', 'pnr', 'petr')

        UNION ALL

        SELECT
            'epci > 20000' AS type,
            542 AS "visités",
            723 AS "Nombre total",
            74.97 AS "Part de territoires visités"
    ) AS final_result
    ORDER BY
    	"visités" DESC,
        CASE type
            WHEN 'commune' THEN 1
            WHEN 'ept' THEN 2
            WHEN 'epci' THEN 3
            WHEN 'epci > 20000' THEN 4
            WHEN 'departement' THEN 5
            WHEN 'pnr' THEN 6
            WHEN 'petr' THEN 7
        END
  `,

  53: (p) => Prisma.sql`
    SELECT AVG(unique_territories_per_user) AS moyenne_territoire_par_utilisateur
    FROM (
        SELECT
            person_id,
            COUNT(DISTINCT territory_id) AS unique_territories_per_user
        FROM (
            SELECT
                person_id,
                CASE
                    WHEN (regexp_match(current_url, 'type=([^&]+)'))[1] IN ('petr', 'ept')
                    THEN (regexp_match(current_url, 'libelle=([^&]+)'))[1]
                    ELSE (regexp_match(current_url, 'code=([^&]+)'))[1]
                END AS territory_id
            FROM analytics.all_pageview_raw
            WHERE current_url LIKE '%/donnees%'
              AND current_url LIKE '%thematique%'
              AND current_url LIKE '%type%'
              AND current_url LIKE '%libelle%'
              AND regexp_match(current_url, 'type=([^&]+)') IS NOT NULL
              AND (
                  ( (regexp_match(current_url, 'type=([^&]+)'))[1] IN ('petr', 'ept')
                    AND regexp_match(current_url, 'libelle=([^&]+)') IS NOT NULL )
                  OR
                  ( (regexp_match(current_url, 'type=([^&]+)'))[1] NOT IN ('petr', 'ept')
                    AND regexp_match(current_url, 'code=([^&]+)') IS NOT NULL )
              )
              ${filtreDate(COLONNES_DATE.pageviews, p.periode)}

            UNION

            SELECT
                person_id,
                CASE
                    WHEN regexp_match(current_url, 'codgeo=([^&]+)') IS NOT NULL
                    THEN (regexp_match(current_url, 'codgeo=([^&]+)'))[1]
                    ELSE (regexp_match(current_url, 'codepci=([^&]+)'))[1]
                END AS territory_id
            FROM analytics.all_pageview_raw
            WHERE current_url LIKE '%/donnees%'
              AND current_url LIKE '%thematique%'
              AND (current_url LIKE '%codepci%' OR current_url LIKE '%codgeo%')
              AND (
                  (regexp_match(current_url, 'codgeo=([^&]+)') IS NOT NULL)
                  OR
                  (regexp_match(current_url, 'codepci=([^&]+)') IS NOT NULL)
              )
              ${filtreDate(COLONNES_DATE.pageviews, p.periode)}
        ) AS searches
        GROUP BY person_id
    ) AS per_user
  `,

  54: (p) => Prisma.sql`
    SELECT
        code_geographique,
        COUNT(*) AS nombre_total,
        MAX(libelle_geographique) AS libelle_geographique
    FROM (
        SELECT
            CASE
                WHEN (regexp_match(current_url, 'type=([^&]+)'))[1] IN ('petr', 'ept')
                THEN (regexp_match(current_url, 'libelle=([^&]+)'))[1]
                ELSE (regexp_match(current_url, 'code=([^&]+)'))[1]
            END AS code_geographique,
            (
                SELECT string_agg(
                    CASE WHEN m[1] IS NOT NULL
                        THEN convert_from(decode(replace(m[1], '%',''), 'hex'), 'UTF8') ELSE m[2]
                        END, '' ORDER BY ord
                    )
                FROM regexp_matches(replace(
                    (regexp_match(current_url, 'libelle=([^&]+)'))[1], '+', ' '), '((?:%[0-9A-Fa-f]{2})+)|([^%]+)', 'g'
                ) WITH ORDINALITY AS q(m, ord)
            ) AS libelle_geographique
        FROM analytics.all_pageview_raw
        WHERE current_url LIKE '%/donnees%'
          ${filtreDate(COLONNES_DATE.pageviews, p.periode)}
          AND current_url LIKE '%thematique%'
          AND current_url LIKE '%type%'
          AND current_url LIKE '%libelle%'
          AND regexp_match(current_url, 'type=([^&]+)') IS NOT NULL
          AND (
              ( (regexp_match(current_url, 'type=([^&]+)'))[1] IN ('petr', 'ept')
                AND regexp_match(current_url, 'libelle=([^&]+)') IS NOT NULL )
              OR
              ( (regexp_match(current_url, 'type=([^&]+)'))[1] NOT IN ('petr', 'ept')
                AND regexp_match(current_url, 'code=([^&]+)') IS NOT NULL )
          )

        UNION ALL
        SELECT
            CASE
                WHEN regexp_match(current_url, 'codgeo=([^&]+)') IS NOT NULL
                THEN (regexp_match(current_url, 'codgeo=([^&]+)'))[1]
                ELSE (regexp_match(current_url, 'codepci=([^&]+)'))[1]
            END AS code_geographique,
            NULL AS libelle_geographique
        FROM analytics.all_pageview_raw
        WHERE current_url LIKE '%/donnees%'
          ${filtreDate(COLONNES_DATE.pageviews, p.periode)}
          AND current_url LIKE '%thematique%'
          AND (current_url LIKE '%codepci%' OR current_url LIKE '%codgeo%')
          AND (
              (regexp_match(current_url, 'codgeo=([^&]+)') IS NOT NULL)
              OR
              (regexp_match(current_url, 'codepci=([^&]+)') IS NOT NULL)
          )
    ) AS searches
    GROUP BY code_geographique
    ORDER BY nombre_total DESC
  `,

  72: (p) => Prisma.sql`
    SELECT
        code_geographique,
        COUNT(DISTINCT person_id) AS visiteurs_uniques,
        MAX(libelle_geographique) AS libelle_geographique
    FROM (
        SELECT
            NULLIF(TRIM(person_id), '') AS person_id,
            CASE
                WHEN (regexp_match(current_url, 'type=([^&]+)'))[1] IN ('petr', 'ept')
                THEN (regexp_match(current_url, 'libelle=([^&]+)'))[1]
                ELSE (regexp_match(current_url, 'code=([^&]+)'))[1]
            END AS code_geographique,
            (
                SELECT string_agg(
                    CASE
                        WHEN m[1] IS NOT NULL
                        THEN convert_from(decode(replace(m[1], '%',''), 'hex'), 'UTF8')
                        ELSE m[2]
                    END, '' ORDER BY ord
                )
                FROM regexp_matches(
                    replace((regexp_match(current_url, 'libelle=([^&]+)'))[1], '+', ' '),
                    '((?:%[0-9A-Fa-f]{2})+)|([^%]+)', 'g'
                ) WITH ORDINALITY AS q(m, ord)
            ) AS libelle_geographique
        FROM analytics.all_pageview_raw
        WHERE current_url LIKE '%/donnees%'
          ${filtreDate(COLONNES_DATE.pageviews, p.periode)}
          AND current_url LIKE '%thematique%'
          AND current_url LIKE '%type%'
          AND current_url LIKE '%libelle%'
          AND regexp_match(current_url, 'type=([^&]+)') IS NOT NULL
          AND (
              ( (regexp_match(current_url, 'type=([^&]+)'))[1] IN ('petr', 'ept')
                AND regexp_match(current_url, 'libelle=([^&]+)') IS NOT NULL )
              OR
              ( (regexp_match(current_url, 'type=([^&]+)'))[1] NOT IN ('petr', 'ept')
                AND regexp_match(current_url, 'code=([^&]+)') IS NOT NULL )
          )

        UNION ALL

        SELECT
            NULLIF(TRIM(person_id), '') AS person_id,
            CASE
                WHEN regexp_match(current_url, 'codgeo=([^&]+)') IS NOT NULL
                THEN (regexp_match(current_url, 'codgeo=([^&]+)'))[1]
                ELSE (regexp_match(current_url, 'codepci=([^&]+)'))[1]
            END AS code_geographique,
            NULL AS libelle_geographique
        FROM analytics.all_pageview_raw
        WHERE current_url LIKE '%/donnees%'
          ${filtreDate(COLONNES_DATE.pageviews, p.periode)}
          AND current_url LIKE '%thematique%'
          AND (current_url LIKE '%codepci%' OR current_url LIKE '%codgeo%')
          AND (
              regexp_match(current_url, 'codgeo=([^&]+)') IS NOT NULL
              OR regexp_match(current_url, 'codepci=([^&]+)') IS NOT NULL
          )
    ) AS searches
    WHERE person_id IS NOT NULL
    GROUP BY code_geographique
    ORDER BY visiteurs_uniques DESC
  `
};
