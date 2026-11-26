WITH comptes AS (
    SELECT id FROM tacct."user" WHERE roles NOT LIKE '%ROLE_ADMIN%'
),
participants AS (
    SELECT DISTINCT a.user_id
    FROM tacct.tacctoscope_answer a 
    JOIN comptes c ON c.id = a.user_id
),
criteres (ordre, slug, libelle) AS (
    VALUES
        (1, 'donnees-climatiques',            'Données climatiques'),
        (2, 'donnees-socio-economiques',      'Données socio-économiques'),
        (3, 'dialogue-et-partage',            'Dialogue et partage'),
        (4, 'priorisation-des-impacts',       'Priorisation des impacts'),
        (5, 'problematisation-et-conclusion', 'Problématisation et conclusion')
),
reponses AS (
    SELECT split_part(a.question_key, '.', 1) AS slug, COUNT(*) AS nb
    FROM tacct.tacctoscope_answer a
    JOIN participants p ON p.user_id = a.user_id
    GROUP BY 1
)
SELECT
    c.libelle AS "Critère",
    ROUND(
        100 - COALESCE(r.nb, 0)::numeric / NULLIF(t.total * 5, 0) * 100
    , 1) AS "Non complétion (%)"
FROM criteres c
CROSS JOIN (SELECT COUNT(*) AS total FROM participants) t
LEFT JOIN reponses r ON r.slug = c.slug
ORDER BY c.ordre;
