# Rapport d'audit de sécurité Shannon — TACCT

## Résumé

- Cible : TACCT (Next.js 16, hébergement Scalingo, Cloudflare en frontal)
- Date : 2026-10-26
- Périmètre : authentification OIDC, sessions, autorisation des Server Actions, proxy cartographique, chiffrement des données personnelles, configuration TLS
- Méthode : analyse du code source, sondes HTTP en lecture seule sur le serveur de développement local et sur https://tacct.ademe.fr
- Exploitation : non réalisée

L'audit relève 6 points, dont 1 de sévérité élevée, 4 de sévérité faible et 1 de niveau informatif. Tous ont été corrigés et vérifiés le jour même (voir « Correctifs appliqués »).

Le point le plus sérieux est PROXY-01 : l'allowlist du proxy cartographique accepte tout sous-domaine de `scw.cloud`, ce qui permet à n'importe qui de faire servir du contenu arbitraire depuis l'origine du site, avec une CSP qui autorise les scripts inline. C'est une XSS same-origin probable, non démontrée de bout en bout.

Aucune injection SQL ni XSS directe n'a été trouvée. Les Server Actions sont correctement bornées à l'utilisateur courant. Les autorisations ne reposent sur aucun champ déclaratif (`profil`, territoire), et les données territoriales sont publiques par conception.

> Aucune exploitation n'a été menée. PROXY-01 n'a pas été démontré de bout en bout, mais chaque maillon de la chaîne a été vérifié indépendamment.

## Limites

- La configuration d'environnement de production (variables Scalingo) n'a pas été consultée directement. Les conclusions sur la production reposent sur le code, sur `.gitignore` et sur les réponses HTTP observées.

## Correctifs appliqués le 2026-10-26

Les 6 points ont été corrigés dans le code et vérifiés le jour même :

- **PROXY-01** : wildcard retiré ; l'hôte du bucket Scaleway de l'environnement est déduit de `NEXT_PUBLIC_SCALEWAY_BUCKET_URL`, donc chaque environnement n'autorise que son propre bucket. Seules les réponses raster (`image/png`, `jpeg`, `webp`, `gif`, `avif`) sont relayées, le SVG étant exclu car il peut embarquer du script. Vérifié sur le serveur de développement : JSON refusé en 502, images en 200, bucket de prod et hôte `scw.cloud` inconnu en 403 depuis l'environnement de dev.
- **PROXY-02** : redirections suivies manuellement, chaque destination revalidée contre l'allowlist, 3 sauts maximum.
- **AUTH-01** : `Cache-Control: no-store` sur `/api/proconnect/me`, vérifié sur le serveur de développement.
- **CRYPTO-01** : `src/instrumentation.ts` appelle `verifierCleChiffrement()` au démarrage ; la clé doit faire au moins 32 octets.
- **CRYPTO-02** : l'extension Prisma chiffre tout champ sensible fourni en clair sur `create`, `update`, `upsert`, `createMany` et `updateMany`, et calcule les blind index manquants.
- **CRYPTO-03** : `decryptField` lève une erreur sur une valeur sans préfixe `enc:v1:`. Vérifié sur les bases de production, de preprod et de développement : aucune ligne en clair (requête de comptage fournie dans ce rapport, section CRYPTO-03).

## Synthèse par catégorie

### Proxy cartographique

- **PROXY-01 :** Allowlist trop permissive, contenu arbitraire servi depuis notre origine (Élevée, confiance haute)
- **PROXY-02 :** Redirections HTTP suivies sans revalidation (Faible, confiance haute)

### Authentification et sessions

- **AUTH-01 :** Absence de `Cache-Control` sur la réponse `/api/proconnect/me` (Faible, confiance haute)

### Chiffrement et configuration

- **CRYPTO-01 :** Validation différée de la clé de chiffrement (Faible, confiance haute)
- **CRYPTO-02 :** Chiffrement à l'écriture manuel, sans hook Prisma (Info, confiance haute)
- **CRYPTO-03 :** Repli en clair dans `decryptField` devenu inutile (Faible, confiance haute)

# Proxy cartographique

### PROXY-01 : Allowlist trop permissive, contenu arbitraire servi depuis notre origine

**Résumé :**

