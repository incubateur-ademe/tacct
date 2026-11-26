-- Taux de retour : part des visiteurs uniques revenus sur les 6 derniers mois

WITH visitor_days AS (
  SELECT 
    person_id,
    COUNT(DISTINCT DATE(event_timestamp)) as visit_days
  FROM analytics.all_pageview_raw
  WHERE 
    event_timestamp >= NOW() - INTERVAL '6 months'
    AND (
      current_url NOT SIMILAR TO 'https?://(localhost|127\.0\.0\.1)(:|/)%'
    )
    AND (
      current_url NOT LIKE '%facili-tacct-preprod.osc-fr1.scalingo.io%'
      AND current_url NOT LIKE '%facili-tacct.osc-secnum-fr1.scalingo.io%'
      AND current_url NOT LIKE '%facili-tacct-nginx.osc-secnum-fr1.scalingo.io%'
      AND current_url NOT LIKE '%facili-tacct.incubateur.ademe.dev%'
    )
    AND (
      (properties->>'user' IS NULL AND properties->>'User' IS NULL)
      OR (
        COALESCE(properties->>'user', properties->>'User') NOT IN (
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
FROM visitor_days;
