import { Prisma } from '@/generated/client/client';
import { COLONNES_DATE, filtreDate } from '../filtres';
import type { Requetes } from '../types';

export const requetesComptes: Requetes = {
  80: (p) => Prisma.sql`
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
          ${filtreDate(COLONNES_DATE.derniereConnexion, p.periode)}
    ) u
    LEFT JOIN tacct.study_office so ON so.id = u.study_office_id
    LEFT JOIN (
        SELECT user_id, COUNT(*) AS nb_reponses
        FROM tacct.tacctoscope_answer
        GROUP BY user_id
    ) a ON a.user_id = u.id
    ORDER BY "Dernière connexion" DESC NULLS LAST
  `,

  81: (p) => Prisma.sql`
    WITH parametres AS (
        SELECT TIMESTAMPTZ '2026-08-11 00:00:00+02' AS mise_en_prod
    ),
    comptes AS (
        SELECT id, validated, last_login_at
        FROM tacct."user"
        WHERE roles NOT LIKE '%ROLE_ADMIN%'
          ${filtreDate(COLONNES_DATE.derniereConnexion, p.periode)}
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
    ORDER BY t.ordre
  `,

  90: (p) => Prisma.sql`
    WITH comptes AS (
        SELECT id
        FROM tacct."user"
        WHERE roles NOT LIKE '%ROLE_ADMIN%'
          ${filtreDate(COLONNES_DATE.derniereConnexion, p.periode)}
    ),
    repondants AS (
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
    LIMIT 3
  `,

  93: (p) => Prisma.sql`
    WITH comptes AS (
        SELECT id
        FROM tacct."user"
        WHERE roles NOT LIKE '%ROLE_ADMIN%'
          ${filtreDate(COLONNES_DATE.derniereConnexion, p.periode)}
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
    ORDER BY cl.rang
  `,

  103: () => Prisma.sql`
    SELECT
      CASE profil
        WHEN 'cdm'         THEN 'Chargé·e de mission en collectivité'
        WHEN 'elu'         THEN 'Élu·e d’une collectivité'
        WHEN 'responsable' THEN 'Responsable en collectivité'
        WHEN 'be'          THEN 'Bureau d’études'
        WHEN 'entreprise'  THEN 'Entreprise'
        WHEN 'admin'       THEN 'Administration centrale'
        WHEN 'etat'        THEN 'DDT/DDTM/DREAL'
        WHEN 'autre'       THEN 'Autre'
      END AS profil,
      COUNT(*) AS nombre_comptes
    FROM tacct."user"
    WHERE profil IS NOT NULL
      AND roles NOT LIKE '%ROLE_ADMIN%'
    GROUP BY 1
    ORDER BY nombre_comptes DESC
  `
};