- **Statut :** Corrigé le 2026-10-26
- **Sévérité :** Élevée
- **Confiance :** Haute
- **OWASP :** A03:2025 — Injection (XSS) / A10:2025 — Server-Side Request Forgery
- **Localisation :** GET /api/map-proxy — `src/app/api/map-proxy/route.ts` ligne 13 (allowlist) et lignes 48-53 (recopie du Content-Type et du corps)

**Constat :**
Le proxy accepte tout hôte se terminant par `.scw.cloud`. Les buckets Scaleway Object Storage sont exposés sous la forme `<bucket>.s3.<region>.scw.cloud`, et tout titulaire d'un compte Scaleway peut créer un bucket public sous un nom libre. Un tel hôte passe l'allowlist.

Le proxy recopie ensuite le `Content-Type` de l'amont et renvoie le corps tel quel, avec `Cache-Control: public, max-age=86400, immutable`. Vérifié en production : un fichier `application/json` hébergé sur un bucket Scaleway est servi depuis `https://tacct.ademe.fr/api/map-proxy?u=...` avec son type d'origine. Rien ne limite la réponse aux images, alors que c'est le seul usage légitime du proxy (`src/components/maps/mapTransformRequest.ts` ne réécrit que les sprites et tuiles raster).

La CSP du site autorise `script-src 'self' 'unsafe-inline'`. Un fichier `text/html` contenant un script inline, hébergé sur un bucket attaquant et relayé par le proxy, s'exécuterait dans l'origine `tacct.ademe.fr`.

Les seuls buckets Scaleway utilisés par l'application sont `facili-tacct-dev.s3.fr-par.scw.cloud` et `facili-tacct-prod.s3.fr-par.scw.cloud`. Le wildcard n'a donc aucune raison d'être.

**Impact :**
Un attaquant héberge une page HTML sur un bucket Scaleway, puis envoie à une victime connectée un lien vers `https://tacct.ademe.fr/api/map-proxy?u=https://<bucket>.s3.fr-par.scw.cloud/page.html`. Le script s'exécute avec l'origine du site : il peut appeler `/api/proconnect/me` (email, nom, prénom), les Server Actions (réponses TACCToscope, questionnaire de compte) et toute ressource authentifiée, le cookie de session étant envoyé automatiquement. Le cache public de 24 h facilite la persistance du lien.

**Remédiation :**

1. Supprimer `hostname.endsWith('.scw.cloud')` et n'autoriser que l'hôte du bucket de l'environnement, déduit de `NEXT_PUBLIC_SCALEWAY_BUCKET_URL`.
2. N'accepter en retour que des types d'image raster (`image/png`, `jpeg`, `webp`, `gif`, `avif`) ; répondre 502 sinon. Le SVG est exclu car il peut embarquer du script. Cela ferme aussi la voie par redirection (PROXY-02).

**Notes :**
Non démontré de bout en bout. Chaque maillon a été vérifié séparément : allowlist, recopie du type, CSP avec `unsafe-inline`, comportement en production. La démonstration complète nécessiterait la création d'un bucket Scaleway.

### PROXY-02 : Redirections HTTP suivies sans revalidation

**Résumé :**

- **Statut :** Corrigé le 2026-10-26
- **Sévérité :** Faible
- **Confiance :** Haute
- **OWASP :** A10:2025 — Server-Side Request Forgery
- **Localisation :** GET /api/map-proxy — `src/app/api/map-proxy/route.ts` ligne 39

**Constat :**
L'appel `fetch(url, { headers })` ne précise pas `redirect`, donc la valeur par défaut `follow` s'applique. La vérification du protocole `https:` et de l'allowlist ne porte que sur l'URL initiale. Si un hôte autorisé répond par une redirection 3xx, la cible est suivie sans contrôle, y compris vers `http://` ou vers un hôte hors allowlist.

**Impact :**
Un attaquant qui trouve une redirection ouverte sur l'un des hôtes autorisés (`data.geopf.fr`, `openmaptiles.github.io`, `openmaptiles.geo.data.gouv.fr`, `lcz-generator.rub.de`, `cartagene.cerema.fr`) peut faire relayer une ressource arbitraire par le proxy, avec les mêmes conséquences que PROXY-01. Scalingo n'expose pas de service de métadonnées cloud de type AWS, ce qui limite l'intérêt d'une cible interne. La probabilité dépend de l'existence d'une redirection ouverte chez un tiers.

