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
ORDER BY month_start;
