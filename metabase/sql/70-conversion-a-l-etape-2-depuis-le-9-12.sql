WITH thematiques AS (
    SELECT UNNEST(ARRAY['Confort+thermique', 'Agriculture']) AS thematique_url,
           UNNEST(ARRAY['Confort thermique', 'Agriculture']) AS thematique_nom
),
etape1 AS (
    -- users uniques par thématique qui ont visité /donnees à partir du 09/12/2025
    -- UNIQUEMENT pour les thématiques spécifiées
    SELECT DISTINCT 
        p.distinct_id,
        t.thematique_nom
    FROM (
        SELECT distinct_id, current_url
        FROM analytics.all_pageview_raw
        WHERE current_url LIKE '%/donnees%'
            AND event_timestamp >= '2025-12-09 00:00:00'::timestamptz
            AND distinct_id IS NOT NULL
            AND distinct_id != ''
            [[ AND {{periode}} ]]
    ) p
    INNER JOIN thematiques t ON p.current_url LIKE '%thematique=' || t.thematique_url || '%'
),
etape2 AS (
    -- users uniques qui ont cliqué sur un bouton étape 2
    -- UNIQUEMENT pour les thématiques spécifiées
    SELECT DISTINCT 
        distinct_id,
        properties->>'thematique' AS thematique
    FROM analytics.boutons_etape2
    WHERE (properties->>'thematique' = 'Confort thermique' 
           OR properties->>'thematique' = 'Agriculture')
        AND distinct_id IS NOT NULL
        AND distinct_id != ''
        [[ AND {{periode_etape2}} ]]
),
conversion AS (
    -- users présents dans les deux étapes, en matchant sur la thématique
    SELECT 
        e1.distinct_id,
        e1.thematique_nom
    FROM etape1 e1
    INNER JOIN etape2 e2 ON e1.distinct_id = e2.distinct_id 
        AND e1.thematique_nom = e2.thematique
)
SELECT 
    e1.thematique_nom AS thematique,
    COUNT(DISTINCT e1.distinct_id) AS users_etape1,
    COUNT(DISTINCT c.distinct_id) AS users_converties,
    ROUND(
        (COUNT(DISTINCT c.distinct_id)::numeric / NULLIF(COUNT(DISTINCT e1.distinct_id), 0)) * 100, 
        2
    ) AS taux_conversion
FROM etape1 e1
LEFT JOIN conversion c ON e1.distinct_id = c.distinct_id AND e1.thematique_nom = c.thematique_nom
GROUP BY e1.thematique_nom
ORDER BY e1.thematique_nom;
