SELECT
    u.id                                        AS "Identifiant",
    u.territoire_code                           AS "Code territoire",
    u.territoire_libelle                        AS "Nom territoire",
    u.validated                                 AS "Compte validé",
    COALESCE(a.nb_reponses, 0)                  AS "Réponses TACCToscope",
    u.created_at                                AS "Création du compte",
    u.last_login_at                             AS "Dernière connexion",
    u.login_count                               AS "Connexions totales",
    u.workspace_last_login_at                   AS "Dernière connexion à l'outil de saisie",
    u.workspace_login_count                     AS "Connexions totales à l'outil de saisie"
FROM (
    SELECT *
    FROM tacct."user"
    WHERE roles NOT LIKE '%ROLE_ADMIN%'
      [[ AND {{periode}} ]]
) u
LEFT JOIN tacct.study_office so ON so.id = u.study_office_id
LEFT JOIN (
    SELECT user_id, COUNT(*) AS nb_reponses
    FROM tacct.tacctoscope_answer
    GROUP BY user_id
) a ON a.user_id = u.id
ORDER BY "Dernière connexion" DESC NULLS LAST;
