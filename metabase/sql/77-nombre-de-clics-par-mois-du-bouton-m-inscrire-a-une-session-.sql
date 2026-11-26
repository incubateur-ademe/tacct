SELECT
    CASE
        WHEN DATE_TRUNC('month', event_timestamp) = '2026-04-01' AND event_timestamp < '2026-04-07' THEN 'Avril avant MEP'
        WHEN DATE_TRUNC('month', event_timestamp) = '2026-04-01' AND event_timestamp >= '2026-04-07' THEN 'Avril après MEP'
        ELSE TO_CHAR(DATE_TRUNC('month', event_timestamp), 'YYYY-MM')
    END AS month,
    COUNT(*) AS count
FROM analytics.boutons_homepage
WHERE event IN ('bouton_rejoindre_communaute_home', 'bouton_inscription_session_home')
GROUP BY month
ORDER BY MIN(event_timestamp) DESC;