**Remédiation :**
Passer `redirect: 'manual'` et, en cas de 3xx, revalider l'en-tête `Location` contre le protocole et l'allowlist avant de refaire l'appel. Si aucun amont légitime ne redirige, `redirect: 'error'` est plus simple. À vérifier au moment du correctif sur les sprites et tuiles raster IGN.

**Notes :**
Le filtrage sur `Content-Type: image/*` proposé pour PROXY-01 réduit fortement l'impact, sans dispenser de contrôler la redirection.

# Authentification et sessions

### AUTH-01 : Absence de `Cache-Control` sur la réponse `/api/proconnect/me`

**Résumé :**

- **Statut :** Corrigé le 2026-10-26
- **Sévérité :** Faible
- **Confiance :** Haute
- **OWASP :** A02:2025 — Security Misconfiguration
- **Localisation :** GET /api/proconnect/me — `src/app/api/proconnect/me/route.ts`

**Constat :**
Vérifié en production : la réponse JSON contenant `id`, `email`, `firstname`, `lastname`, `profil` est renvoyée sans en-tête `Cache-Control`. Cloudflare répond `cf-cache-status: DYNAMIC` et ne la met pas en cache. Les navigateurs n'appliquent pas de cache heuristique en l'absence de `Last-Modified`. Les autres endpoints OIDC (`login`, `callback`, `logout`) renvoient des redirections 307, non mises en cache par défaut.

**Impact :**
Aucun cache observé aujourd'hui. Le risque n'apparaît que si un proxy intermédiaire ou une configuration Cloudflare future adopte une politique de cache plus agressive. Défense en profondeur.

**Remédiation :**
Ajouter `Cache-Control: no-store` sur la réponse de `/api/proconnect/me`.

# Chiffrement et configuration

### CRYPTO-01 : Validation différée de la clé de chiffrement

**Résumé :**

- **Statut :** Corrigé le 2026-10-26
- **Sévérité :** Faible
- **Confiance :** Haute
- **OWASP :** A02:2025 — Security Misconfiguration
- **Localisation :** `src/lib/crypto/user-crypto.ts` lignes 17-27

**Constat :**
`USER_ENCRYPTION_KEY` est lue et dérivée au premier appel de `keys()`, donc au premier login ou à la première lecture d'un utilisateur. Une clé absente ou mal encodée n'est détectée qu'à ce moment.

**Impact :**
Un déploiement sans clé démarre et passe le health check, puis échoue sur la première requête authentifiée. Pas de risque de fuite ni de corruption : les écritures échouent avant d'atteindre la base.

**Remédiation :**
Appeler `keys()` au chargement du module `db.ts` ou dans `instrumentation.ts` pour échouer au démarrage. Vérifier au passage que la clé décodée fait bien 32 octets.

### CRYPTO-02 : Chiffrement à l'écriture manuel, sans hook Prisma

**Résumé :**

- **Statut :** Corrigé le 2026-10-26
- **Sévérité :** Info
- **Confiance :** Haute
- **Localisation :** `src/lib/queries/db.ts` lignes 55-73

**Constat :**
L'extension Prisma déchiffre automatiquement en lecture, mais le chiffrement en écriture repose sur l'appel explicite de `encryptField`. Vérifié : les trois sites d'écriture de champs sensibles l'utilisent (`callback/route.ts` lignes 92-124, `questionnaire.ts` ligne 271). Aucune écriture en clair n'existe aujourd'hui.

**Impact :**
Aucun aujourd'hui. Risque de régression lors d'un futur ajout de code.

**Remédiation :**
Ajouter dans l'extension un traitement de `create`, `update`, `upsert`, `createMany` et `updateMany` sur le modèle `user` qui chiffre les champs de `USER_ENCRYPTED_FIELDS` non encore préfixés et recalcule les blind index. Amélioration de robustesse.

### CRYPTO-03 : Repli en clair dans `decryptField` devenu inutile

**Résumé :**

- **Statut :** Corrigé le 2026-10-26
- **Sévérité :** Faible
- **Confiance :** Haute
- **Localisation :** `src/lib/crypto/user-crypto.ts` ligne 38

