-- Étape B2 — Aligne `tacct."user"` du dump sur le schéma applicatif actuel.
-- S'exécute sur la base de PRÉPARATION (Docker), jamais sur la prod.
--
-- Le dump legacy fournit 15 colonnes ; `prisma/schema.prisma` en attend 20.
-- Ce fichier ajoute les 5 manquantes et fixe les valeurs par défaut, pour que
-- `prisma db pull` sur la base finale reproduise le schéma actuel à l'identique.

BEGIN;

-- 1. Élargir en `text` les colonnes qui recevront du chiffré (AES-GCM + base64
--    dépasse largement varchar(255)).
ALTER TABLE tacct."user"
  ALTER COLUMN email            TYPE text,
  ALTER COLUMN username         TYPE text,
  ALTER COLUMN firstname        TYPE text,
  ALTER COLUMN lastname         TYPE text,
  ALTER COLUMN authenticated_id TYPE text;

-- 2. Index aveugles. L'unicité est posée en 02, après le backfill : tant que
--    les colonnes sont vides, un index unique passerait mais serait inutile.
ALTER TABLE tacct."user"
  ADD COLUMN IF NOT EXISTS authenticated_id_bidx text,
  ADD COLUMN IF NOT EXISTS email_bidx            text;

-- 3. Marqueur d'idempotence du backfill : 0 = clair, 1 = chiffré.
ALTER TABLE tacct."user"
  ADD COLUMN IF NOT EXISTS encryption_version integer NOT NULL DEFAULT 0;

-- 4. Colonnes ajoutées côté applicatif, absentes du dump legacy.
--    `recontact_email` est chiffrée (cf. USER_ENCRYPTED_FIELDS dans
--    src/lib/queries/db.ts) : `text` obligatoire, pas varchar.
ALTER TABLE tacct."user"
  ADD COLUMN IF NOT EXISTS wants_beta_features boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS recontact_email     text;

-- 5. Valeurs par défaut déclarées dans prisma/schema.prisma. pgloader ne
--    reporte pas toujours les DEFAULT MySQL : on les repose explicitement,
--    sinon `prisma db pull` produirait un schéma divergent.
ALTER TABLE tacct."user"
  ALTER COLUMN validated              SET DEFAULT false,
  ALTER COLUMN validated_terms_of_use SET DEFAULT true;

COMMIT;

-- Contrôle rapide : doit renvoyer 20 lignes.
--   SELECT column_name, data_type, is_nullable, column_default
--     FROM information_schema.columns
--    WHERE table_schema = 'tacct' AND table_name = 'user'
--    ORDER BY ordinal_position;
