import { Prisma } from '@/generated/client/client';
import { COLONNES_DATE, filtreDate } from '../filtres';
import type { Requetes } from '../types';

export const requetesContenus: Requetes = {
  46: (p) => Prisma.sql`
    SELECT thematique, COUNT(*) AS count
    FROM analytics.thematique
    WHERE 1=1
      ${filtreDate(COLONNES_DATE.thematique, p.periode)}
    GROUP BY thematique
    ORDER BY count DESC
  `,

  59: () => Prisma.sql`
    SELECT
        code_geographique,
        libelle_geographique,
        thematique AS indicateur,
        COUNT(*) AS total
    FROM (
        SELECT DISTINCT ON (session_id, person_id, thematique, code_geographique)
            code_geographique,
            libelle_geographique,
            thematique
        FROM analytics.boutons_export_raw
        ORDER BY session_id, person_id, thematique, code_geographique, event_timestamp ASC
    ) uniques
    GROUP BY code_geographique, libelle_geographique, thematique
    ORDER BY total DESC
  `,

  60: (p) => Prisma.sql`
    SELECT
        (regexp_match(current_url, 'ressources/[^/?]+/([^/?]+)'))[1] AS article_name,
        COUNT(DISTINCT session_id) AS unique_sessions
    FROM analytics.all_pageview_raw
    WHERE current_url ~ 'ressources/[^/?]+/[^/?]+'
      ${filtreDate(COLONNES_DATE.pageviews, p.periode)}
    GROUP BY article_name
    ORDER BY unique_sessions DESC
    LIMIT 10
  `,

  61: (p) => Prisma.sql`
    SELECT
      referring_domain,
      COUNT(*) AS occurrences
    FROM analytics.all_pageview_raw
    WHERE 1 = 1
      ${filtreDate(COLONNES_DATE.pageviews, p.periode)}
    GROUP BY referring_domain
    ORDER BY occurrences DESC
  `,

  67: () => Prisma.sql`
    WITH last AS (
      SELECT population::numeric AS pop
      FROM analytics.couverture_population
      ORDER BY date DESC, id DESC
      LIMIT 1
    )
    SELECT 'Couvert' AS label, pop AS value
    FROM last
    UNION ALL
    SELECT 'Non couvert' AS label, GREATEST(67760573::numeric - pop, 0) AS value
    FROM last
  `,

  70: (p) => Prisma.sql`
    WITH thematiques AS (
        SELECT UNNEST(ARRAY['Confort+thermique', 'Agriculture']) AS thematique_url,
               UNNEST(ARRAY['Confort thermique', 'Agriculture']) AS thematique_nom
    ),
    etape1 AS (
        SELECT DISTINCT
            p.distinct_id,
            t.thematique_nom
        FROM (
            SELECT distinct_id, current_url
            FROM analytics.all_pageview_raw
            WHERE current_url LIKE '%/donnees%'
                AND event_timestamp >= '2025-12-09 00:00:00'::timestamptz
                AND distinct_id IS NOT NULL
                AND distinct_id != ''
                ${filtreDate(COLONNES_DATE.pageviews, p.periode)}
        ) p
        INNER JOIN thematiques t ON p.current_url LIKE '%thematique=' || t.thematique_url || '%'
    ),
    etape2 AS (
        SELECT DISTINCT
            distinct_id,
            properties->>'thematique' AS thematique
        FROM analytics.boutons_etape2
        WHERE (properties->>'thematique' = 'Confort thermique'
               OR properties->>'thematique' = 'Agriculture')
            AND distinct_id IS NOT NULL
            AND distinct_id != ''
            ${filtreDate(COLONNES_DATE.boutonsEtape2, p.periodeEtape2)}
    ),
    conversion AS (
        SELECT
            e1.distinct_id,
            e1.thematique_nom
        FROM etape1 e1
        INNER JOIN etape2 e2 ON e1.distinct_id = e2.distinct_id
            AND e1.thematique_nom = e2.thematique
    )
    SELECT
        e1.thematique_nom AS thematique,
        COUNT(DISTINCT e1.distinct_id) AS users_etape1,
        COUNT(DISTINCT c.distinct_id) AS users_converties,
        ROUND(
            (COUNT(DISTINCT c.distinct_id)::numeric / NULLIF(COUNT(DISTINCT e1.distinct_id), 0)) * 100,
            2
        ) AS taux_conversion
    FROM etape1 e1
    LEFT JOIN conversion c ON e1.distinct_id = c.distinct_id AND e1.thematique_nom = c.thematique_nom
    GROUP BY e1.thematique_nom
    ORDER BY e1.thematique_nom
  `
};
