# Réimport du dump legacy du 11/08/2026 dans le schéma `tacct` de production

Remplace intégralement le contenu du schéma `tacct` par le nouveau dump
`prod-tacct_2026_08_11_01_46.sql` (58,8 Mo, mysqldump MariaDB), tout en
conservant **exactement** la forme de schéma décrite par `prisma/schema.prisma`.

> **Aucune commande de ce fichier ne doit être lancée par un agent.**
> Toutes les opérations base de données sont exécutées manuellement.

---

## 1. Ce que le dump ne couvre pas

Ces quatre écarts sont la raison d'être de ce dossier ; rejouer tel quel
`scripts/legacy-dump-to-postgres/` produirait un schéma non conforme.

### 1.1 Cinq tables manquantes

Vérifié sur le fichier : le dump contient **42 tables** et **1247 comptes
`user`** ; les 42 tables existent toutes dans `prisma/schema.prisma` (aucune
table nouvelle côté legacy). Prisma en déclare **47** pour le schéma `tacct` :

| Table absente du dump | Origine | Traitement |
| --- | --- | --- |
| `config` | premier import, retirée du dump depuis | déplacée depuis l'ancien schéma (04) |
| `command_migration` | idem | idem |
| `command_process` | idem | idem |
| `tacctoscope_answer` | applicative (TACCToscope) | déplacée, données de test purgées + FK reposée (04) |
| `tacctoscope_criterion_feedback` | applicative | idem |

Elles sont **déplacées** depuis l'ancien schéma plutôt que recréées : le DDL
exact (contrainte `CHECK` sur `tacctoscope_answer.value`, index, valeurs par
défaut) est ainsi conservé sans risque de divergence.

### 1.2 Cinq colonnes manquantes sur `user`

Le dump fournit 15 colonnes (vérifié sur le `CREATE TABLE` du fichier),
Prisma en attend 20. Manquent :
`authenticated_id_bidx`, `email_bidx`, `encryption_version`,
`wants_beta_features`, `recontact_email`.

⚠️ `scripts/legacy-dump-to-postgres/sql/01-phase2-additif.sql` **n'ajoute que
les trois premières** — il date d'avant ces deux colonnes. `sql/01-additif-user.sql`
de ce dossier le remplace.

### 1.3 Le chiffrement

Le dump est en clair. Les colonnes `email`, `username`, `firstname`,
`lastname`, `authenticated_id` (et `recontact_email`, vide ici) sont chiffrées
en AES-256-GCM par l'application, avec un index aveugle HMAC pour les
recherches. `backfill-user-crypto.mjs` applique ce chiffrement **avec la clé
de production** — sans quoi l'application ne pourra rien déchiffrer.

### 1.4 Les noms d'index dépendent de l'import

Les noms d'index de `prisma/schema.prisma` (`idx_16589_primary`,
`idx_16589_idx_8d93d649131a4f72`, …) viennent du **premier** passage pgloader :
ils encodent les OID Postgres attribués à ce moment-là. Un nouveau passage
attribue d'autres OID, donc d'autres noms — structure identique, mais
`prisma db pull` produirait un diff non vide.

`renommer-index.mjs` réapparie chaque index/contrainte par sa signature
(table + colonnes + type) et le renomme au nom attendu (B4bis). Son mode
DRY-RUN sert aussi de vérificateur de noms, y compris sur la prod.

---

## 2. Deux décisions à prendre avant de commencer

### 2.1 Les rattachements MonCompteAdeme créés depuis la MEP

Le callback OIDC écrit le `sub` MonCompteAdeme dans `user.authenticated_id`.
Le dump porte la valeur *legacy* de cette colonne. La bascule écrase donc les
rattachements créés depuis la mise en production d'hier.

`sql/05-reprise-liens-moncompteademe.sql` les rejoue depuis l'ancien schéma
pour les comptes présents des deux côtés. Les comptes **créés de toutes
pièces** depuis la MEP ne sont pas repris — ce sont les comptes vides évoqués
plus haut, leurs titulaires se reconnecteront.

### 2.2 Les données TACCToscope orphelines — ✅ tranché le 11/08/2026

Si un compte disparaît du nouveau dump, ses réponses TACCToscope n'ont plus de
`user_id` valide. La question se tranche AVANT de commencer, à l'étape 0
ci-dessous, qui croise les `user_id` des deux tables TACCToscope de prod avec
les 1247 comptes du dump.

**Résultat de l'étape 0 et arbitrage** : les seules lignes présentes
(15 réponses dans `tacctoscope_answer`, 0 feedback) appartiennent à 3 comptes
créés dans la nouvelle application, absents du dump — identifiés comme
**comptes de test**. Décision : **supprimer** ces lignes pour réinitialiser
les deux tables ; `sql/04` fait cette purge après le déplacement des tables.
(Rejouer l'étape 0 avant la bascule pour confirmer que rien de réel n'est
apparu entre-temps.)

---

## 3. Déroulé

### Étape 0 — La donnée TACCToscope est-elle rattachée à des comptes du dump ?

