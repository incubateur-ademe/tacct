# Préparer la migration du dump legacy (base JETABLE)

Reproduit, sur une pile Docker éphémère, l'opération du décommissionnement :
**dump MySQL legacy → Postgres `tacct` → chiffrement** (les MAJ faites aujourd'hui).
Sert à **valider le pipeline** — ne touche jamais les vraies bases, et utilise une
clé de chiffrement **jetable**.

## Prérequis
- Docker + Docker Compose
- `psql` et `node` sur l'hôte
- Le dump à la racine du repo : `dump-7706_tacct-2026-05-12.sql`

Toutes les commandes se lancent **depuis ce dossier** :
```bash
cd tools/legacy-dump-to-postgres
```

## Pipeline complet — cas « le schéma n'existe pas » (création)

```bash
# 1. Démarrer la pile éphémère
docker compose up -d mariadb postgres

# 2. Charger le dump dans MariaDB
docker compose exec -T mariadb mysql -uprep -pprep 7706_tacct \
  < ../../dump-7706_tacct-2026-05-12.sql

# 3. Convertir MariaDB → Postgres (schéma `tacct`, données EN CLAIR)
docker compose run --rm pgloader

# 4. Appliquer le chiffrement (= les MAJ d'aujourd'hui)
export PGPASSWORD=prep
PSQL="psql -h localhost -p 55432 -U postgres -d tacct_prep"
$PSQL -f sql/01-phase2-additif.sql      # varchar→text + bidx + encryption_version
node backfill-user-crypto.mjs --apply   # chiffre les users (clé jetable)
$PSQL -f sql/02-phase4-unicite.sql      # déplace l'unicité vers les bidx

# 5. Vérifier
$PSQL -c 'SELECT encryption_version, left(email,12) AS email,
                 (email_bidx IS NOT NULL) AS bidx
          FROM tacct."user" LIMIT 5;'
# Attendu : encryption_version = 1 | email = enc:v1:... | bidx = t
```

## Cas « le schéma existe déjà » (données seules)

Le schéma cible est déjà au format chiffré (text + bidx + unicité bidx). On ne
rejoue donc **ni la phase 2 ni la phase 4** : on **vide + recharge** seulement
les données, puis on chiffre.

1. Recharger les données converties (pgloader en mode *data only* — voir note) au
   lieu de l'étape 3, en `TRUNCATE` des tables `tacct`.
2. `node backfill-user-crypto.mjs --apply` (étape 4, backfill uniquement).

> La conversion *data only* dans un schéma existant demande une variante de
> `pgloader.load` (`WITH data only, truncate, disable triggers`). À ajouter le
> jour où on voudra valider ce cas dans le prep ; le reste (backfill) est identique.

## Reset complet (efface conteneurs + données)
```bash
docker compose down -v
```

## Notes
- **Clé jetable** : le backfill chiffre avec une clé de test par défaut. Pour
  l'opération réelle, on relance les mêmes étapes contre la vraie base avec la
  vraie `USER_ENCRYPTION_KEY` (et la vraie connexion).
- Postgres est exposé sur `localhost:55432` (user `postgres`, mdp `prep`, base `tacct_prep`).
