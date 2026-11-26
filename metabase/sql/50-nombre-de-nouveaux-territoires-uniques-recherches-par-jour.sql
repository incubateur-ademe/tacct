SELECT
  DATE (min_timestamp) AS date,
  ARRAY_AGG(
    territory_id
    ORDER BY
      territory_id
  ) AS territoires,
  COUNT(*) AS nombre
FROM
  (
    -- Nouvelles URLs
    SELECT
	replace(
      replace(
        replace(
          replace(
            replace(
              replace(
                replace(
                  (regexp_match(current_url, 'libelle=([^&]+)')) [1],
                  '+',
                  ' '
                ),
                '%C3%A9',
                'é'
              ),
              '%C3%A8',
              'è'
            ),
            '%27',
            ''''
          ),
          '%C5%93',
          'oe'
        ),
        '%C3%B4',
        'ô'
      ),
	  '%C3%A0',
	  'à'
	  ) AS territory_id,
      MIN(event_timestamp) AS min_timestamp
    FROM
      analytics.all_pageview_raw
    WHERE
      current_url LIKE '%/donnees%'
      AND current_url LIKE '%thematique%'
      AND current_url LIKE '%type%'
      AND current_url LIKE '%libelle%'
      AND current_url LIKE '%code%'
      AND regexp_match(current_url, 'type=([^&]+)') IS NOT NULL
      AND regexp_match(current_url, 'libelle=([^&]+)') IS NOT NULL
      AND regexp_match(current_url, 'code=([^&]+)') IS NOT NULL
    GROUP BY
      replace(
        replace(
          replace(
            replace(
              (regexp_match(current_url, 'libelle=([^&]+)')) [1],
              '+',
              ' '
            ),
            '%C3%A9',
            'é'
          ),
          '%C3%A8',
          'è'
        ),
        '%27',
        ''''
      )
    UNION
    -- Anciennes URLs
    SELECT
      CASE
        WHEN regexp_match(current_url, 'codgeo=([^&]+)') IS NOT NULL THEN (regexp_match(current_url, 'codgeo=([^&]+)')) [1]
        ELSE (regexp_match(current_url, 'codepci=([^&]+)')) [1]
      END AS territory_id,
      MIN(event_timestamp) AS min_timestamp
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
    GROUP BY
      CASE
        WHEN regexp_match(current_url, 'codgeo=([^&]+)') IS NOT NULL THEN (regexp_match(current_url, 'codgeo=([^&]+)')) [1]
        ELSE (regexp_match(current_url, 'codepci=([^&]+)')) [1]
      END
  ) AS combined_sub
GROUP BY
  DATE (min_timestamp)
ORDER BY
  date DESC;
