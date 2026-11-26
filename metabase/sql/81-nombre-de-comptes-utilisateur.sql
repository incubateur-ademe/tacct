WITH parametres AS (
    SELECT TIMESTAMPTZ '2026-08-11 00:00:00+02' AS mise_en_prod
),
comptes AS (
    SELECT id, validated, last_login_at
    FROM tacct."user"
    WHERE roles NOT LIKE '%ROLE_ADMIN%'
      [[ AND {{periode}} ]]
    -- AND id NOT IN ('id-1', 'id-2')   -- exclusions nominatives complémentaires
)
SELECT t."Indicateur", t."Valeur"
FROM (
    SELECT 1 AS ordre,
           'Comptes connectés depuis la fusion des outils' AS "Indicateur",
           COUNT(*)                                   AS "Valeur"
    FROM comptes c, parametres p
    WHERE c.last_login_at >= p.mise_en_prod

    UNION ALL
    SELECT 2, 'Comptes validés (accès à l''outil de saisie)', COUNT(*)
    FROM comptes WHERE validated

    UNION ALL
    SELECT 3, 'Comptes non validés', COUNT(*)
    FROM comptes WHERE NOT validated

    UNION ALL
    SELECT 4, 'Comptes ayant commencé le TACCToscope', COUNT(*)
    FROM comptes c
    WHERE EXISTS (
        SELECT 1 FROM tacct.tacctoscope_answer a WHERE a.user_id = c.id
    )
) t
ORDER BY t.ordre;
