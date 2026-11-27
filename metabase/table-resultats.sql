CREATE TABLE analytics.metabase_resultats (
  cle text PRIMARY KEY,
  resultat jsonb NOT NULL,
  marqueur text NOT NULL,
  calcule_le timestamptz NOT NULL DEFAULT now()
);
