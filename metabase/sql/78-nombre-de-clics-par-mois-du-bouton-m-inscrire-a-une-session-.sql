SELECT
    DATE_TRUNC('month', event_timestamp) AS month,
    COUNT(*) AS count
FROM analytics.boutons_homepage
WHERE event IN ('bouton_rejoindre_communaute_home', 'bouton_inscription_session_home')
GROUP BY month
ORDER BY month DESC;
