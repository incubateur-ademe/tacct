WITH evenements AS (
  SELECT r.event, r.event_timestamp, r.person_id, r.ressource_url, r.ressource_titre, r.ressource_tag
  FROM analytics.tacctoscope_ressources r
  WHERE r.session_id IN (
      SELECT session_id
      FROM analytics.all_pageview_raw
      WHERE 1 = 1
        [[ AND {{periode}} ]]
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
ORDER BY l."Clics" DESC;
