# Fusion de l'outil TACCT dans Facili-TACCT

- 📅 Date : 15/06/2026
- 👷 Décision prise par : Antoine Conegero
- 📌 Statut : document de contexte **immuable**. Il fige les décisions prises avant l'intégration. Il ne décrit pas l'état d'avancement, mais la cible convenue. Il est conçu pour être lu d'un bloc et permettre de comprendre le travail sans contexte préalable.

---

## 1. Contexte et objectif

Pour plus de clarté, l'outil legacy sera intitulé "TACCT" et le nouvel outil sera nommé "Facili-TACCT", bien qu'aujourd'hui, le service Facili-TACCT n'existe plus et tout le service s'appelle TACCT.

TACCT est un outil historique d'accompagnement des collectivités dans l'adaptation au changement climatique. Il dispose de comptes utilisateurs réels (authentification ProConnect), rattachés à des territoires, et d'une base de données contenant des données personnelles et des données métier (études, impacts, stratégies). Cet outil était déployé ailleurs ; ce déploiement est arrêté. La base de données a été récupérée et migrée.

Facili-TACCT est un outil plus récent, en production, de diagnostic de vulnérabilité climatique des territoires. Il s'appuie essentiellement sur de la donnée publique (open data) et ne contient pas de données personnelles d'usagers.

**Objectif** : rapatrier TACCT et l'intégrer à l'écosystème Facili-TACCT, de telle sorte que :

- la connexion **ProConnect** soit le point d'entrée unique des usagers ;
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
    - Modèle `user` (schéma `tacct`) : `id`, `email` (unique), `username`, `firstname`, `lastname`, `authenticated_id` (= `sub` ProConnect, unique), `roles` (JSON, ex. `["ROLE_ADMIN","ROLE_USER"]`), rattachements `commune_id` / `study_office_id`, etc.

### 2.2 Facili-TACCT (cible d'accueil)

- Next.js 16 (App Router), TypeScript.
- **Auth.js v5** (voir §6).
- Prisma 7 + `@prisma/adapter-pg`, PostgreSQL Scalingo, schémas `databases_v2`, `postgis_v2`, `analytics`, `public` (48 modèles).
- UI : DSFR (A NE PLUS UTILISER) + MUI + Ant Design ; cartographie MapLibre.
- Déploiement **Scalingo** (preprod : `tacct.incubateur.ademe.dev`, prod : `tacct.ademe.fr`), ETL nocturnes (PostHog, Baserow).
- Authentification existante = **accès interne à des statistiques privées** uniquement (provider credentials sur table `public.sandbox_users`). **Sans aucun rapport** avec ProConnect ni avec les usagers TACCT.

---

## 3. Vision cible

- **Deux applications distinctes** (Facili-TACCT et TACCT), déployées séparément, mais **servies sous un même domaine** et partageant **une même base de données** et **une même session**.
- **ProConnect** est le mécanisme d'authentification des usagers, et la **table `user` (schéma `tacct`)** est la source de vérité unique des comptes.
- La fusion en une seule application (route-group, base unique) a été **écartée** : elle imposerait de réconcilier deux stacks d'auth et deux systèmes UI (Bootstrap ↔ DSFR), ce qui contredit l'intégration « tel quel ». À terme l'authentification sera **uniquement ProConnect**.

---

## 4. Architecture retenue

- **Facili-TACCT** = propriétaire de l'authentification (le parcours de connexion démarre chez lui) et lit/écrit le compte usager.
- **TACCT** = consommateur de la session. Quand l'usager arrive sur l'outil, il est déjà connecté ; TACCT se contente de lire et vérifier le cookie de session partagé, puis de résoudre le compte en base.
- **Une seule base PostgreSQL** partagée par les deux applications. Elle contient plusieurs schémas : le schéma `tacct` (qui héberge la table `user` et toutes les données TACCT) coexiste avec les schémas de Facili-TACCT (`databases_v2`, `postgis_v2`, `analytics`, `public`).
- **Session unique** : un cookie de session, posé par Facili-TACCT, lisible par TACCT (même secret, même nom de cookie, même domaine).

