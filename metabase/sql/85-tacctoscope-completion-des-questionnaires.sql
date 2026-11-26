WITH config AS (
    SELECT 21 AS nb_questions          -- ← le seul endroit à modifier
),
comptes AS (
    SELECT id, profil FROM tacct."user" WHERE roles NOT LIKE '%ROLE_ADMIN%'
),
questionnaires AS (
    SELECT
        a.user_id,
        c.profil,
        COUNT(DISTINCT a.question_key)                     AS nb_reponses,
        COUNT(DISTINCT split_part(a.question_key, '.', 1)) AS nb_criteres,
        MIN(split_part(a.question_key, '.', 1))            AS critere_unique,
        MIN(a.created_at)                                  AS demarre_le
    FROM tacct.tacctoscope_answer a
    JOIN comptes c ON c.id = a.user_id
    GROUP BY a.user_id, c.profil
)
SELECT t."Indicateur", t."Valeur"
FROM (
    SELECT 1 AS ordre,
           'Questionnaires dont plus de la moitié des questions ont été répondues (≥ '
             || ceil((SELECT nb_questions FROM config) / 2.0)::int
             || ' / ' || (SELECT nb_questions FROM config) || ')' AS "Indicateur",
           COUNT(*)::numeric AS "Valeur"
    FROM questionnaires
    WHERE nb_reponses > (SELECT nb_questions FROM config) / 2.0

    UNION ALL
    SELECT 2, 'Questionnaires limités au critère « Données climatiques »', COUNT(*)::numeric
    FROM questionnaires
    WHERE nb_criteres = 1 AND critere_unique = 'donnees-climatiques'

    UNION ALL
    SELECT 3, 'Questionnaires limités au critère « Données climatiques » (CdM, élus et responsables)',
           COUNT(*)::numeric
    FROM questionnaires
    WHERE nb_criteres = 1
      AND critere_unique = 'donnees-climatiques'
      AND profil IN ('cdm', 'elu', 'responsable')

    UNION ALL
    SELECT 4, 'Questionnaires complétés à 100 %', COUNT(*)::numeric
    FROM questionnaires
    WHERE nb_reponses >= (SELECT nb_questions FROM config)

    UNION ALL
    SELECT 5, 'Complétion moyenne des questionnaires démarrés il y a plus d''un mois (%)',
           ROUND(AVG(nb_reponses::numeric) / (SELECT nb_questions FROM config) * 100, 1)
    FROM questionnaires WHERE demarre_le < now() - INTERVAL '1 month'

    UNION ALL
    SELECT 6, 'Nombre total de questionnaires démarrés', COUNT(*)::numeric
    FROM questionnaires
) t
ORDER BY t.ordre;
