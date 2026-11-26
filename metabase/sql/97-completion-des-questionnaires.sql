WITH comptes AS (
    SELECT id
    FROM tacct."user"
    WHERE roles NOT LIKE '%ROLE_ADMIN%'
      [[ AND {{periode}} ]]
),
questionnaires AS (
    SELECT
        a.user_id,
        COUNT(DISTINCT a.question_key)                     AS nb_reponses,
        COUNT(DISTINCT split_part(a.question_key, '.', 1)) AS nb_criteres,
        MIN(split_part(a.question_key, '.', 1))            AS critere_unique,
        MIN(a.created_at)                                  AS demarre_le
    FROM tacct.tacctoscope_answer a
    JOIN comptes c ON c.id = a.user_id
    GROUP BY a.user_id
)
SELECT t."Indicateur", t."Valeur"
FROM (
    SELECT 1 AS ordre,
           'Questionnaires limités au critère « Données climatiques »' AS "Indicateur",
           COUNT(*)::numeric AS "Valeur"
    FROM questionnaires
    WHERE nb_criteres = 1 AND critere_unique = 'donnees-climatiques'

    UNION ALL
    SELECT 2, 'Questionnaires complétés à 100 %', COUNT(*)::numeric
    FROM questionnaires WHERE nb_reponses >= 25

    UNION ALL
    SELECT 3, 'Complétion moyenne des questionnaires démarrés il y a plus d''un mois (%)',
           ROUND(AVG(nb_reponses::numeric) / 25 * 100, 1)
    FROM questionnaires WHERE demarre_le < now() - INTERVAL '1 month'
) t
ORDER BY t.ordre;
