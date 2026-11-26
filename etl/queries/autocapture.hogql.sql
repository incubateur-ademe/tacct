select timestamp, properties, distinct_id, `$session_id`, properties.$current_url, person_id
from events
where
and(
    event = '$autocapture',
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
