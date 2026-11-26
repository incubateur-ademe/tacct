SELECT 
    (regexp_match(current_url, 'ressources/[^/?]+/([^/?]+)'))[1] AS article_name,
    COUNT(DISTINCT session_id) AS unique_sessions
FROM analytics.all_pageview_raw
WHERE current_url ~ 'ressources/[^/?]+/[^/?]+'
  [[ AND {{periode}} ]]
GROUP BY article_name
ORDER BY unique_sessions DESC
LIMIT 10;
