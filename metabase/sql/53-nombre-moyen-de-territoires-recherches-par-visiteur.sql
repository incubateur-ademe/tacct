SELECT AVG(unique_territories_per_user) AS moyenne_territoire_par_utilisateur
FROM (
    SELECT 
        person_id, 
        COUNT(DISTINCT territory_id) AS unique_territories_per_user
    FROM (
        -- Nouvelles URLs
        SELECT 
            person_id,
            CASE 
                WHEN (regexp_match(current_url, 'type=([^&]+)'))[1] IN ('petr', 'ept') 
                THEN (regexp_match(current_url, 'libelle=([^&]+)'))[1]
                ELSE (regexp_match(current_url, 'code=([^&]+)'))[1]
            END AS territory_id
        FROM analytics.all_pageview_raw
        WHERE current_url LIKE '%/donnees%'
          AND current_url LIKE '%thematique%'
          AND current_url LIKE '%type%'
          AND current_url LIKE '%libelle%'
          AND regexp_match(current_url, 'type=([^&]+)') IS NOT NULL
          AND (
              ( (regexp_match(current_url, 'type=([^&]+)'))[1] IN ('petr', 'ept') 
                AND regexp_match(current_url, 'libelle=([^&]+)') IS NOT NULL )
              OR
              ( (regexp_match(current_url, 'type=([^&]+)'))[1] NOT IN ('petr', 'ept') 
                AND regexp_match(current_url, 'code=([^&]+)') IS NOT NULL )
          )
          [[ AND {{periode}} ]]
        
        UNION
        
        -- Anciennes URLs
        SELECT 
            person_id,
            CASE 
                WHEN regexp_match(current_url, 'codgeo=([^&]+)') IS NOT NULL 
                THEN (regexp_match(current_url, 'codgeo=([^&]+)'))[1]
                ELSE (regexp_match(current_url, 'codepci=([^&]+)'))[1]
            END AS territory_id
        FROM analytics.all_pageview_raw
        WHERE current_url LIKE '%/donnees%'
          AND current_url LIKE '%thematique%'
          AND (current_url LIKE '%codepci%' OR current_url LIKE '%codgeo%')
          AND (
              (regexp_match(current_url, 'codgeo=([^&]+)') IS NOT NULL)
              OR
              (regexp_match(current_url, 'codepci=([^&]+)') IS NOT NULL)
          )
          [[ AND {{periode}} ]]
    ) AS searches
    GROUP BY person_id
) AS per_user;
