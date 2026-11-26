WITH comptes AS (
    SELECT id
    FROM tacct."user"
    WHERE roles NOT LIKE '%ROLE_ADMIN%'
),
reponses_periode AS (
    SELECT user_id, question_key
    FROM tacct.tacctoscope_answer
    WHERE 1 = 1
      [[ AND {{periode}} ]]
),
participants AS (
    SELECT DISTINCT rp.user_id
    FROM reponses_periode rp
    JOIN comptes c ON c.id = rp.user_id
),
criteres (ordre, slug, libelle, nb_questions) AS (
    VALUES
        (1, 'donnees-climatiques',            'Données climatiques',            5),
        (2, 'donnees-socio-economiques',      'Données socio-économiques',      5),
        (3, 'dialogue-et-partage',            'Dialogue et partage',            5),
        (4, 'priorisation-des-impacts',       'Priorisation des impacts',       3),
        (5, 'problematisation-et-conclusion', 'Problématisation et conclusion', 3)
),
reponses AS (
    SELECT split_part(rp.question_key, '.', 1) AS slug, COUNT(*) AS nb
    FROM reponses_periode rp
    JOIN participants p ON p.user_id = rp.user_id
    GROUP BY 1
)
SELECT
    c.libelle AS "Critère",
    ROUND(
        100 - COALESCE(r.nb, 0)::numeric / NULLIF(t.total * c.nb_questions, 0) * 100
    , 1) AS "Non complétion (%)"
FROM criteres c
CROSS JOIN (SELECT COUNT(*) AS total FROM participants) t
LEFT JOIN reponses r ON r.slug = c.slug
ORDER BY c.ordre;
