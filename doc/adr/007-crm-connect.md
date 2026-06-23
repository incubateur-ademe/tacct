# Intégration du CRM CONNECT (flux Contact via Mulesoft)

- 📅 Date : 23/06/2026
- 👷 Décision prise par : Antoine Conegero
- 📌 Statut : document de contexte **immuable**. Il fige les décisions d'intégration du CRM CONNECT prises avant le développement. Complément des ADR `005-fusion-tacct.md` et `006-chiffrement-donnees-sensibles.md`. Conçu pour être lu d'un bloc et permettre de reprendre le travail sans contexte préalable.

---

## 1. Contexte et objectif

Pour plus de clarté, l'outil legacy est intitulé "TACCT" (réécriture Next.js, dépôt `tacct-legacy-nextjs`, = `tacct-next` de l'ADR 005) et le nouvel outil d'accueil est nommé "Facili-TACCT".

**CONNECT** est le CRM choisi par l'ADEME pour gérer la relation client. **Mulesoft** est le composant technique d'intégration : **aucun appel ne se fait directement sur le CRM**, tout passe par les API Mulesoft.

**Objectif** : alimenter le CRM CONNECT avec les comptes usagers (objet *Contact*), de la même manière que le legacy historique le faisait, en l'adaptant à la nouvelle architecture deux-applications décrite par l'ADR 005.

---

## 2. Authentification aux API Mulesoft

- Accès accordé après demande et validation par l'administrateur Mulesoft.
- Mécanisme : **`client-id` + `client-secret`**, à transmettre **à chaque appel**.
- Couple d'identifiants **par environnement** (préprod / prod), à obtenir auprès de Mulesoft.
- La valeur du champ **`source`** est **imposée par l'équipe CRM** (« SOURCE DONNÉE PAR ÉQUIPE CRM ») et obligatoire à chaque appel.

⚠️ **Préalable bloquant** : sans `client_id`, `client_secret` et `source` de l'environnement cible, aucun appel ne passe. La demande de ces identifiants est en cours (au 23/06/2026).

---

## 3. Endpoints (URL à jour)

Les URL Mulesoft ont changé (migration technique annoncée par mail). **Utiliser uniquement les nouvelles** :

| Environnement | Base URL (nouvelle) | Base URL (ancienne, dépréciée) |
| --- | --- | --- |
| Production | `https://api-interne.ademe.fr/api/v1/` | `https://prd-x-ademe-interne-api.de-c1.eu1.cloudhub.io/api/v1/` |
| Préprod (recette) | `https://preprod-api-interne.ademe.fr/api/v1/` | `https://ppd-x-ademe-interne-api.de-c1.eu1.cloudhub.io/api/v1/` |

L'objet Contact est sous le chemin `personnes`.

| Opération | Méthode | Chemin | Notes |
| --- | --- | --- | --- |
| Création d'un contact | `POST` | `/api/v1/personnes` | corps = champs du contact |
| MAJ d'un contact | `PUT` | `/api/v1/personnes/mail/{mail}` | `{mail}` en paramètre d'URI |
| Récupération d'un contact | `GET` | `/api/v1/personnes/mail/{mail}` | « à utiliser uniquement si nécessaire et avec authentification de l'utilisateur au préalable » |

---

## 4. Contrat d'interface (objet Contact)

- **Champs obligatoires** : `email` (identifiant unique du contact) et `source` (valeur imposée par l'équipe CRM).
- **Ne jamais envoyer de balise vide** : n'inclure que les champs réellement renseignés.
- **Ne pas remplir** : `ExternalID` (réservé formations), `federationId` (Id Keycloak ADEME), `ancienMail`.
- **Dates** au format `yyyy-MM-ddT00:00:00` (`dateCreation`, `dateModification`, `dateConnexion`, etc.).
- Champs facultatifs utiles : `siret` (14 car.), `titre` (M./Mme), `nom`, `prenom`, adresse (`adressePostale`, `complementAdresse`, `cedexBP`, `codePostal`, `ville`), `region` (**liste fermée**), `telephone`, `telephonePortable`, `fonction`, `acceptationRGPD` (bool), `typeOrganisme` (**liste fermée**), `abonnementNewsletter`/`dateNewsletter`/`dateFinNewsletter`, `actif` (bool), `rubriques` (Array String, séparateur `,`).
- `rubriques` : tableau de tags à associer au contact, **usage à valider au préalable avec l'équipe CRM** (cf. §7, tag d'origine).
- Listes fermées `region` et `typeOrganisme` : valeurs exactes dans la doc source `tacct-legacy-nextjs/docs/INTEROPERABILITE CONNECT - Flux Objet Contact.pdf`.

