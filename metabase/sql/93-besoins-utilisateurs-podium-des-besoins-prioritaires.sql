WITH comptes AS (
    SELECT id
    FROM tacct."user"
    WHERE roles NOT LIKE '%ROLE_ADMIN%'
      [[ AND {{periode}} ]]
),
besoins (valeur, libelle) AS (
    VALUES
        ('data',        'Accéder à des données fiables sur mon territoire'),
        ('mobiliser',   'Mobiliser les acteurs de mon territoire'),
        ('diagnostic',  'Réviser le diagnostic de vulnérabilité'),
        ('method',      'Structurer ma démarche d’adaptation'),
        ('inspire',     'M’inspirer de retours d’expérience'),
        ('competences', 'Monter en compétences sur l’adaptation au changement climatique'),
        ('ressources',  'Trouver des ressources pour mener mes entretiens ou ateliers'),
        ('autre',       'Autre')
),
classement AS (
    SELECT
        ub.rang,
        ub.besoin,
        COUNT(*)                                  AS n,
        SUM(COUNT(*)) OVER (PARTITION BY ub.rang) AS total_rang,
        ROW_NUMBER() OVER (PARTITION BY ub.rang
                           ORDER BY COUNT(*) DESC, ub.besoin) AS rk
    FROM tacct.user_besoin ub
    JOIN comptes c ON c.id = ub.user_id
    WHERE ub.rang BETWEEN 1 AND 3
    GROUP BY ub.rang, ub.besoin
)
SELECT
    cl.rang                                            AS "Position",
    COALESCE(b.libelle, cl.besoin)                     AS "Proposition",
    cl.n                                               AS "Suffrages",
    ROUND(100.0 * cl.n / NULLIF(cl.total_rang, 0), 1)  AS "Part (%)"
FROM classement cl
LEFT JOIN besoins b ON b.valeur = cl.besoin
WHERE cl.rk = 1
ORDER BY cl.rang;
