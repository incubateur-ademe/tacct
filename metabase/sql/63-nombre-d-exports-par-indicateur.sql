SELECT
  thematique AS indicateur,
  COUNT(*) AS total
FROM (
  SELECT DISTINCT ON (session_id, person_id, thematique, code_geographique)
    thematique
  FROM analytics.boutons_export_raw
  ORDER BY session_id, person_id, thematique, code_geographique, event_timestamp ASC
) uniques
GROUP BY thematique
ORDER BY total DESC
LIMIT 10;
