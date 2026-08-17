# PostHog → PostgreSQL ETL (Scalingo) — Cheat Sheet

> Tutoriel compact : **une commande** (+ une ligne pour dire ce qu’elle fait).

Exemple avec la table all_pageview_raw

---

## 1) Variables d’environnement (Scalingo)

```
scalingo --app <APP> env-set POSTHOG_HOST=https://eu.posthog.com POSTHOG_PROJECT_ID=<ID> POSTHOG_API_KEY=<KEY> DATABASE_URL=<PG_URL>
```

Configure les variables d’environnement nécessaires (PostHog & Postgres).

---

## 2) PostgreSQL — Table cible

```sql
CREATE TABLE IF NOT EXISTS analytics.all_pageview_raw (
  id               BIGSERIAL PRIMARY KEY,
  event_timestamp  timestamptz NOT NULL,
  properties       jsonb,
  distinct_id      text,
  session_id       text,
  current_url      text,
  person_id        text,
  ingested_at      timestamptz NOT NULL DEFAULT now()
);
```

Crée la table de destination pour les événements PostHog.

---

## 3) PostgreSQL — Normalisation + contrainte d’unicité

```sql
UPDATE analytics.all_pageview_raw
SET distinct_id = COALESCE(distinct_id, ''),
    session_id  = COALESCE(session_id,  ''),
    current_url = COALESCE(current_url, ''),
    person_id   = COALESCE(person_id,   '');
```

Normalise les valeurs NULL en chaînes vides pour les colonnes de la clé.

```sql
ALTER TABLE analytics.all_pageview_raw
ADD CONSTRAINT uq_all_pageview_raw_natural
UNIQUE (event_timestamp, distinct_id, session_id, current_url, person_id);
```

Ajoute une contrainte unique pour empêcher les doublons à l’insert.

---

## 4) Build du script (esbuild → bundle autonome)

```bash
pnpm i -D esbuild && pnpm i pg
```

Installe esbuild (dev) et le client Postgres.

```bash
pnpx esbuild run.mjs --bundle --platform=node --format=cjs --outfile=dist/etl.js
```

Construit le bundle unique `dist/etl.js` exécutable sans node_modules.

---

## 5) Exécution manuelle — Local

```bash
DATABASE_URL='<PG_URL>' POSTHOG_PROJECT_ID='<ID>' POSTHOG_API_KEY='<KEY>' node dist/etl.js
```

Lance le job localement avec les variables d’env nécessaires.

---

## 6) Exécution manuelle — Scalingo

```bash
scalingo --app <APP> run "node dist/etl.js"
```

Exécute le bundle déjà présent dans le slug (si `dist/etl.js` est commité/généré).

```bash
scalingo --app <APP> run --build "pnpx esbuild run.mjs --bundle --platform=node --format=cjs --outfile=dist/etl.js && node dist/etl.js"
```

(Re)build et exécute directement dans le conteneur de build (utile si node_modules est ignoré).

---

## 7) Planification — Scheduler (cron)

```json
{
    "jobs": [
        {
            "command": "0 2 * * * pnpm run etl:daily" 
        }
    ]
}
```

`cron.json` : planifie un run quotidien (02:00 UTC), build + exécution.

```bash
scalingo --app <APP> cron-tasks
```

Liste les tâches planifiées de l’application.

---

## 8) Logs & suivi

```bash
scalingo --app <APP> logs -f
```

Suis les logs en temps réel pour vérifier l’exécution et les insertions.

---

## 9) Vérifications SQL rapides

```sql
SELECT COUNT(*) AS total, MAX(event_timestamp) AS max_ts
FROM analytics.all_pageview_raw;
```

Contrôle le volume total et le dernier timestamp ingéré.

```sql
SELECT COUNT(*) - COUNT(DISTINCT event_timestamp, distinct_id, session_id, current_url, person_id) AS dupes
FROM analytics.all_pageview_raw;
```

Détecte d’éventuels doublons (devrait être 0 grâce à la contrainte + ON CONFLICT).

---

## 10) Relance idempotente

```bash
# Relancer le job (ne réinsère pas les mêmes lignes)
scalingo --app <APP> run "node dist/etl.js"
```

Vérifie que la contrainte unique + ON CONFLICT empêchent les doublons.

---

## 11) Exclure son navigateur des statistiques

```text
https://tacct.ademe.fr/?exclure_navigateur=1
```

Coupe tout envoi vers PostHog depuis ce navigateur (cookie d'un an + miroir localStorage). À faire **une fois par navigateur et par appareil**.

```text
https://tacct.ademe.fr/?exclure_navigateur=0
```

Réactive le suivi.

```text
https://tacct.ademe.fr/statistiques
```

Affiche un bandeau orange si le navigateur est bien exclu. À vérifier de temps en temps : le flag peut sauter silencieusement (vidage des données du site, navigation privée, nouveau profil).

Détail du mécanisme : voir [explications/posthog_extract_automatisation.md](../explications/posthog_extract_automatisation.md#10-exclusion-des-navigateurs-internes).
