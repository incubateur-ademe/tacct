# Fusion de l'outil TACCT dans Facili-TACCT

- 📅 Date : 29/06/2026
- 👷 Décision prise par : Antoine Conegero
- 📌 Statut : document de contexte. Il décrit la cible convenue de l'intégration et l'authentification retenue. Il est conçu pour être lu d'un bloc et permettre de comprendre le travail sans contexte préalable.

---

## 1. Contexte et objectif

Pour plus de clarté, l'outil legacy sera intitulé "TACCT" et le nouvel outil sera nommé "Facili-TACCT", bien qu'aujourd'hui, le service Facili-TACCT n'existe plus et tout le service s'appelle TACCT.

TACCT est un outil historique d'accompagnement des collectivités dans l'adaptation au changement climatique. Il dispose de comptes utilisateurs réels, rattachés à des territoires, et d'une base de données contenant des données personnelles et des données métier (études, impacts, stratégies). Cet outil était déployé ailleurs ; ce déploiement est arrêté. La base de données a été récupérée et migrée.

Facili-TACCT est un outil plus récent, en production, de diagnostic de vulnérabilité climatique des territoires. Il s'appuie essentiellement sur de la donnée publique (open data) et ne contient pas de données personnelles d'usagers.

**Objectif** : rapatrier TACCT et l'intégrer à l'écosystème Facili-TACCT, de telle sorte que :

- la connexion **MonCompteAdeme** soit le point d'entrée unique des usagers ;
- une **même connexion** donne accès à l'ensemble des données et fonctionnalités de l'ancien outil TACCT ;
- le **compte soit unifié** : un ancien utilisateur de TACCT est le même compte des deux côtés.

L'intégration se fait « tel quel » : on ne réécrit pas TACCT dans la stack de Facili-TACCT.

---

## 2. Les deux outils

### 2.1 TACCT (à rapatrier)

