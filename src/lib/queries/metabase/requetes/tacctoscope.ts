import { Prisma } from '@/generated/client/client';
import { COLONNES_DATE, filtreDate } from '../filtres';
import type { Requetes } from '../types';

export const requetesTacctoscope: Requetes = {
  94: (p) => Prisma.sql`
    WITH sessions AS (
        SELECT
            session_id,
            max(user_id) AS user_id,
            bool_or(est_connecte = 'true') AS connectee,
            bool_or(current_url LIKE '%/tacctoscope/feuille-de-route%') AS a_vu_feuille_de_route
        FROM analytics.all_pageview_raw
        WHERE session_id <> ''
          ${filtreDate(COLONNES_DATE.pageviews, p.periode)}
        GROUP BY session_id
    )
    SELECT
        s.user_id                                           AS "Identifiant de l'utilisateur",
        count(*)                                            AS "Nombre de sessions connectées",
        count(*) FILTER (WHERE s.a_vu_feuille_de_route)     AS "Sessions avec consultation de la feuille de route",
        round(
            100.0 * count(*) FILTER (WHERE s.a_vu_feuille_de_route) / count(*),
            1
        )                                                   AS "Part des sessions avec feuille de route (%)"
    FROM sessions s
    WHERE s.connectee
      AND s.user_id IS NOT NULL
    GROUP BY s.user_id
    ORDER BY "Part des sessions avec feuille de route (%)" DESC,
             "Nombre de sessions connectées" DESC
  `,

  95: (p) => Prisma.sql`
    WITH evenements AS (
      SELECT r.event, r.event_timestamp, r.person_id, r.ressource_url, r.ressource_titre, r.ressource_tag
      FROM analytics.tacctoscope_ressources r
      WHERE r.session_id IN (
          SELECT session_id
          FROM analytics.all_pageview_raw
          WHERE 1 = 1
            ${filtreDate(COLONNES_DATE.pageviews, p.periode)}
      )
    ),
    clics AS (
      SELECT
        e.ressource_titre AS "Ressource",
        e.ressource_tag AS "Type",
        e.ressource_url AS "Lien",
        COUNT(*) AS "Clics",
        COUNT(DISTINCT e.person_id) AS "Utilisateurs uniques"
      FROM evenements e
      WHERE e.event = 'tacctoscope_ressource_consultée'
      GROUP BY e.ressource_titre, e.ressource_tag, e.ressource_url
    ),
    par_personne AS (
      SELECT
        e.ressource_url,
        e.person_id,
        MIN(e.event_timestamp) FILTER (WHERE e.event = 'tacctoscope_ressource_modale_ouverte') AS premiere_ouverture,
        MAX(e.event_timestamp) FILTER (WHERE e.event = 'tacctoscope_ressource_consultée') AS dernier_acces
      FROM evenements e
      GROUP BY e.ressource_url, e.person_id
    ),
    conversion AS (
      SELECT
        ressource_url,
        COUNT(premiere_ouverture) AS ouvertures,
        COUNT(*) FILTER (WHERE dernier_acces >= premiere_ouverture) AS acces_apres_ouverture
      FROM par_personne
      GROUP BY ressource_url
    ),
    feuille_de_route (titre, tag, url) AS (
      VALUES
        ('Base de données GASPAR', 'donnees', 'https://ecologie.data.gouv.fr/datasets/536995eea3a729239d20486b'),
        ('Climadiag Commune par Météo-France', 'donnees', 'https://meteofrance.com/climadiag-commune'),
        ('Décret n° 2026-23 du 23 janvier 2026', 'reglementation', 'https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000053399130'),
        ('Arrêté du 23 janvier 2026', 'reglementation', 'https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000053399165'),
        ('Patch 4°C', 'donnees', '/recherche-territoire-patch4'),
        ('Diagnostic de vulnérabilité de Rennes métropole', 'exemple-diagnostic', 'https://www.audiar.org/publication/environnement/climat/diagnostic-et-vulnerabilite-au-changement-climatique-a-rennes-metropole/'),
        ('Diagnostic de la CC Cœur du Pays Haut (Grand Est)', 'exemple-diagnostic', 'https://coeurdupayshaut.fr/gedExt/contenu/RESILIENCE-CLIMATIQUE/DiagnosticVulnerabiliteCPH_.pdf'),
        ('Les données de sensibilité sur le site TACCT', 'donnees', '/recherche-territoire'),
        ('Témoignage de Rennes Métropole', 'article', '/ressources/demarrer-diagnostic-vulnerabilite/realiser-diagnostic-vulnerabilite'),
        ('Exemple de guide d’entretiens', 'article', '/ressources/associer-parties-prenantes/entretien-adaptation'),
        ('Retours d’expérience sur les ateliers sensibilité', 'article', '/ressources/evaluer-impacts-changement-climatique'),
        ('Diagnostic de la CC des Baronnies en Drôme Provençale', 'exemple-diagnostic', 'https://www.cc-bdp.fr/wp-content/uploads/2024/12/202412_02b-Diagnostic-de-vulnerabilite_PCAET_CCBDP.pdf'),
        ('Diagnostic du PNR de l’Aubrac', 'exemple-diagnostic', 'https://www.parc-naturel-aubrac.fr/en-action/trajectoires-dadaptation-au-changement-climatique-des-territoires/'),
        ('Retours d’expériences sur la restitution d’un diagnostic', 'article', '/ressources/restituer-diagnostic-vulnerabilite')
    ),
    liste AS (
      SELECT * FROM clics
      UNION ALL
      SELECT f.titre, f.tag, f.url, 0, 0
      FROM feuille_de_route f
      WHERE NOT EXISTS (SELECT 1 FROM clics c WHERE c."Lien" = f.url)
    )
    SELECT
      l.*,
      ROUND(100.0 * cv.acces_apres_ouverture / NULLIF(cv.ouvertures, 0), 1) AS "Part d’accès après ouverture (%)"
    FROM liste l
    LEFT JOIN conversion cv ON cv.ressource_url = l."Lien"
    ORDER BY l."Clics" DESC
  `,

  97: (p) => Prisma.sql`
    WITH comptes AS (
        SELECT id
        FROM tacct."user"
        WHERE roles NOT LIKE '%ROLE_ADMIN%'
          ${filtreDate(COLONNES_DATE.derniereConnexion, p.periode)}
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
    ORDER BY t.ordre
  `,

  98: (p) => Prisma.sql`
    WITH comptes AS (
        SELECT id
        FROM tacct."user"
        WHERE roles NOT LIKE '%ROLE_ADMIN%'
    ),
    reponses_periode AS (
        SELECT user_id, question_key
        FROM tacct.tacctoscope_answer
        WHERE 1 = 1
          ${filtreDate(COLONNES_DATE.reponsesTacctoscope, p.periode)}
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
    ORDER BY c.ordre
  `,

  101: (p) => Prisma.sql`
    WITH comptes AS (
        SELECT id
        FROM tacct."user"
        WHERE roles NOT LIKE '%ROLE_ADMIN%'
    ),
    reponses AS (
        SELECT user_id, question_key
        FROM tacct.tacctoscope_answer
        WHERE 1 = 1
          ${filtreDate(COLONNES_DATE.reponsesTacctoscope, p.periode)}
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
    ORDER BY COALESCE(c.ordre, 99), split_part(a.question_key, '.', 2)
  `
};
