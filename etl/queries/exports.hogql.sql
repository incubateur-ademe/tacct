select event, timestamp, `$session_id`, person_id, properties.code, properties.libelle, properties.thematique
from events
where
and(
    or(
        event LIKE '%export_xlsx_bouton%',
        event LIKE '%export_png_bouton%',
        event LIKE '%export_zip_bouton%'
    ),
    notIn(
        properties.$host, tuple(
            'facili-tacct-preprod.osc-fr1.scalingo.io',
            'facili-tacct.osc-secnum-fr1.scalingo.io',
            'facili-tacct-nginx.osc-secnum-fr1.scalingo.io',
            'facili-tacct.incubateur.ademe.dev',
            'tacct.incubateur.ademe.dev',
            'tacct.osc-secnum-fr1.scalingo.io',
            'tacct-preprod.osc-fr1.scalingo.io',
            'tacct-nginx.osc-secnum-fr1.scalingo.io',
            'null'
        )
    ),
)
AND timestamp < now()
AND properties.$current_url NOT LIKE '%localhost%'
-- AND properties.$current_url LIKE 'https://tacct.ademe.fr/%'
AND properties.$current_url NOT LIKE '%scalingo%'
AND properties.$current_url NOT LIKE '%secnum%'
order by timestamp desc
limit 50000