`sql/00-verification-tacctoscope.sql` est généré depuis le dump (il embarque
les 1247 ids `user`). Il est en **lecture seule** (table temporaire de session
uniquement) et s'exécute sur la production :

```bash
cd scripts/reimport-dump-2026-08
node generer-verification-tacctoscope.mjs      # (re)génère le SQL depuis le dump
psql "$SCALINGO_POSTGRESQL_URL" -f sql/00-verification-tacctoscope.sql
```

Lecture du résultat :

- `orphelines_apres_bascule = 0` sur les deux lignes → aucune réponse ni
  feedback ne sera orphelin, dérouler la suite sans arbitrage.
- Sinon, le second tableau liste les comptes concernés absents du dump
  (créés depuis la MEP, ou supprimés côté legacy), avec leur volume de
  réponses et l'existence d'un rattachement MonCompteAdeme. Identifier chaque
  compte avec `node scripts/lire-user.mjs <id>` et décider : compte de test →
  la purge de sql/04 s'en charge ; vrai utilisateur → écrire une reprise
  avant de basculer.

**Exécutée le 11/08/2026** : 15 réponses / 3 comptes, tous identifiés comme
comptes de test → purge assumée par `sql/04` (cf. §2.2). À rejouer juste
avant la bascule pour confirmer que rien de nouveau n'est apparu.

### Étape A — Sauvegarde (production)

Rien ne commence avant que ceci soit fait et vérifié.

```bash
# Adapter la connexion ; SCALINGO_POSTGRESQL_URL pointe la prod.
pg_dump "$SCALINGO_POSTGRESQL_URL" \
  --schema=tacct --format=custom \
  --file=sauvegarde-tacct-avant-reimport-$(date +%Y%m%d-%H%M).dump

# Vérifier que le fichier est lisible et non tronqué
pg_restore --list sauvegarde-tacct-avant-reimport-*.dump | head
```

Conserver ce fichier **hors du dépôt** et hors du serveur.

### Étape B — Préparation sur une base jetable

Réutilise la pile Docker de `scripts/legacy-dump-to-postgres/`
(MariaDB + Postgres + pgloader) — dossier historique de la branche `dev`,
recopié à l'identique sur `main` pour l'occasion. Toutes les commandes depuis
ce dossier-là.

```bash
cd scripts/legacy-dump-to-postgres
docker compose down -v            # repartir d'une pile vierge
docker compose up -d mariadb postgres

# B1 — charger le nouveau dump dans MariaDB (~59 Mo)
docker compose exec -T mariadb mysql -uprep -pprep 7706_tacct \
  < ../../prod-tacct_2026_08_11_01_46.sql

# B2 — convertir vers Postgres (schéma `tacct`, données en clair)
docker compose run --rm pgloader

export PGPASSWORD=prep
PSQL="psql -h localhost -p 55432 -U postgres -d tacct_prep"

# B2bis — aligner `user` sur le schéma applicatif
$PSQL -f ../reimport-dump-2026-08/sql/01-additif-user.sql

# B3 — chiffrer, avec la CLÉ DE PRODUCTION
cd ../reimport-dump-2026-08
USER_ENCRYPTION_KEY="<clé de prod>" node backfill-user-crypto.mjs          # dry-run
USER_ENCRYPTION_KEY="<clé de prod>" node backfill-user-crypto.mjs --apply

# B4 — porter l'unicité sur les index aveugles
$PSQL -f sql/02-unicite-bidx.sql

# B4bis — renommer index et contraintes aux noms attendus par Prisma (§1.4)
node renommer-index.mjs             # dry-run : lister les renommages prévus
node renommer-index.mjs --apply
```