```bash
                  ProConnect (Identity Provider, OIDC)
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
                 * user.authenticated_id = sub ProConnect
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

### 6.1 Deux instances Auth.js v5 cloisonnées

Le cloisonnement entre l'accès aux statistiques internes et l'accès aux données usagers est **primordial pour la sécurité** : un accès aux statistiques ne doit **jamais** permettre d'accéder aux données usagers. Ce cloisonnement est garanti **par construction** au moyen de **deux instances Auth.js v5 séparées**, avec des **cookies et des secrets distincts**.

| Instance  | Public          | Schéma                 | Cookie                                                 | Secret              |
| --------- | --------------- | ---------------------- | ------------------------------------------------------ | ------------------- |
| **stats** | agents internes | `public.sandbox_users` | cookie dédié (ex. `authjs.stats-session-token`)        | `NEXTAUTH_SECRET`   |
| **users** | usagers         | `tacct.user`           | cookie users (nom épinglé, ex. `authjs.session-token`) | `AUTH_TACCT_SECRET` |

Conséquence : une session stats vit dans un cookie différent ; elle ne peut pas servir à accéder aux données usagers, et TACCT ne connaît que le cookie users.

### 6.2 Auth statistiques (interne)

Provider `credentials` (identifiants vérifiés via bcrypt sur `public.sandbox_users`), strategy JWT. Cet ensemble est strictement séparé du parcours ProConnect.

### 6.3 Auth utilisateurs (ProConnect)

ProConnect est intégré comme **provider OIDC** (authorization code flow) de l'instance Auth.js v5 « users ». Auth.js gère la mécanique OIDC, la vérification des tokens et la session.

### 6.4 Spécificités techniques ProConnect

Issues de la documentation officielle ProConnect :

- **Discovery / issuer** : toutes les URLs sont sous `https://${PROCONNECT_DOMAIN}/api/v2/`. La discovery est `https://${PROCONNECT_DOMAIN}/api/v2/.well-known/openid-configuration`, donc l'**issuer OIDC est `https://${PROCONNECT_DOMAIN}/api/v2`**.
    - `PROCONNECT_DOMAIN` : intégration = `fca.integ01.dev-agentconnect.fr` ; production = `auth.agentconnect.gouv.fr`.
