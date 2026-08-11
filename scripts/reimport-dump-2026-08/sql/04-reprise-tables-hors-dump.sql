-- Étape C3 — Récupère les 5 tables absentes du dump legacy.
-- S'exécute sur la PRODUCTION, juste après la bascule (03).
--
-- Le dump contient 42 tables, `prisma/schema.prisma` en déclare 47 pour le
-- schéma `tacct`. Les 5 manquantes :
--   - config, command_migration, command_process  → présentes dans le premier
--     import, absentes du nouveau dump ; sans FK, simple déplacement.
--   - tacctoscope_answer, tacctoscope_criterion_feedback → tables applicatives
--     avec une FK vers `user`, et une contrainte CHECK sur `value`.
--
-- On DÉPLACE les tables depuis l'ancien schéma au lieu de les recréer : le
-- DDL exact (contraintes CHECK, index, valeurs par défaut) est ainsi conservé
-- sans risque de divergence avec prisma/schema.prisma.

BEGIN;

-- 1. Tables sans dépendance : déplacement direct, données comprises.
ALTER TABLE tacct_old_2026_08_11.config            SET SCHEMA tacct;
ALTER TABLE tacct_old_2026_08_11.command_migration SET SCHEMA tacct;
ALTER TABLE tacct_old_2026_08_11.command_process   SET SCHEMA tacct;

-- 2. Tables TACCToscope : la FK pointe vers l'ancienne table `user`. On la
--    retire, on déplace, puis on la repose vers le nouveau `tacct."user"`.
ALTER TABLE tacct_old_2026_08_11.tacctoscope_answer
  DROP CONSTRAINT IF EXISTS tacctoscope_answer_user_fk;
ALTER TABLE tacct_old_2026_08_11.tacctoscope_criterion_feedback
  DROP CONSTRAINT IF EXISTS tacctoscope_criterion_feedback_user_fk;

ALTER TABLE tacct_old_2026_08_11.tacctoscope_answer             SET SCHEMA tacct;
ALTER TABLE tacct_old_2026_08_11.tacctoscope_criterion_feedback SET SCHEMA tacct;

-- 3. Purge des lignes sans compte dans le nouveau schéma.
--    Arbitré le 11/08/2026 après l'étape 0 : les SEULES lignes existantes
--    (15 réponses, 3 comptes créés dans la nouvelle app) sont des COMPTES DE
--    TEST — décision : les supprimer pour réinitialiser les deux tables.
--    Le WHERE conserve par sécurité toute ligne d'un compte présent dans le
--    dump (il n'y en avait aucune au moment de l'arbitrage).
DELETE FROM tacct.tacctoscope_answer a
 WHERE NOT EXISTS (SELECT 1 FROM tacct."user" u WHERE u.id = a.user_id);

DELETE FROM tacct.tacctoscope_criterion_feedback f
 WHERE NOT EXISTS (SELECT 1 FROM tacct."user" u WHERE u.id = f.user_id);

-- 4. Reposer les FK vers le nouveau `user`, avec les noms attendus par Prisma.
ALTER TABLE tacct.tacctoscope_answer
  ADD CONSTRAINT tacctoscope_answer_user_fk
  FOREIGN KEY (user_id) REFERENCES tacct."user"(id)
  ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE tacct.tacctoscope_criterion_feedback
  ADD CONSTRAINT tacctoscope_criterion_feedback_user_fk
  FOREIGN KEY (user_id) REFERENCES tacct."user"(id)
  ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT;

-- Contrôle : les deux tables doivent être présentes dans `tacct` et vides
-- (données de test purgées), avec leur FK posée.
--   SELECT 'answers' AS table, count(*) FROM tacct.tacctoscope_answer
--   UNION ALL
--   SELECT 'feedback', count(*) FROM tacct.tacctoscope_criterion_feedback;
