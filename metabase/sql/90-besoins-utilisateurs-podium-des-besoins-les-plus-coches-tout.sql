WITH comptes AS (
    SELECT id
    FROM tacct."user"
    WHERE roles NOT LIKE '%ROLE_ADMIN%'
      [[ AND {{periode}} ]]
),
repondants AS (
    -- dénominateur : utilisateurs non-admin ayant renseigné au moins un besoin
    SELECT COUNT(DISTINCT ub.user_id) AS n
    FROM tacct.user_besoin ub
    JOIN comptes c ON c.id = ub.user_id
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
)
SELECT
    ROW_NUMBER() OVER (ORDER BY COUNT(*) DESC, ub.besoin)              AS "Position",
    COALESCE(b.libelle, ub.besoin)                                    AS "Proposition",
    COUNT(*)                                                          AS "Suffrages",
    ROUND(100.0 * COUNT(DISTINCT ub.user_id) / NULLIF(r.n, 0), 1)     AS "Part (%)"
FROM tacct.user_besoin ub
JOIN comptes c ON c.id = ub.user_id
LEFT JOIN besoins b ON b.valeur = ub.besoin
CROSS JOIN repondants r
GROUP BY ub.besoin, b.libelle, r.n
ORDER BY COUNT(*) DESC, ub.besoin
LIMIT 3;