**Comportement asynchrone (important)** : création et MAJ passent par une file d'attente (Anypoint MQ, queue `salesforce-q`) partagée entre plusieurs applications. Le **retour `200 OK` confirme seulement la mise en file**, pas le traitement effectif dans le CRM.

```json
{
  "correlationId": "8f6ae2d0-a59d-11ef-b99d-02b1e40858ff",
  "success": true,
  "timestamp": "2024-11-18T11:09:22.111Z",
  "message": "Contact envoyé à Anypoint MQ dans la queue salesforce-q",
  "mail": "jane.doe@alice.fr"
}
```

Codes retour : `200` OK (mis en file) / `400` Bad Request (contrat non respecté) / `500` Internal Server Error.

---

## 5. Comment le CRM était pluggé dans le legacy historique (référence)

Le legacy (Symfony, dépôt `tacct-gitlab`) servait de modèle. Architecture en 3 couches :

1. **Bundle externe** `ademe/crm-connect-bundle` (`^0.3`, GitLab privé ADEME) : porte les appels HTTP réels (auth `client_id`/`client_secret`, sérialisation JSON, omission des balises vides). Expose `CrmConnectInterface` (`add(Entry)`, `update(Entry)`) et l'entité `Entry`. **Non récupérable hors écosystème ADEME** → en Next.js, on réimplémentera un petit client HTTP équivalent.
2. **Service applicatif** `CRMConnectUserService` : mappe `User` → `Entry`.
   - `createUser` → `add()` (POST) : `email`, `nom` (= `lastname`), `prenom` (= `firstname`), `dateCreation` (= `createdAt`), `acceptationRGPD` (= `validatedTermsOfUse`).
   - `updateLastConnectionUser` → `update()` (PUT) : `email` + `dateConnexion` (= now).
3. **Appels asynchrones via Symfony Messenger** (jamais bloquants) : messages `CRMConnectUserCreationMessage` / `CRMConnectUserConnectionMessage` + handlers.

Points de déclenchement legacy :

| Événement | Message |
| --- | --- |
| Compte créé par admin (POST validé) | Creation |
| Compte **validé** par admin (`validated` false→true) | Creation |
| Création de compte (parcours libre) | Creation |
| **À chaque connexion** authentifiée | Connection (MAJ date) |

Config par variables d'env : `CRM_CONNECT_URL`, `CRM_CONNECT_CLIENT_ID`, `CRM_CONNECT_CLIENT_SECRET`, `CRM_CONNECT_SOURCE`. En dev local, l'URL pointait sur un **mock wiremock** (`docker/wiremock/mappings/crm-connect-{post,update}.json`).

---

## 6. Architecture cible (nouvelle, deux applications)

Rappel ADR 005 : Facili-TACCT possède l'authentification (ProConnect) ; TACCT lit la session. **Conséquence** : les deux événements CRM ne se produisent pas dans la même application. Il est **acceptable et attendu que les deux applications appellent le CRM** — c'est une API HTTP idempotente derrière une file d'attente, sans conflit.

**Notion clé** : il n'y a **pas de processus de création de compte**. Se connecter via ProConnect suffit. À l'authentification, si l'email/`sub` n'existe pas en base → le compte est **créé** ; s'il existe → on **accède** au compte existant. Les nouveaux comptes ont `validated = false` par défaut et n'accèdent **pas** à l'outil TACCT tant qu'un admin n'a pas activé le compte (passage `validated → true`).

### 6.1 Côté Facili-TACCT — au moment de l'authentification ProConnect

- **Compte inexistant (création)** → **créer la ligne Contact dans le CRM** (POST).
  - Mapping depuis les claims ProConnect : `email` = `email`, `prenom` = `given_name`, `nom` = `usual_name`, `dateCreation` = maintenant, `source` = valeur imposée, `acceptationRGPD` = `true` (CGU acceptées à la création, cf. ADR 005 §7).
- **Compte existant** → **mettre à jour le Contact** (PUT) avec la **date de connexion** (`dateConnexion` = maintenant).

### 6.2 Côté TACCT (ce dépôt, `tacct-legacy-nextjs`) — à l'activation du compte

- Lorsqu'un admin clique **« Activer le compte et créer l'étude »** et que `validated` passe **false → true** → **appel CRM**.
  - Emplacement : action serveur `activateAccount` dans `src/server/admin/actions.ts` (seul endroit où `validated` bascule ; commentaire actuel : « Keycloak/CRM restent gérés par le legacy » → à faire évoluer).
  - Contenu de l'appel : à préciser ; **probablement via le champ `rubriques`** pour le tag d'origine (cf. §7), sous réserve de validation de l'équipe CRM.

