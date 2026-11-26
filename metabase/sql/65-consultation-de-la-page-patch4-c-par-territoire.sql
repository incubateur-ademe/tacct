SELECT
    (regexp_match(current_url, '[?&]code=([^&]+)'))[1]      AS code,
    replace((regexp_match(current_url, '[?&]libelle=([^&]+)'))[1], '%20', ' ')
                                                          AS libelle,
    (regexp_match(current_url, '[?&]type=([^&]+)'))[1]      AS type,
    COUNT(*)                                               AS nombre_consultations
FROM analytics.all_pageview_raw
WHERE current_url ~ '/patch4c(\?|$)'
	[[ AND {{periode}} ]]
GROUP BY code, libelle, type
ORDER BY nombre_consultations DESC;
