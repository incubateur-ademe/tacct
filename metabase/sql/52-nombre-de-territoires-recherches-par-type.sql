SELECT * FROM (
    SELECT
        type,
        COUNT(DISTINCT territory_id) AS "visités",
        CASE
            type
            WHEN 'commune' THEN 34875
            WHEN 'epci' THEN 1254
            WHEN 'petr' THEN 122
            WHEN 'pnr' THEN 59
            WHEN 'ept' THEN 11
            WHEN 'departement' THEN 103
            ELSE NULL
        END AS "Nombre total",
        ROUND(
            (COUNT(DISTINCT territory_id) * 100.0) / CASE
                type
                WHEN 'commune' THEN 34875
                WHEN 'epci' THEN 1254
                WHEN 'petr' THEN 122
                WHEN 'pnr' THEN 59
                WHEN 'ept' THEN 11
                WHEN 'departement' THEN 103
                ELSE NULL
            END,
            2
        ) AS "Part de territoires visités"
    FROM
        (
            -- Nouvelles URLs
            SELECT
                CASE
                    WHEN (regexp_match(current_url, 'type=([^&]+)')) [1] IN ('petr', 'ept') THEN (regexp_match(current_url, 'libelle=([^&]+)')) [1]
                    ELSE (regexp_match(current_url, 'code=([^&]+)')) [1]
                END AS territory_id,
                (regexp_match(current_url, 'type=([^&]+)')) [1] AS type
            FROM
                analytics.all_pageview_raw
            WHERE
                current_url LIKE '%/donnees%'
                AND current_url LIKE '%thematique%'
                AND current_url LIKE '%type%'
                AND current_url LIKE '%libelle%'
                AND regexp_match(current_url, 'type=([^&]+)') IS NOT NULL
                AND (
                    (
                        (regexp_match(current_url, 'type=([^&]+)')) [1] IN ('petr', 'ept')
                        AND regexp_match(current_url, 'libelle=([^&]+)') IS NOT NULL
                    )
                    OR (
                        (regexp_match(current_url, 'type=([^&]+)')) [1] NOT IN ('petr', 'ept')
                        AND regexp_match(current_url, 'code=([^&]+)') IS NOT NULL
                    )
                )
                [[ AND {{periode}} ]]
            UNION
            -- Anciennes URLs
            SELECT
                CASE
                    WHEN regexp_match(current_url, 'codgeo=([^&]+)') IS NOT NULL THEN (regexp_match(current_url, 'codgeo=([^&]+)')) [1]
                    ELSE (regexp_match(current_url, 'codepci=([^&]+)')) [1]
                END AS territory_id,
                CASE
                    WHEN regexp_match(current_url, 'codgeo=([^&]+)') IS NOT NULL THEN 'commune'
                    ELSE 'epci'
                END AS type
            FROM
                analytics.all_pageview_raw
            WHERE
                current_url LIKE '%/donnees%'
                AND current_url LIKE '%thematique%'
                AND (
                    current_url LIKE '%codepci%'
                    OR current_url LIKE '%codgeo%'
                )
                AND (
                    (
                        regexp_match(current_url, 'codgeo=([^&]+)') IS NOT NULL
                    )
                    OR (
                        regexp_match(current_url, 'codepci=([^&]+)') IS NOT NULL
                    )
                )
                [[ AND {{periode}} ]]
        ) AS combined
    GROUP BY
        type
    HAVING type IN ('commune', 'ept', 'epci', 'departement', 'pnr', 'petr')

    UNION ALL

    SELECT
        'epci > 20000' AS type,
        542 AS "visités",
        723 AS "Nombre total",
        74.97 AS "Part de territoires visités"
) AS final_result
ORDER BY
	"visités" DESC,
    CASE type
        WHEN 'commune' THEN 1
        WHEN 'ept' THEN 2
        WHEN 'epci' THEN 3
        WHEN 'epci > 20000' THEN 4
        WHEN 'departement' THEN 5
        WHEN 'pnr' THEN 6
        WHEN 'petr' THEN 7
    END;
