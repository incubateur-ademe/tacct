WITH sessions AS (
    SELECT
        session_id,
        max(properties ->> 'user_id') AS user_id,
        bool_or(properties ->> 'est_connecte' = 'true') AS connectee,
        bool_or(current_url LIKE '%/tacctoscope/feuille-de-route%') AS a_vu_feuille_de_route
    FROM analytics.all_pageview_raw
    WHERE session_id <> ''
      [[ AND {{periode}} ]]
    GROUP BY session_id
)
SELECT
    s.user_id                                           AS "Identifiant de l'utilisateur",
    count(*)                                            AS "Nombre de sessions connectées",
    count(*) FILTER (WHERE s.a_vu_feuille_de_route)     AS "Sessions avec consultation de la feuille de route",
    round(
        100.0 * count(*) FILTER (WHERE s.a_vu_feuille_de_route) / count(*),
        1
    )                                                   AS "Part des sessions avec feuille de route (%)"
FROM sessions s
WHERE s.connectee
  AND s.user_id IS NOT NULL
GROUP BY s.user_id
ORDER BY "Part des sessions avec feuille de route (%)" DESC,
         "Nombre de sessions connectées" DESC;
