WITH comptes AS (
    SELECT id
    FROM tacct."user"
    WHERE roles NOT LIKE '%ROLE_ADMIN%'
),
reponses AS (
    SELECT user_id, question_key
    FROM tacct.tacctoscope_answer
    WHERE 1 = 1
      [[ AND {{periode}} ]]
),
criteres (slug, titre, ordre) AS (
    VALUES
        ('donnees-climatiques',            'Données climatiques',            1),
        ('donnees-socio-economiques',      'Données socio-économiques',      2),
        ('dialogue-et-partage',            'Dialogue et partage',            3),
        ('priorisation-des-impacts',       'Priorisation des impacts',       4),
        ('problematisation-et-conclusion', 'Problématisation et conclusion', 5)
)
SELECT
    upper(split_part(a.question_key, '.', 2))
        || ' ' || COALESCE(c.titre, split_part(a.question_key, '.', 1)) AS "Question",
    COUNT(*)                                                            AS "Occurrences"
FROM reponses a
JOIN comptes cu ON cu.id = a.user_id
LEFT JOIN criteres c ON c.slug = split_part(a.question_key, '.', 1)
GROUP BY COALESCE(c.ordre, 99),
         COALESCE(c.titre, split_part(a.question_key, '.', 1)),
         split_part(a.question_key, '.', 2)
ORDER BY COALESCE(c.ordre, 99), split_part(a.question_key, '.', 2);
