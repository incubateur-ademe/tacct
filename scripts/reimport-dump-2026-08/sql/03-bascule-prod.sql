-- Étape C2 — Bascule du schéma sur la PRODUCTION.
--
-- Prérequis : le schéma `tacct_new` a été restauré en prod et vérifié
-- (verifier-schema.mjs sur `tacct_new` doit être vert).
--
-- Rien n'est supprimé : l'ancien schéma est renommé, pas détruit. Le retour
-- arrière est le même bloc avec les deux noms inversés (voir en bas).
--
-- Les deux renommages sont dans une seule transaction : à aucun moment il
-- n'existe zéro ni deux schémas `tacct`.

BEGIN;

-- Verrou explicite : refuse de basculer si `tacct_new` n'a pas été préparé.
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.schemata WHERE schema_name = 'tacct_new') THEN
    RAISE EXCEPTION 'Schéma tacct_new absent : restaurer le dump préparé avant de basculer.';
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.schemata WHERE schema_name = 'tacct_old_2026_08_11') THEN
    RAISE EXCEPTION 'Schéma tacct_old_2026_08_11 déjà présent : bascule déjà jouée ?';
  END IF;
END $$;

ALTER SCHEMA tacct     RENAME TO tacct_old_2026_08_11;
ALTER SCHEMA tacct_new RENAME TO tacct;

COMMIT;

-- Après COMMIT, l'application lit déjà le nouveau schéma. Enchaîner sans
-- attendre sur 04 puis 05 : tant qu'ils ne sont pas passés, les tables
-- applicatives (TACCToscope) et les rattachements MonCompteAdeme manquent.

-- ─────────────────────────────────────────────────────────────────────────
-- RETOUR ARRIÈRE (tant que tacct_old_2026_08_11 existe)
--
--   BEGIN;
--   ALTER SCHEMA tacct                RENAME TO tacct_new;
--   ALTER SCHEMA tacct_old_2026_08_11 RENAME TO tacct;
--   COMMIT;
--
-- SUPPRESSION DÉFINITIVE de l'ancien schéma — seulement après plusieurs jours
-- d'exploitation nominale, et avec le pg_dump de l'étape A conservé ailleurs :
--
--   DROP SCHEMA tacct_old_2026_08_11 CASCADE;
-- ─────────────────────────────────────────────────────────────────────────