### 6.3 Synthèse des déclencheurs cibles

| Événement | Application | Opération CRM |
| --- | --- | --- |
| 1ʳᵉ auth ProConnect, compte inexistant | Facili-TACCT | POST (création contact) |
| Auth ProConnect, compte existant | Facili-TACCT | PUT (MAJ `dateConnexion`) |
| Activation admin (`validated` false→true) | TACCT (ce dépôt) | PUT/POST (+ tag origine éventuel) |

### 6.4 Mutualisation (optionnelle)

Pour éviter de dupliquer le code d'appel HTTP entre les deux apps, une petite couche client CRM partagée serait la version propre. Non obligatoire pour démarrer.

---

## 7. Tag d'origine du contact (legacy vs nouveau) — EN ATTENTE

Besoin : pouvoir filtrer dans le CRM les usagers selon leur origine (« origine TACCT legacy » vs « TACCT nouveau »).

- Piste privilégiée : champ **`rubriques`** (prévu pour des tags).
- **Statut : en attente de la réponse de l'équipe CRM** sur la disponibilité/usage du champ ou d'une colonne dédiée. Le champ `source` n'est **pas** détourné pour cet usage (il identifie l'application émettrice, valeur imposée).
- **Rien n'est figé tant que l'équipe CRM n'a pas confirmé.**

---

## 8. Stratégie de test

Du plus immédiat (sans accès CRM) au plus complet :

1. **Retour HTTP immédiat** : un `200 OK` + `correlationId` confirme que l'appel est valide et mis en file (contrat OK). Ne prouve **pas** l'arrivée effective dans le CRM. `400` = contrat mauvais, `500` = erreur côté Mulesoft.
2. **Relecture via `GET /personnes/mail/{mail}`** : pousser un contact de test puis le relire → vérification **bout en bout en self-service**, sans dépendre d'un tiers.
3. **Vérification dans CONNECT** : par une personne de l'équipe disposant d'un accès CRM.
4. **Dev local** : reproduire un **mock wiremock** (comme le legacy) pour tester le câblage sans toucher au vrai CRM.

Tests `curl` détaillés : à rédiger ultérieurement (nécessitent `client_id`/`client_secret`/`source` de l'environnement).

---

## 9. Variables d'environnement attendues

Par environnement (préprod / prod) et par application concernée :

- `CRM_CONNECT_URL` (base, ex. `https://preprod-api-interne.ademe.fr/api/v1`)
- `CRM_CONNECT_CLIENT_ID`
- `CRM_CONNECT_CLIENT_SECRET`
- `CRM_CONNECT_SOURCE` (valeur imposée par l'équipe CRM)

---

## 10. Points ouverts / à faire

- [ ] Obtenir `client_id` / `client_secret` (préprod puis prod) auprès de Mulesoft. *(demande en cours)*
- [ ] Obtenir la valeur de `source` auprès de l'équipe CRM.
- [ ] Confirmer le tag d'origine (`rubriques` ?) avec l'équipe CRM (§7).
- [ ] Implémenter le push **création/MAJ** à l'authentification côté **Facili-TACCT** (§6.1).
- [ ] Implémenter le push à l'**activation** côté **TACCT** dans `activateAccount` (§6.2).
- [ ] Décider de la mutualisation d'un client CRM partagé (§6.4).
- [ ] Rédiger les tests `curl` et le mock wiremock local (§8).
- [ ] **Corriger l'ADR 005 §7** : il indique `validated = true` à la création, alors que le défaut réel est `false` (l'accès n'est ouvert qu'après activation admin).

---

## 11. Synthèse des décisions

- CRM CONNECT alimenté via Mulesoft uniquement (auth `client_id`/`client_secret` à chaque appel ; `source` imposée).
- Endpoints à jour : `api-interne.ademe.fr` (prod) / `preprod-api-interne.ademe.fr` (préprod).
- Objet Contact : `email` + `source` obligatoires, pas de balise vide, dates `yyyy-MM-ddT00:00:00`, traitement asynchrone (200 = mis en file).
- Deux applications appellent le CRM, chacune sur l'événement qui lui appartient : Facili-TACCT à l'authentification (création si nouveau, MAJ `dateConnexion` sinon) ; TACCT à l'activation admin (`validated` false→true).
- Tag d'origine en attente de l'équipe CRM (piste `rubriques`).
- Tests : 200/`correlationId`, relecture GET, vérification CRM par un tiers, mock wiremock en local.
