-- Étape B4 — Déplace l'unicité du clair vers les index aveugles.
-- S'exécute sur la base de PRÉPARATION, APRÈS le backfill de chiffrement.
--
-- Repris de scripts/legacy-dump-to-postgres/sql/02-phase4-unicite.sql.
-- Robuste au nommage : pgloader ne nomme pas les contraintes comme la base
-- d'origine, on cible donc par colonne et non par nom.

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

-- Porter l'unicité sur les index aveugles.
CREATE UNIQUE INDEX IF NOT EXISTS user_email_bidx_key
  ON tacct."user" (email_bidx);
CREATE UNIQUE INDEX IF NOT EXISTS user_authenticated_id_bidx_key
  ON tacct."user" (authenticated_id_bidx);

COMMIT;

-- ⚠️ Si la création échoue sur un doublon, c'est que le dump contient deux
-- comptes ayant la même adresse à la casse près : `blindIndex()` ne normalise
-- pas, mais deux adresses identiques produisent le même index. Lister avant :
--   SELECT email_bidx, count(*) FROM tacct."user"
--    WHERE email_bidx IS NOT NULL GROUP BY 1 HAVING count(*) > 1;
