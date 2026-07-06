-- Module feedback TACCToscope
-- À exécuter sur Postgres, puis : prisma db pull && prisma generate
-- Script idempotent : ré-exécutable sans risque, aucune perte de données.

-- ============================================================
-- 1. Feedback critère : commentaire + vote optionnels, envois multiples
-- ============================================================

-- Le vote oui/non devient optionnel (commentaire seul possible)
ALTER TABLE tacct.tacctoscope_criterion_feedback
  ALTER COLUMN is_useful DROP NOT NULL;

-- Commentaire libre (en clair, illimité)
ALTER TABLE tacct.tacctoscope_criterion_feedback
  ADD COLUMN IF NOT EXISTS comment text;

-- Envois multiples : on retire l'unicité (user, critère).
-- Côté Prisma @@unique => contrainte (pas un simple index) => DROP CONSTRAINT.
ALTER TABLE tacct.tacctoscope_criterion_feedback
  DROP CONSTRAINT IF EXISTS tacctoscope_criterion_feedback_user_criterion_unique;

-- Au moins un des deux renseignés (vote OU commentaire)
ALTER TABLE tacct.tacctoscope_criterion_feedback
  DROP CONSTRAINT IF EXISTS tacctoscope_feedback_vote_or_comment;
ALTER TABLE tacct.tacctoscope_criterion_feedback
  ADD CONSTRAINT tacctoscope_feedback_vote_or_comment
  CHECK (is_useful IS NOT NULL OR comment IS NOT NULL);

-- ============================================================
-- 2. Opt-in recontact (préférence globale par utilisateur)
-- ============================================================

-- Souhaite tester les nouveautés
ALTER TABLE tacct."user"
  ADD COLUMN IF NOT EXISTS wants_beta_features boolean NOT NULL DEFAULT false;

-- Email de recontact, chiffré (peut différer du mail du compte)
ALTER TABLE tacct."user"
  ADD COLUMN IF NOT EXISTS recontact_email text;