**B5 — vérifier la conformité** (les 5 tables hors dump sont attendues
manquantes à ce stade, elles arrivent à l'étape C3) :

```bash
PREP_DATABASE_URL=postgres://postgres:prep@localhost:55432/tacct_prep \
  node verifier-schema.mjs --schema tacct       # colonnes, types, nullabilité, DEFAULT
PREP_DATABASE_URL=postgres://postgres:prep@localhost:55432/tacct_prep \
  node renommer-index.mjs                       # noms d'index et de contraintes
```

Les deux rapports doivent ne signaler **que** les 5 tables du §1.1. Toute
autre divergence (colonne, type, DEFAULT, index en trop…) se corrige ici, sur
la base jetable — pas en production.

Pour les écarts `DEFAULT` / `NOT NULL` hérités de pgloader (défauts
`NULL::…` explicites, `NOT NULL` perdus par le cast datetime), le vérificateur
génère lui-même le correctif :

```bash
node verifier-schema.mjs --schema tacct --sql sql/fix-conformite-prep.sql
# RELIRE le fichier, puis :
$PSQL -f sql/fix-conformite-prep.sql
node verifier-schema.mjs --schema tacct     # re-contrôle
```

`sql/fix-conformite-prep.sql` est un artefact de session (dépend de l'état de
la base jetable) : inutile de le committer.

### Étape C — Bascule en production

```bash
# C1 — renommer le schéma DANS la base de préparation, puis exporter.
#      On renomme à la source plutôt que de réécrire le fichier SQL : un
#      sed sur un dump de 59 Mo toucherait aussi les données contenant
#      la chaîne « tacct » (noms de territoires, e-mails, JSON…).
$PSQL -c 'ALTER SCHEMA tacct RENAME TO tacct_new;'

pg_dump postgres://postgres:prep@localhost:55432/tacct_prep \
  --schema=tacct_new --format=plain --no-owner --no-privileges \
  > tacct_new.sql

psql "$SCALINGO_POSTGRESQL_URL" -v ON_ERROR_STOP=1 -f tacct_new.sql

# C1bis — vérifier le schéma restauré AVANT de basculer
DATABASE_URL="$SCALINGO_POSTGRESQL_URL" node verifier-schema.mjs --schema tacct_new
DATABASE_URL="$SCALINGO_POSTGRESQL_URL" node renommer-index.mjs --schema tacct_new   # dry-run = lecture seule
```

Puis, dans l'ordre, sans interruption entre les trois :

```bash
psql "$SCALINGO_POSTGRESQL_URL" -v ON_ERROR_STOP=1 -f sql/03-bascule-prod.sql
psql "$SCALINGO_POSTGRESQL_URL" -v ON_ERROR_STOP=1 -f sql/04-reprise-tables-hors-dump.sql
psql "$SCALINGO_POSTGRESQL_URL" -v ON_ERROR_STOP=1 -f sql/05-reprise-liens-moncompteademe.sql
```

L'ancien schéma est **renommé**, pas supprimé : `tacct_old_2026_08_11`.

### Étape D — Contrôles

```bash
DATABASE_URL="$SCALINGO_POSTGRESQL_URL" node verifier-schema.mjs --schema tacct
DATABASE_URL="$SCALINGO_POSTGRESQL_URL" node renommer-index.mjs
# les deux doivent être verts, 47 tables

# db pull RÉÉCRIT schema.prisma : le contrôle est que `git diff` soit vide
# ensuite. Utiliser pnpm (version Prisma du projet), pas npx.
pnpm prisma db pull
git diff --stat prisma/schema.prisma    # attendu : aucun changement
git restore prisma/schema.prisma        # remet le fichier de référence
pnpm prisma generate
```

Puis, applicatif : connexion d'un compte connu, accès à `/mon-espace`,
présence des études. Le script `scripts/lire-user.mjs` (branche `dev`) permet
de contrôler un compte précis.

### Étape E — Nettoyage, plusieurs jours plus tard

```sql
DROP SCHEMA tacct_old_2026_08_11 CASCADE;
```

Ne pas le faire avant d'être certain qu'aucun retour arrière ne sera demandé :
c'est le seul moyen de récupérer les rattachements OIDC et les orphelins
TACCToscope sans repartir du `pg_dump` de l'étape A.

---

## 4. Retour arrière

Tant que `tacct_old_2026_08_11` existe :

```sql
BEGIN;
ALTER SCHEMA tacct                RENAME TO tacct_new;
ALTER SCHEMA tacct_old_2026_08_11 RENAME TO tacct;
COMMIT;
```

Au-delà, restaurer le dump de l'étape A :

```bash
pg_restore --dbname="$SCALINGO_POSTGRESQL_URL" --schema=tacct --clean \
  sauvegarde-tacct-avant-reimport-<horodatage>.dump
```

---

## 5. Contenu du dossier

| Fichier | Rôle | S'exécute sur |
| --- | --- | --- |
| `generer-verification-tacctoscope.mjs` | extrait les ids `user` du dump → `sql/00` | aucune base (lit le dump) |
| `sql/00-verification-tacctoscope.sql` | TACCToscope ↔ comptes du dump (étape 0) — **généré, non versionné** (UUID de prod) | **production** (lecture seule) |
| `sql/01-additif-user.sql` | 5 colonnes + défauts sur `user` | préparation |
| `backfill-user-crypto.mjs` | chiffrement AES-GCM + index aveugles | préparation |
| `sql/02-unicite-bidx.sql` | unicité portée sur les `*_bidx` | préparation |
| `renommer-index.mjs` | noms d'index/contraintes = `schema.prisma` (§1.4) | préparation (apply), les deux (dry-run) |
| `sql/03-bascule-prod.sql` | renommage atomique des schémas | **production** |
| `sql/04-reprise-tables-hors-dump.sql` | 5 tables déplacées, purge données de test, FK | **production** |
| `sql/05-reprise-liens-moncompteademe.sql` | rattachements OIDC rejoués | **production** |
| `verifier-schema.mjs` | colonnes, types, nullabilité, DEFAULT | les deux (lecture seule) |

La pile de conversion (`scripts/legacy-dump-to-postgres/` : docker-compose,
pgloader, anciens scripts de la première migration) est recopiée à l'identique
depuis la branche `dev`.
