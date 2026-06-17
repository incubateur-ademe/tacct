-- Phase 4 : déplace l'unicité du clair vers les blind index.
-- PRÉREQUIS : backfill terminé (email_bidx / authenticated_id_bidx remplis).
--
-- Robuste au nommage : pgloader ne nomme pas les contraintes comme la vraie
-- base. On retire donc TOUTE contrainte/index unique mono-colonne portant sur
-- `email` ou `authenticated_id`, quel que soit son nom.

BEGIN;

DO $$
DECLARE
  r record;
BEGIN
  -- Contraintes UNIQUE mono-colonne sur email / authenticated_id
  FOR r IN
    SELECT con.conname
    FROM pg_constraint con
    JOIN pg_attribute a
      ON a.attrelid = con.conrelid AND a.attnum = con.conkey[1]
    WHERE con.conrelid = 'tacct."user"'::regclass
      AND con.contype = 'u'
      AND cardinality(con.conkey) = 1
      AND a.attname IN ('email', 'authenticated_id')
  LOOP
    EXECUTE format('ALTER TABLE tacct."user" DROP CONSTRAINT %I', r.conname);
  END LOOP;

  -- Index UNIQUE mono-colonne (hors contrainte, hors PK) sur ces colonnes
  FOR r IN
    SELECT i.relname
    FROM pg_index x
    JOIN pg_class i ON i.oid = x.indexrelid
    JOIN pg_attribute a
      ON a.attrelid = x.indrelid AND a.attnum = x.indkey[0]
    WHERE x.indrelid = 'tacct."user"'::regclass
      AND x.indisunique
      AND NOT x.indisprimary
      AND x.indnkeyatts = 1
      AND a.attname IN ('email', 'authenticated_id')
      AND NOT EXISTS (
        SELECT 1 FROM pg_constraint c WHERE c.conindid = x.indexrelid
      )
  LOOP
    EXECUTE format('DROP INDEX tacct.%I', r.relname);
  END LOOP;
END $$;

-- Porter l'unicité sur les blind index.
CREATE UNIQUE INDEX IF NOT EXISTS user_email_bidx_key
  ON tacct."user" (email_bidx);
CREATE UNIQUE INDEX IF NOT EXISTS user_authenticated_id_bidx_key
  ON tacct."user" (authenticated_id_bidx);

COMMIT;
