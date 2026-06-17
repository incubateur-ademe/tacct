-- Phase 2 (additif) : prépare le schéma `tacct.user` au chiffrement.
-- Identique à la migration jouée sur les vraies bases. Sûr/réversible.

BEGIN;

-- Élargir les colonnes chiffrées en `text` (le chiffré dépasse VarChar(255)).
ALTER TABLE tacct."user"
  ALTER COLUMN email            TYPE text,
  ALTER COLUMN username         TYPE text,
  ALTER COLUMN firstname        TYPE text,
  ALTER COLUMN lastname         TYPE text,
  ALTER COLUMN authenticated_id TYPE text;

-- Colonnes blind index (unicité posée en phase 4, après backfill).
ALTER TABLE tacct."user"
  ADD COLUMN IF NOT EXISTS authenticated_id_bidx text,
  ADD COLUMN IF NOT EXISTS email_bidx            text;

-- Idempotence du backfill : 0 = clair, 1 = chiffré.
ALTER TABLE tacct."user"
  ADD COLUMN IF NOT EXISTS encryption_version integer NOT NULL DEFAULT 0;

COMMIT;
