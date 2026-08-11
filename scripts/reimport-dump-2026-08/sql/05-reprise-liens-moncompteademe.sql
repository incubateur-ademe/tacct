-- Étape C4 — Restaure les rattachements MonCompteAdeme créés depuis la MEP.
-- S'exécute sur la PRODUCTION, après 04.
--
-- POURQUOI
-- Le dump legacy porte sa propre colonne `authenticated_id` (identité de
-- l'ancienne application). Depuis la mise en production, le callback OIDC
-- (src/app/api/proconnect/callback/route.ts) écrit dans cette même colonne le
-- `sub` MonCompteAdeme des utilisateurs qui se sont connectés.
--
-- Écraser le schéma avec le dump remet donc ces comptes à l'identité legacy :
-- à leur prochaine connexion, ils ne seraient plus reconnus par
-- `authenticated_id_bidx` et repasseraient par le rattachement e-mail — voire,
-- si celui-ci échoue, par la création d'un compte vide.
--
-- Ce fichier rejoue les rattachements sur les comptes qui existent dans les
-- deux schémas. Les comptes créés de toutes pièces depuis la MEP ne sont pas
-- repris (ils sont vides par construction) mais sont listés en fin de fichier.

BEGIN;

-- 1. Inventaire avant écriture : à lire, pas à ignorer.
--    Comptes de l'ancien schéma portant un rattachement OIDC.
CREATE TEMP TABLE liens_a_reprendre AS
SELECT o.id,
       o.authenticated_id,
       o.authenticated_id_bidx,
       (n.id IS NOT NULL) AS present_dans_le_nouveau_schema
  FROM tacct_old_2026_08_11."user" o
  LEFT JOIN tacct."user" n ON n.id = o.id
 WHERE o.authenticated_id_bidx IS NOT NULL;

-- 2. Reprise pour les comptes présents des deux côtés.
--    Le WHERE sur `n.authenticated_id_bidx IS NULL` évite d'écraser une valeur
--    que le dump aurait déjà apportée.
UPDATE tacct."user" n
   SET authenticated_id      = l.authenticated_id,
       authenticated_id_bidx = l.authenticated_id_bidx,
       updated_at            = now()
  FROM liens_a_reprendre l
 WHERE n.id = l.id
   AND l.present_dans_le_nouveau_schema
   AND n.authenticated_id_bidx IS DISTINCT FROM l.authenticated_id_bidx
   AND NOT EXISTS (
     -- L'index aveugle est UNIQUE : ne pas réintroduire un doublon.
     SELECT 1 FROM tacct."user" x
      WHERE x.authenticated_id_bidx = l.authenticated_id_bidx
        AND x.id <> n.id
   );

COMMIT;

-- 3. Contrôles à lancer juste après.

-- Combien de rattachements repris, combien perdus ?
--   SELECT present_dans_le_nouveau_schema, count(*)
--     FROM liens_a_reprendre GROUP BY 1;
--   (la table temporaire disparaît à la fin de la session : lancer dans la
--    même session que le bloc ci-dessus, ou rejouer la requête du point 1)

-- Comptes créés depuis la MEP et absents du nouveau dump : ce sont les comptes
-- vides évoqués plus haut. Ils ne sont pas repris ; les lister pour savoir qui
-- devra se reconnecter, et vérifier qu'aucun ne portait de données.
--   SELECT o.id, o.validated, o.created_at,
--          (SELECT count(*) FROM tacct_old_2026_08_11.user_study us WHERE us.user_id = o.id) AS etudes
--     FROM tacct_old_2026_08_11."user" o
--     LEFT JOIN tacct."user" n ON n.id = o.id
--    WHERE n.id IS NULL
--    ORDER BY o.created_at DESC;
--
-- ⚠️ Si la colonne `etudes` est > 0 pour l'un d'eux, NE PAS poursuivre :
--    un compte porteur d'études a été perdu par la bascule.
