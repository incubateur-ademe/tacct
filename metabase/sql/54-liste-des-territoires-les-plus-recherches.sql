SELECT 
    code_geographique,
    COUNT(*) AS nombre_total,
    MAX(libelle_geographique) AS libelle_geographique
FROM (
    -- Nouvelles URLs
    SELECT 
        CASE 
            WHEN (regexp_match(current_url, 'type=([^&]+)'))[1] IN ('petr', 'ept') 
            THEN (regexp_match(current_url, 'libelle=([^&]+)'))[1]
            ELSE (regexp_match(current_url, 'code=([^&]+)'))[1]
        END AS code_geographique,
        (
            SELECT string_agg(
                CASE WHEN m[1] IS NOT NULL 
                    THEN convert_from(decode(replace(m[1], '%',''), 'hex'), 'UTF8') ELSE m[2]
                    END, '' ORDER BY ord
                )
            FROM regexp_matches(replace(
                (regexp_match(current_url, 'libelle=([^&]+)'))[1], '+', ' '), '((?:%[0-9A-Fa-f]{2})+)|([^%]+)', 'g'
            ) WITH ORDINALITY AS q(m, ord)
        ) AS libelle_geographique
    FROM analytics.all_pageview_raw
    WHERE current_url LIKE '%/donnees%'
      [[ AND {{periode}} ]]
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
    
    UNION ALL
    -- Anciennes URLs
    SELECT 
        CASE 
            WHEN regexp_match(current_url, 'codgeo=([^&]+)') IS NOT NULL 
            THEN (regexp_match(current_url, 'codgeo=([^&]+)'))[1]
            ELSE (regexp_match(current_url, 'codepci=([^&]+)'))[1]
        END AS code_geographique,
        NULL AS libelle_geographique
    FROM analytics.all_pageview_raw
    WHERE current_url LIKE '%/donnees%'
      [[ AND {{periode}} ]]
      AND current_url LIKE '%thematique%'
      AND (current_url LIKE '%codepci%' OR current_url LIKE '%codgeo%')
      AND (
          (regexp_match(current_url, 'codgeo=([^&]+)') IS NOT NULL)
          OR
          (regexp_match(current_url, 'codepci=([^&]+)') IS NOT NULL)
      )
) AS searches
GROUP BY code_geographique
ORDER BY nombre_total DESC;
