SELECT 
  properties->>'$el_text' AS redirection,
  COUNT(*) AS occurrences
FROM analytics.all_autocapture_raw
WHERE properties->>'$el_text' ILIKE '%CRACC%'
GROUP BY redirection
ORDER BY occurrences DESC;
