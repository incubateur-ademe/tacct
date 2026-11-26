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
FROM last;
SELECT * FROM analytics.couverture_population
ORDER BY id ASC;