- **Scopes** : `openid given_name usual_name email`.
- **Aucun paramètre superflu** : tout paramètre non standard sur `/authorize` provoque une erreur `Y000400`. En conséquence, **PKCE doit être désactivé** côté Auth.js (`checks: ['state', 'nonce']`) : seuls `response_type`, `client_id`, `redirect_uri`, `scope`, `state`, `nonce` sont envoyés.
- **Authentification au token endpoint** : `client_secret_post` (identifiants dans le corps de la requête).
- **`id_token`** : JWT signé **RS256** ; signature à vérifier (via le JWKS de la discovery). Le `nonce` doit correspondre. L'`id_token` est conservé pour la déconnexion.
- **`userinfo`** : renvoie un **JWT signé RS256** (un algo de signature a été déclaré à l'enregistrement du FS). Le endpoint `userinfo` nécessite donc un **traitement custom** : récupérer le JWT, **vérifier la signature RS256** via le JWKS, puis extraire les claims.
- **Déconnexion** : RP-initiated via `end_session_endpoint`, avec `id_token_hint`, `post_logout_redirect_uri` et `state`.
- **Durée de session ProConnect** : 12 h.

### 6.5 Contrainte de production : URL de redirection figée

En production, l'URL de redirection de connexion est **figée** et ne peut pas être modifiée :

```bash
https://tacct.ademe.fr/api/proconnect/callback
```

Elle doit **impérativement** correspondre. Le chemin de callback OIDC est donc **`/api/proconnect/callback`** (et non le chemin par défaut d'Auth.js `/api/auth/callback/<provider>`), identique dans tous les environnements (`http://localhost:3000/api/proconnect/callback` hors prod). Le point de redirection OIDC vit à ce chemin imposé et établit une **session Auth.js v5** (même secret + même nom de cookie que le contrat de §6.6), afin que TACCT puisse la lire nativement.

L'URL de déconnexion post-logout (`post_logout_redirect_uri`) est `/mon-compte`.

### 6.6 Contrat de session partagée

Pour qu'une session posée par Facili-TACCT soit lisible par TACCT :

- **Même secret** : `AUTH_TACCT_SECRET`, partagé entre les deux applications. Comme le nom diffère de `AUTH_SECRET`, il est passé **explicitement** à la config Auth.js des deux côtés.
- **Même nom de cookie**, épinglé explicitement dans les deux applications, avec **`path: '/'`** (pour qu'il soit envoyé aussi sous `/workspace-tacct`, malgré le `basePath`).
- **Même domaine** (même host).
- **Strategy JWT** des deux côtés ; durée de session usager = **12 h**.
- **Contenu du JWT usager** : `sub`, l'identifiant interne du compte (`tacct.user.id`) et l'`id_token` (nécessaire à la déconnexion ProConnect). **Les rôles ne sont pas dans le JWT.**

### 6.7 Lecture de la session côté TACCT

TACCT dispose d'une instance Auth.js v5 réduite au rôle de **lecteur de session** (même `AUTH_TACCT_SECRET`, même nom de cookie, `path: '/'`, strategy JWT, sans provider) et utilise `auth()`. Il ne déclenche jamais de connexion.

Les **rôles** (`ROLE_ADMIN` / `ROLE_USER`) sont lus **en base** (schéma `tacct`) au moment du besoin, et non depuis le JWT : c'est plus sûr (révocation immédiate) et la lecture est peu coûteuse (cache par requête).

### 6.8 Déconnexion

La déconnexion est gérée par Facili-TACCT (propriétaire de l'auth) : signOut → `end_session_endpoint` ProConnect (avec `id_token_hint`) → redirection post-logout vers `/mon-compte`. Un bouton de déconnexion est présent sur `/mon-espace` et dans TACCT (qui pointe vers le signOut de Facili-TACCT).

---

## 7. Gestion des utilisateurs

- **Résolution** : le compte est résolu par `authenticated_id = sub` (le `sub` ProConnect, stable). L'email n'est pas utilisé comme clé de résolution.
- **Première connexion** : si le compte existe → on le garde tel quel (les comptes migrés ne sont jamais modifiés). S'il n'existe pas → on le **crée** à partir des claims ProConnect.
- **Correspondance des claims à la création** :
    - `authenticated_id` = `sub`
    - `email` = `email`
    - `username` = `email` (identique à l'email)
    - `firstname` = `given_name`
    - `lastname` = `usual_name`
    - `roles` = `["ROLE_USER"]`
    - `validated` = `false`, `validated_terms_of_use` = `true`
    - `commune_id` / `study_office_id` = `null`
    - horodatages = maintenant
    - Les autres claims ProConnect (siret, etc.) sont ignorés (pas de colonne correspondante).

---

## 8. Base de données

- **Une seule base PostgreSQL**, partagée par les deux applications (sur Scalingo, l'addon est porté par Facili-TACCT ; l'app TACCT pointe sur la même instance).
- **Accès** :
    - **TACCT** : n'utilise que le schéma `tacct`.
    - **Facili-TACCT** : accède à **l'intégralité de la base** — tous ses schémas (`databases_v2`, `postgis_v2`, `analytics`, `public`) **et la totalité du schéma `tacct`** (tous ses modèles, dont `user`), en lecture et écriture. Son client Prisma est configuré en **multiSchema** et inclut le schéma `tacct` complet : création du compte au premier login (cf. §7) et autres usages des données TACCT.

---

## 9. Données sensibles et chiffrement

Les informations sensibles de la table `user` doivent être **chiffrées** :

- `email`
- `firstname`
- `lastname`
- `username`
- `authenticated_id`

**Intérêt** : protéger les utilisateurs en cas de fuite des bases d'administration.

---

## 10. Synthèse des décisions

- Deux applications séparées (« tel quel »), un même domaine, une base partagée, une session partagée.
- ProConnect = entrée unique des usagers ; `tacct.user` = source de vérité des comptes ; résolution par `authenticated_id = sub` ; création au premier login (`username = email`, `firstname = given_name`, `lastname = usual_name`).
- Deux instances Auth.js v5 cloisonnées (stats vs usagers), cookies + secrets distincts.
- Provider OIDC ProConnect : issuer `https://${PROCONNECT_DOMAIN}/api/v2`, scopes `openid given_name usual_name email`, `checks:['state','nonce']` (PKCE off), `client_secret_post`, `id_token` et `userinfo` en RS256 (vérif via JWKS, userinfo custom), logout via `end_session_endpoint`, session 12 h.
- **Contrainte forte** : `redirect_uri` de prod figée à `https://tacct.ademe.fr/api/proconnect/callback` → chemin de callback `/api/proconnect/callback` imposé.
- Contrat de session : `AUTH_TACCT_SECRET` partagé (passé explicitement), même nom de cookie épinglé, `path:'/'`, JWT (`sub`, `user.id`, `id_token`) ; rôles lus en base.
- TACCT lit la session via une instance Auth.js « lecteur » et n'accède qu'au schéma `tacct` ; Facili-TACCT accède à l'intégralité de la base, schéma `tacct` complet inclus.
- Routing `/workspace-tacct` : rewrites Next hors-prod, WAF nginx en prod.
- Données sensibles de `user` chiffrées (`email`, `firstname`, `lastname`, `username`, `authenticated_id`) pour protéger les usagers en cas de fuite des bases d'administration.
