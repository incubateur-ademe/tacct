SELECT 
  properties->>'$referring_domain' AS referring_domain,
  COUNT(*) AS occurrences
FROM analytics.all_pageview_raw
WHERE 1 = 1
  [[ AND {{periode}} ]]
GROUP BY properties->>'$referring_domain'
ORDER BY occurrences DESC;