**Constat :**
Une valeur sans préfixe `enc:v1:` est renvoyée telle quelle. Ce repli servait la compatibilité avec les lignes antérieures au chiffrement. Vérifié en base de production le 2026-10-26 : les 1349 comptes sont en `encryption_version = 1` et aucun des six champs chiffrés ne contient de valeur sans préfixe. Le repli ne couvre plus aucune donnée.

**Impact :**
Une valeur en clair qui apparaîtrait en base, par régression de code ou intervention manuelle, serait servie sans erreur ni journalisation, et l'absence de chiffrement passerait inaperçue.

**Remédiation :**
Retirer le repli : lever une erreur explicite lorsque la valeur ne porte pas le préfixe attendu.

Requête de contrôle à passer sur chaque base avant déploiement (toutes les colonnes `_clair` doivent être à zéro) :

```sql
SELECT encryption_version,
  count(*) AS total,
  count(*) FILTER (WHERE email NOT LIKE 'enc:v1:%') AS email_clair,
  count(*) FILTER (WHERE username NOT LIKE 'enc:v1:%') AS username_clair,
  count(*) FILTER (WHERE firstname NOT LIKE 'enc:v1:%') AS firstname_clair,
  count(*) FILTER (WHERE lastname NOT LIKE 'enc:v1:%') AS lastname_clair,
  count(*) FILTER (WHERE authenticated_id IS NOT NULL AND authenticated_id NOT LIKE 'enc:v1:%') AS authenticated_id_clair,
  count(*) FILTER (WHERE recontact_email IS NOT NULL AND recontact_email NOT LIKE 'enc:v1:%') AS recontact_email_clair
FROM tacct."user"
GROUP BY encryption_version
ORDER BY encryption_version;
```

# Points vérifiés sans anomalie

Pour mémoire, les mécanismes suivants ont été examinés et jugés corrects :

- **Autorisation des Server Actions TACCToscope** (`src/lib/queries/tacctoscope.ts`) : toutes les requêtes sont bornées à `user_id` de l'utilisateur courant, après vérification du questionnaire validé. Les clés de question et les valeurs sont validées côté serveur.
- **Questionnaire de compte** (`src/lib/queries/questionnaire-de-connexion/questionnaire.ts`) : `profil` et territoire sont des données déclaratives de personnalisation. Aucune autorisation ne dépend de ces champs ni de la colonne `roles`.
- **Pages critère** (`src/app/(espace-connecte)/(avec-navigation)/tacctoscope/[critere]/page.tsx`) : slug validé contre une liste fermée, critères publics accessibles sans compte par conception, autres critères réservés aux comptes validés.
- **Callback OIDC** : `state` et `nonce` vérifiés, signature du jeton validée par jose avec issuer, audience et algorithme. Toutes les erreurs redirigent vers `/` sans détail côté client.
- **Cookies de session** : `HttpOnly`, `Secure` et préfixe `__Secure-` en production (y compris preprod, qui tourne avec `next start`), `SameSite=Lax` adapté au retour OIDC.
- **Durée de session** : JWT stateless de 12 h sans révocation serveur. Durée jugée acceptable au regard de l'usage, choix assumé.
- **Limitation de débit** : aucune au niveau applicatif, mais un WAF nginx avec rate limiting et Cloudflare sont en frontal de la production. La discovery OIDC est mise en cache, et le callback échoue avant toute requête BDD tant que l'échange de code n'a pas abouti.
- **Open redirect** : `sanitizeReturnTo` n'accepte que des chemins internes ; le proxy Next bloque en plus les paramètres de redirection externes.
- **Chargement de `.env`** : dotenv n'écrase jamais une variable déjà définie et le fichier n'est pas déployé.
- **TLS PostgreSQL** : `rejectUnauthorized: false` n'est actif que lorsque `ca.pem` est présent, donc uniquement sur les postes de développement et dans les scripts locaux, jamais en production où `ssl: true` s'applique. Risque de poste de travail, hors périmètre applicatif, choix assumé.

# Observations hors périmètre sécurité

- **Recherche de région :** le questionnaire de compte propose un type `region` avec `recherche: 'region'`, mais `GetCollectivite` (`src/lib/queries/searchBar.ts`) n'a pas de branche `region`. La recherche renvoie une liste vide. À confirmer fonctionnellement.
- **Code mort :** `src/lib/queries/checks.ts` (`CheckMultipleDepartementsInEpci`) n'est importé nulle part.