- **`tacct-legacy`** : à ne PAS rapatrier, c'est le legacy historique inutile désormais.
- **`tacct-next`** : réécriture moderne, c'est elle qu'on intègre.
    - Next.js 16 (App Router, Server Components, Server Actions), TypeScript strict.
    - **Auth.js v5** (`next-auth@5.0.0-beta`).
    - Prisma 7 + adaptateur `@prisma/adapter-pg`, PostgreSQL, **schéma `tacct`** (46 modèles).
    - UI : react-bootstrap / Bootstrap 4 (port pixel-perfect du legacy).
    - Métier : une collectivité crée une **étude** (`study`) pour une commune + année, saisit ses **expositions observées**, **sensibilités**, **projections climatiques**, identifie des **impacts**, construit des **stratégies** et des **actions** d'adaptation, et exporte un rapport.
    - Modèle `user` (schéma `tacct`) : `id`, `email` (unique), `username`, `firstname`, `lastname`, `authenticated_id` (= `sub` de l'IdP, unique), `roles` (JSON, ex. `["ROLE_ADMIN","ROLE_USER"]`), rattachements `commune_id` / `study_office_id`, etc.

### 2.2 Facili-TACCT (cible d'accueil)

- Next.js 16 (App Router), TypeScript.
- **Auth.js v5** (voir §6).
- Prisma 7 + `@prisma/adapter-pg`, PostgreSQL Scalingo, schémas `databases_v2`, `postgis_v2`, `analytics`, `public` (48 modèles).
- UI : DSFR (A NE PLUS UTILISER) + MUI + Ant Design ; cartographie MapLibre.
- Déploiement **Scalingo** (preprod : `tacct.incubateur.ademe.dev`, prod : `tacct.ademe.fr`), ETL nocturnes (PostHog, Baserow).
- Authentification existante = **accès interne à des statistiques privées** uniquement (provider credentials sur table `public.sandbox_users`). **Sans aucun rapport** avec l'authentification des usagers TACCT.

---

## 3. Vision cible

- **Deux applications distinctes** (Facili-TACCT et TACCT), déployées séparément, mais **servies sous un même domaine** et partageant **une même base de données** et **une même session**.
- **MonCompteAdeme** est le mécanisme d'authentification des usagers, et la **table `user` (schéma `tacct`)** est la source de vérité unique des comptes.
- La fusion en une seule application (route-group, base unique) a été **écartée** : elle imposerait de réconcilier deux stacks d'auth et deux systèmes UI (Bootstrap ↔ DSFR), ce qui contredit l'intégration « tel quel ». À terme l'authentification sera **uniquement MonCompteAdeme**.

---

## 4. Architecture retenue

- **Facili-TACCT** = propriétaire de l'authentification (le parcours de connexion démarre chez lui) et lit/écrit le compte usager.
- **TACCT** = consommateur de la session. Quand l'usager arrive sur l'outil, il est déjà connecté ; TACCT se contente de lire et vérifier le cookie de session partagé, puis de résoudre le compte en base.
- **Une seule base PostgreSQL** partagée par les deux applications. Elle contient plusieurs schémas : le schéma `tacct` (qui héberge la table `user` et toutes les données TACCT) coexiste avec les schémas de Facili-TACCT (`databases_v2`, `postgis_v2`, `analytics`, `public`).
- **Session unique** : un cookie de session, posé par Facili-TACCT, lisible par TACCT (même secret, même nom de cookie, même domaine).

```bash
                MonCompteAdeme (Identity Provider, OIDC)
                                │  sub
        ┌───────────────────────▼───────────────────────────┐
        │            UN SEUL DOMAINE (même host)              │
        │                                                      │
        │   tout sauf /workspace-tacct      /workspace-tacct/* │
        │        │                                │ (proxy)    │
        │   ┌────▼─────────┐  cookie session ┌─────▼────────┐  │
        │   │ Facili-TACCT  │  users partagé  │    TACCT      │  │
        │   │ (auth owner)  │ ───────────────▶│ (lit session)│  │
        │   └────┬─────────┘                  └─────┬────────┘  │
        └────────┼──────────── PostgreSQL ──────────┼──────────┘
                 │  schéma tacct (user*) + databases_v2/...    │
                 └─────────────────────────────────────────────┘
                 * user.authenticated_id = sub MonCompteAdeme
```

---

## 5. Routing et domaines

- L'outil TACCT est servi sous le préfixe **`/workspace-tacct`** (configuré via `basePath: '/workspace-tacct'` côté app TACCT). Toutes les routes TACCT sont donc sous `/workspace-tacct/...`.
- La réorientation `/workspace-tacct/*` → application TACCT se fait :
    - **hors production** (`NODE_ENV !== 'production'`) : via les `rewrites` de `next.config` de Facili-TACCT, destination = URL interne de l'app TACCT ;
    - **en production** : via l'**app nginx (WAF)** placée devant la prod.
- Domaines :
    - dev / intégration : `http://localhost:3000` (Facili-TACCT), l'app TACCT sur un autre port en local.
    - application TACCT déployée : `https://tacct-legacy.osc-fr1.scalingo.io` (cible du rewrite hors-prod et du proxy WAF en prod).
    - production : **`https://tacct.ademe.fr`** (imposé, cf. §6.5).

---

## 6. Authentification

### 6.1 Deux mécanismes cloisonnés

Le cloisonnement entre l'accès aux statistiques internes et l'accès aux données usagers est **primordial pour la sécurité** : un accès aux statistiques ne doit **jamais** permettre d'accéder aux données usagers. Ce cloisonnement est garanti **par construction** au moyen de **deux mécanismes séparés**, avec des **cookies et des secrets distincts**.

| Mécanisme | Public          | Implémentation                                | Schéma                 | Cookie                                                     | Secret              |
| --------- | --------------- | --------------------------------------------- | ---------------------- | ---------------------------------------------------------- | ------------------- |
| **stats** | agents internes | Auth.js v5, provider `credentials` (bcrypt)   | `public.sandbox_users` | `authjs.stats-session-token` (préfixe `__Secure-` en prod) | `NEXTAUTH_SECRET`   |
| **users** | usagers         | Flux OIDC **custom** sous `/api/proconnect/*` | `tacct.user`           | `authjs.session-token` (préfixe `__Secure-` en prod)       | `AUTH_TACCT_SECRET` |

Conséquence : une session stats vit dans un cookie différent ; elle ne peut pas servir à accéder aux données usagers, et TACCT ne connaît que le cookie users.

> **Note d'implémentation** : MonCompteAdeme étant basé sur ProConnect, les chemins et la lib gardent le nom legacy `proconnect` (`/api/proconnect/*`, `src/lib/auth/proconnect.ts`). Le flux usager n'utilise **pas** Auth.js comme provider OIDC : il est implémenté à la main (construction de l'URL d'autorisation, échange de token, vérification de l'`id_token`, pose de session). Seul l'encodage/décodage du cookie de session réutilise `next-auth/jwt`, afin que la session reste **lisible nativement par TACCT** (qui, lui, utilise Auth.js).

### 6.2 Auth statistiques (interne)

Provider `credentials` (identifiants vérifiés via bcrypt sur `public.sandbox_users`), strategy JWT, session 30 min. Cet ensemble est strictement séparé du parcours MonCompteAdeme.

### 6.3 Auth utilisateurs (MonCompteAdeme)

MonCompteAdeme est la solution d'authentification de l'ADEME (basée sur ProConnect), intégrée en **OIDC authorization code flow**. Son usage relève d'une **directive de l'ADEME**. Le flux est porté par quatre routes :

- **`/api/proconnect/login`** : construit l'URL d'autorisation et redirige vers MonCompteAdeme.
- **`/api/proconnect/callback`** : reçoit le `code`, échange le token, vérifie l'`id_token`, résout/crée le compte et pose la session (cf. §6.5, §7).
- **`/api/proconnect/logout`** : déconnexion RP-initiated (cf. §6.8).
- **`/api/proconnect/me`** : renvoie l'utilisateur courant à partir de la session.

### 6.4 Spécificités techniques MonCompteAdeme

- **Discovery / issuer** : l'URL complète de la discovery est fournie par la variable `MON_COMPTE_ADEME_ENDPOINT` (le `.well-known/openid-configuration`). L'**issuer** et tous les endpoints (authorization, token, jwks, end_session) sont lus depuis ce document de discovery.
    - Realms par environnement :
        - dev / local : `https://rec-fa.ademe.fr/auth/realms/integration` (client `dev-tacct-incu`) ;
        - preprod : `https://preprod-fa.ademe.fr/auth/realms/master` (client `preprod-tacct-incu`) ;
        - production : valeurs dédiées.
- **Scopes** : `openid profile email`.
- **PKCE désactivé** : la requête `/authorize` n'envoie que `response_type=code`, `client_id`, `redirect_uri`, `scope`, `state`, `nonce`. Le `state` et le `nonce` sont stockés dans des cookies `pc_state` / `pc_nonce` (httpOnly, 5 min) et revérifiés au callback.
- **Authentification au token endpoint** : `client_secret_post` (`client_id` + `client_secret` dans le corps de la requête).
- **`id_token`** : JWT signé **RS256** ; signature vérifiée via le JWKS de la discovery, `issuer` et `audience` (= `client_id`) contrôlés, `nonce` confronté au cookie. L'`id_token` est conservé en session pour la déconnexion.
- **Claims** : lus **directement dans l'`id_token`** (`sub`, `email`, `email_verified`, `given_name`, `family_name`, …). **Aucun appel `userinfo`** n'est nécessaire.
- **Déconnexion** : RP-initiated via `end_session_endpoint`, avec `id_token_hint`, `post_logout_redirect_uri` et `state`.
- **Durée de session usager** : 12 h (`USERS_SESSION_MAX_AGE`).

### 6.5 Contrainte de production : URL de redirection figée

En production, l'URL de redirection de connexion est **figée** et ne peut pas être modifiée :

```bash
https://tacct.ademe.fr/api/proconnect/callback
```

Elle doit **impérativement** correspondre. Le chemin de callback OIDC est donc **`/api/proconnect/callback`**, identique dans tous les environnements (`http://localhost:3000/api/proconnect/callback` hors prod).

### 6.6 Contrat de session partagée

Pour qu'une session posée par Facili-TACCT soit lisible par TACCT :

- **Même secret** : `AUTH_TACCT_SECRET`, partagé entre les deux applications. Comme le nom diffère de `AUTH_SECRET`, il est passé **explicitement** à la config Auth.js des deux côtés.
- **Même nom de cookie**, épinglé explicitement dans les deux applications, avec **`path: '/'`** (pour qu'il soit envoyé aussi sous `/workspace-tacct`, malgré le `basePath`).
- **Même domaine** (même host).
- **Strategy JWT** des deux côtés ; durée de session usager = **12 h**.
- **Contenu du JWT usager** : `sub` = l'identifiant interne du compte (`tacct.user.id`), et l'`id_token` (nécessaire à la déconnexion MonCompteAdeme). **Les rôles ne sont pas dans le JWT.**

Variables d'environnement de l'auth usager : `MON_COMPTE_ADEME_ENDPOINT`, `MON_COMPTE_ADEME_CLIENT_ID`, `MON_COMPTE_ADEME_SECRET`, `NEXTAUTH_URL` (URL de base), `AUTH_TACCT_SECRET`. Chaque environnement (local, preprod, prod) porte ses propres valeurs.

### 6.7 Lecture de la session côté TACCT

TACCT dispose d'une instance Auth.js v5 réduite au rôle de **lecteur de session** (même `AUTH_TACCT_SECRET`, même nom de cookie, `path: '/'`, strategy JWT, sans provider) et utilise `auth()`. Il ne déclenche jamais de connexion.

Les **rôles** (`ROLE_ADMIN` / `ROLE_USER`) sont lus **en base** (schéma `tacct`) au moment du besoin, et non depuis le JWT : c'est plus sûr (révocation immédiate) et la lecture est peu coûteuse (cache par requête).

### 6.8 Déconnexion

La déconnexion est gérée par Facili-TACCT (propriétaire de l'auth) : `/api/proconnect/logout` → `end_session_endpoint` MonCompteAdeme (avec `id_token_hint`, `post_logout_redirect_uri`, `state`) → effacement du cookie de session. Un bouton de déconnexion est présent sur `/mon-espace` et dans TACCT (qui pointe vers le logout de Facili-TACCT).

---

## 7. Gestion des utilisateurs

- **Résolution** : le compte est résolu par `authenticated_id = sub` (le `sub` MonCompteAdeme, stable).
- **Première connexion** : si le compte existe → on le garde tel quel (les comptes migrés ne sont jamais modifiés). S'il n'existe pas → on le **crée** à partir des claims MonCompteAdeme.
- **Correspondance des claims à la création** :
    - `authenticated_id` = `sub`
    - `email` = `email`
    - `username` = `email` (identique à l'email)
    - `firstname` = `given_name`
    - `lastname` = `family_name`
    - `roles` = `["ROLE_USER"]`
    - `validated` = `false`, `validated_terms_of_use` = `true`
    - `commune_id` / `study_office_id` = `null`
    - horodatages = maintenant
    - Les autres claims sont ignorés (pas de colonne correspondante).

---

## 8. Base de données

- **Une seule base PostgreSQL**, partagée par les deux applications (sur Scalingo, l'addon est porté par Facili-TACCT ; l'app TACCT pointe sur la même instance).
- **Accès** :
    - **TACCT** : n'utilise que le schéma `tacct`.
    - **Facili-TACCT** : accède à **l'intégralité de la base** — tous ses schémas (`databases_v2`, `postgis_v2`, `analytics`, `public`) **et la totalité du schéma `tacct`** (tous ses modèles, dont `user`), en lecture et écriture. Son client Prisma est configuré en **multiSchema** et inclut le schéma `tacct` complet : création du compte au premier login (cf. §7) et autres usages des données TACCT.

---

## 9. Données sensibles et chiffrement

Les informations sensibles de la table `user` sont **chiffrées au repos** :

- Colonnes chiffrées : `email`, `firstname`, `lastname`, `username`, `authenticated_id`.
- Chiffrement applicatif via `src/lib/crypto/user-crypto` (`encryptField`), avec une colonne `encryption_version` pour permettre une rotation ultérieure.
- Pour les champs sur lesquels une recherche par égalité est nécessaire (`email`, `authenticated_id`), une colonne **blind index** dédiée (`email_bidx`, `authenticated_id_bidx`) est calculée par `blindIndex()` : elle permet le lookup et l'unicité **sans déchiffrer**, le chiffrement authentifié (AES-GCM) n'étant pas déterministe.

**Intérêt** : protéger les utilisateurs en cas de fuite des bases d'administration.

---

## 10. Synthèse des décisions

- Deux applications séparées (« tel quel »), un même domaine, une base partagée, une session partagée.
- MonCompteAdeme (directive ADEME, basé sur ProConnect) = entrée unique des usagers ; `tacct.user` = source de vérité des comptes ; résolution par `authenticated_id = sub` ; création au premier login (`username = email`, `firstname = given_name`, `lastname = family_name`).
- Deux mécanismes cloisonnés : **stats** = Auth.js v5 (credentials/bcrypt sur `sandbox_users`) ; **users** = flux OIDC custom sous `/api/proconnect/*` produisant une session compatible Auth.js. Cookies + secrets distincts.
- Flux OIDC MonCompteAdeme : discovery via `MON_COMPTE_ADEME_ENDPOINT`, scopes `openid profile email`, PKCE off (`state`/`nonce` en cookies), `client_secret_post`, `id_token` RS256 vérifié via JWKS, claims lus dans l'`id_token` (pas de `userinfo`), logout via `end_session_endpoint`, session 12 h.
- **Contrainte forte** : `redirect_uri` de prod figée à `https://tacct.ademe.fr/api/proconnect/callback` → chemin de callback `/api/proconnect/callback` imposé partout.
- Contrat de session : `AUTH_TACCT_SECRET` partagé (passé explicitement), même nom de cookie épinglé, `path:'/'`, JWT (`sub` = `user.id`, `id_token`) ; rôles lus en base.
- TACCT lit la session via une instance Auth.js « lecteur » et n'accède qu'au schéma `tacct` ; Facili-TACCT accède à l'intégralité de la base, schéma `tacct` complet inclus.
- Routing `/workspace-tacct` : rewrites Next hors-prod, WAF nginx en prod.
- Données sensibles de `user` chiffrées (`email`, `firstname`, `lastname`, `username`, `authenticated_id`) avec blind indexes pour les lookups, pour protéger les usagers en cas de fuite des bases d'administration.
