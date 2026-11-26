SELECT COUNT(DISTINCT person_id) AS unique_person
FROM analytics.all_pageview_raw
WHERE person_id IS NOT NULL AND person_id <> '';
