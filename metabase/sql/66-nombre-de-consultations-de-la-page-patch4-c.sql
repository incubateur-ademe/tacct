SELECT
    DATE_TRUNC('month', event_timestamp) AS month,
    COUNT(*) AS pageviews
FROM analytics.all_pageview_raw
WHERE current_url ~ '/patch4c(\?|$)'
GROUP BY month
ORDER BY month DESC;
