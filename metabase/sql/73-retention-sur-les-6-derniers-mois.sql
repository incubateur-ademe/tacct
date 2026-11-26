-- Nombre de visiteurs uniques revenus au moins une fois sur les 6 derniers mois
-- Un visiteur est considéré comme "revenu" s'il a visité le site sur au moins 2 jours distincts

SELECT COUNT(DISTINCT person_id) as returning_visitors
FROM (
  SELECT 
    person_id,
    COUNT(DISTINCT DATE(event_timestamp)) as visit_days
  FROM analytics.all_pageview_raw
  WHERE 
    event_timestamp >= NOW() - INTERVAL '6 months'
    -- Exclure les environnements de dev/preprod
    AND (
      current_url NOT SIMILAR TO 'https?://(localhost|127\.0\.0\.1)(:|/)%'
    )
    AND (
      current_url NOT LIKE '%facili-tacct-preprod.osc-fr1.scalingo.io%'
      AND current_url NOT LIKE '%facili-tacct.osc-secnum-fr1.scalingo.io%'
      AND current_url NOT LIKE '%facili-tacct-nginx.osc-secnum-fr1.scalingo.io%'
      AND current_url NOT LIKE '%facili-tacct.incubateur.ademe.dev%'
    )
    -- Exclure les membres de l'équipe
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
  HAVING COUNT(DISTINCT DATE(event_timestamp)) >= 2
) as returning_users;
