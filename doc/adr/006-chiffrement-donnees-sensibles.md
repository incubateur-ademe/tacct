# Chiffrement des données sensibles de la table `user`

- 📅 Date : 15/06/2026
- 👷 Décision prise par : Antoine Conegero
- 📌 Statut : document de contexte **immuable**. Il fige les décisions de chiffrement prises avant l'intégration. Complément de l'ADR `005-fusion-tacct.md`.

---

## 1. Contexte et objectif

Pour plus de clarté, l'outil legacy sera intitulé "TACCT" et le nouvel outil sera nommé "Facili-TACCT", bien qu'aujourd'hui, le service Facili-TACCT n'existe plus et tout le service s'appelle TACCT.

La table `user` (schéma `tacct`) contient des données personnelles. **Objectif** : protéger les utilisateurs **en cas de fuite des bases d'administration** (dump, accès en lecture à la base). Le chiffrement au niveau disque ne suffit pas (un dump resterait lisible) : on chiffre les colonnes sensibles au niveau applicatif, avec une clé secrète.

**Champs chiffrés** : `email`, `firstname`, `lastname`, `username`, `authenticated_id`.

---

## 2. Contrainte décisive

Les champs ne s'utilisent pas tous de la même façon :

- `firstname`, `lastname`, `username` : seulement **affichés**.
- `email` : **`@unique`** (unicité conservée).
- `authenticated_id` : **clé de résolution** du compte à chaque connexion (`where: { authenticated_id: sub }`).

Un chiffrement fort (AES-GCM) utilise un **IV aléatoire** : le même clair produit un ciffré différent à chaque fois → impossible de faire un lookup ou une contrainte d'unicité sur la colonne chiffrée. Les champs servant au **lookup / à l'unicité** (`authenticated_id`, `email`) nécessitent donc un **blind index**.

---

## 3. Décisions

### 3.1 Chiffrement (AES-256-GCM)

- Tous les champs sensibles sont chiffrés en **AES-256-GCM** (IV aléatoire par valeur), stockés sous la forme `iv:authTag:ciphertext` (base64).
- Implémentation via le module **`crypto` natif de Node** (pas de dépendance externe).

### 3.2 Blind index (lookup et unicité)

- Pour les champs interrogés / uniques, une colonne **blind index** dédiée stocke un **`HMAC-SHA256(valeur, clé)`** (déterministe) :
    - `authenticated_id_bidx` → résolution du compte à la connexion.
    - `email_bidx` → conservation de l'unicité de l'email.
- L'unicité est portée par la colonne blind index. La valeur réelle reste chiffrée en AES-GCM.

### 3.3 Mise en œuvre dans l'application

- Une **extension Prisma** (ou une couche d'accès dédiée) chiffre à l'écriture, déchiffre à la lecture, et calcule les blind index.
- **Connexion** : on calcule `HMAC-SHA256(sub)` → lookup sur `authenticated_id_bidx` → déchiffrement des champs pour l'affichage.
- **Création (premier login)** : Facili-TACCT chiffre les champs et calcule les blind index à l'`INSERT`.

### 3.4 Clés

- Clé symétrique secrète, **une par environnement** (`USER_ENCRYPTION_KEY`), **prod et preprod avec deux clés différentes** : une fuite de la clé preprod ne compromet pas la prod.
- À partir de cette clé maître, deux sous-clés sont dérivées (HKDF) : une pour le chiffrement AES-GCM, une pour le HMAC des blind index.
- **Modèle symétrique assumé** : la connexion et l'affichage nécessitant un déchiffrement, **les deux applications historiques (Facili-TACCT et TACCT) détiennent la clé**. Ce n'est pas un modèle « seul l'admin déchiffre » (qui interdirait d'afficher nom/email). La clé est un secret applicatif géré hors du code.

### 3.5 Schéma

- Les colonnes chiffrées passent de `character varying` (`VarChar`) à **`text`** : le ciffré (base64 de `iv + authTag + ciphertext`) dépasse les tailles actuelles.
- Ajout des colonnes blind index `authenticated_id_bidx`, `email_bidx` (uniques).

### 3.6 Migration des comptes existants

- Les comptes déjà présents (données migrées en clair) sont chiffrés par un **script one-shot, exécuté par environnement** avec la clé de l'environnement.
- Le script chiffre les champs et remplit les blind index.
- Idempotence à garantir (colonne `encryption_version`, ou exécution unique sur la donnée encore en clair).

---

## 4. Modèle de menace

- ✅ Protège contre une **fuite de la base** (dump, accès admin en lecture) : les colonnes sensibles sont illisibles sans la clé.
- ✅ Cloisonnement des environnements : clés distinctes prod / preprod.
- ⚠️ Ne protège pas si **l'application elle-même est compromise** (elle détient la clé). C'est le compromis assumé du modèle symétrique nécessaire à la connexion et à l'affichage.

---

## 5. Variables d'environnement

| Variable              | Portée                    | Usage                                                                                                                                                                                                                     |
| --------------------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `USER_ENCRYPTION_KEY` | Facili-TACCT **et** TACCT | Clé maître de chiffrement des champs sensibles de `user`. **Valeur distincte par environnement** (prod ≠ preprod), identique entre les deux apps d'un même environnement. Sous-clés chiffrement + HMAC dérivées par HKDF. |

---

## 6. Synthèse

- Champs chiffrés : `email`, `firstname`, `lastname`, `username`, `authenticated_id`.
- **AES-256-GCM** (IV aléatoire) pour les valeurs ; **blind index HMAC-SHA256** pour `authenticated_id` (résolution) et `email` (unicité conservée).
- `crypto` natif Node, via extension Prisma.
- Clé symétrique, une par environnement (prod/preprod distinctes), détenue par les deux apps.
- Colonnes chiffrées en `text` ; colonnes blind index uniques ajoutées.
- Comptes existants chiffrés par un script one-shot par environnement.
- Protège d'une fuite de base ; ne protège pas d'une compromission applicative (clé présente côté apps).
