import { Prisma } from '@/generated/client/client';
import type { Requetes } from '../types';

export const requetesVisiteurs: Requetes = {
  57: () => Prisma.sql`
    SELECT COUNT(DISTINCT person_id) AS unique_person
    FROM analytics.all_pageview_raw
    WHERE person_id IS NOT NULL AND person_id <> ''
  `,

  62: () => Prisma.sql`
    WITH base AS (
      SELECT
        date_trunc('month', event_timestamp AT TIME ZONE 'Europe/Paris') AS month_start,
        NULLIF(TRIM(person_id), '') AS person_id
      FROM analytics.all_pageview_raw
    ),
    labeled AS (
      SELECT
        month_start,
        person_id,
        CASE EXTRACT(MONTH FROM month_start)
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
        END || ' ' || EXTRACT(YEAR FROM month_start) AS mois
      FROM base
    )
    SELECT
      mois,
      COUNT(DISTINCT person_id) AS count
    FROM labeled
    WHERE person_id IS NOT NULL
    GROUP BY month_start, mois
    ORDER BY month_start
  `,

  73: () => Prisma.sql`
    SELECT COUNT(DISTINCT person_id) as returning_visitors
    FROM (
      SELECT
        person_id,
        COUNT(DISTINCT DATE(event_timestamp)) as visit_days
      FROM analytics.all_pageview_raw
      WHERE
        event_timestamp >= NOW() - INTERVAL '6 months'
        AND (
          current_url NOT SIMILAR TO 'https?://(localhost|127\\.0\\.0\\.1)(:|/)%'
        )
        AND (
          current_url NOT LIKE '%facili-tacct-preprod.osc-fr1.scalingo.io%'
          AND current_url NOT LIKE '%facili-tacct.osc-secnum-fr1.scalingo.io%'
          AND current_url NOT LIKE '%facili-tacct-nginx.osc-secnum-fr1.scalingo.io%'
          AND current_url NOT LIKE '%facili-tacct.incubateur.ademe.dev%'
        )
        AND (
          posthog_user IS NULL
          OR (
            posthog_user NOT IN (
              'Thomas Doguet Mac', 'Laurent Barbat Mac', 'Laurent Barbat Phone',
              'Audrey Coudrin', 'Audrey ', 'Aude Bodiguel Home', 'Myriam Blal',
              'Antoine Conegero PC Portable', 'Céline Vanhautère PC',
              'Céline Vanhautère', 'Céline Vanhautère ADEME', 'Antoine Conegero Maison',
              'Antoine Conegero port', 'Aude 04/2025', 'Alexandre Joubert',
              'Antoine Conegero Home', 'Antoine Conegero work',
              'Céline Vanhautère desktop Cardinal', 'Céline Vanhautère Phone',
              '2025-05 Antoine PC portable', '2025-05 Céline', '2025-05 Aude maison',
              '2025-05 Céline mobile', '2025-05 Laurent pc', '2025-05 Thomas ',
              '2025-05 Audrey pc', '2025-05 Aude Ademe', '2025-05 Myriam maison'
            )
          )
        )
      GROUP BY person_id
      HAVING COUNT(DISTINCT DATE(event_timestamp)) >= 2
    ) as returning_users
  `,

  74: () => Prisma.sql`
    WITH visitor_days AS (
      SELECT
        person_id,
        COUNT(DISTINCT DATE(event_timestamp)) as visit_days
      FROM analytics.all_pageview_raw
      WHERE
        event_timestamp >= NOW() - INTERVAL '6 months'
        AND (
          current_url NOT SIMILAR TO 'https?://(localhost|127\\.0\\.0\\.1)(:|/)%'
        )
        AND (
          current_url NOT LIKE '%facili-tacct-preprod.osc-fr1.scalingo.io%'
          AND current_url NOT LIKE '%facili-tacct.osc-secnum-fr1.scalingo.io%'
          AND current_url NOT LIKE '%facili-tacct-nginx.osc-secnum-fr1.scalingo.io%'
          AND current_url NOT LIKE '%facili-tacct.incubateur.ademe.dev%'
        )
        AND (
          posthog_user IS NULL
          OR (
            posthog_user NOT IN (
              'Thomas Doguet Mac', 'Laurent Barbat Mac', 'Laurent Barbat Phone',
              'Audrey Coudrin', 'Audrey ', 'Aude Bodiguel Home', 'Myriam Blal',
              'Antoine Conegero PC Portable', 'Céline Vanhautère PC',
              'Céline Vanhautère', 'Céline Vanhautère ADEME', 'Antoine Conegero Maison',
              'Antoine Conegero port', 'Aude 04/2025', 'Alexandre Joubert',
              'Antoine Conegero Home', 'Antoine Conegero work',
              'Céline Vanhautère desktop Cardinal', 'Céline Vanhautère Phone',
              '2025-05 Antoine PC portable', '2025-05 Céline', '2025-05 Aude maison',
              '2025-05 Céline mobile', '2025-05 Laurent pc', '2025-05 Thomas ',
              '2025-05 Audrey pc', '2025-05 Aude Ademe', '2025-05 Myriam maison'
            )
          )
        )
      GROUP BY person_id
    )

    SELECT
      COUNT(DISTINCT person_id) as total_visitors,
      COUNT(DISTINCT person_id) FILTER (WHERE visit_days >= 2) as returning_visitors,
      ROUND(
        100.0 * COUNT(DISTINCT person_id) FILTER (WHERE visit_days >= 2) /
        NULLIF(COUNT(DISTINCT person_id), 0),
        2
      ) as return_rate_percent
    FROM visitor_days
  `
};
