# Shannon : audit de sécurité applicatif assisté par IA

## 🎯 Pourquoi Shannon ?

[Shannon](https://github.com/KeygraphHQ/shannon) (édition **Shannon Lite**, AGPL-3.0, éditée par Keygraph) est un outil de **pentest autonome piloté par IA**. On l'utilise pour vérifier qu'une version de l'application ne contient pas de failles exploitables avant une mise en production.

C'est un outil **white-box** : il a besoin à la fois de l'**application qui tourne** (une URL) _et_ du **code source** du dépôt. Il combine une analyse du code (SAST agentique) et une exploration dynamique de l'application pour chercher et, optionnellement, **confirmer** des vulnérabilités.

Classes de vulnérabilités couvertes : **injection, XSS, SSRF, authentification / autorisation**. Il ne couvre pas tout (ex. dépendances tierces vulnérables) : ce n'est pas un remplaçant d'un `npm audit` ou d'un audit complet.

---

## 🧠 Comment ça marche

```
┌────────────────────┐        ┌─────────────────────────────┐
│  Shannon (Node)    │        │  Worker Shannon (conteneur) │
│  côté WSL2         │──────▶ │  Docker Desktop            │
│  - lit la config   │        │  - exécute les requêtes     │
│  - lit le code (-r)│        │    vers l'app cible (-u)    │
└────────────────────┘        └──────────────┬──────────────┘
                                             │
                                             ▼
                              ┌─────────────────────────────┐
                              │  App tacct (local)          │
                              │  next dev — BDD jetable     │
                              └─────────────────────────────┘
```

- Le process **Node** (côté WSL2) orchestre le scan, lit la configuration et monte le dépôt **en lecture seule** (`-r`) : le code source n'est jamais modifié.
- Le **worker** tourne dans un **conteneur Docker** et c'est lui qui envoie les requêtes vers l'application.
- L'intelligence (choix des attaques, analyse) passe par un **modèle IA** (l'API Anthropic / Claude par défaut), facturé à l'usage.

Le rapport final est produit en Markdown, avec des étapes de reproduction (PoC) quand une faille est confirmée.

---

## 🔒 Modèles IA bloqués : classifiers de sécurité & programme CVP

C'est **le** point à comprendre avant de lancer un scan avec Claude.

L'API Anthropic applique des **classifiers de sécurité en temps réel** sur les requêtes « cyber ». La **validation / exécution d'exploits** — exactement ce que fait la phase d'exploitation de Shannon — peut être **interrompue ou bloquée** en plein scan. Ce blocage vient de l'API, pas d'un bug de Shannon.

Deux conséquences pratiques :

- **Les modèles récents (famille 5.x : Opus 5.5, Sonnet 5.5, Mythos 5.1…) embarquent ces classifiers.** Les **modèles plus anciens** (ex. `claude-haiku-4-5`, `claude-sonnet-4-x`) sont **moins concernés** et conviennent bien pour un premier scan à moindre coût.
- Pour utiliser les modèles récents sur de l'offensif autorisé, il faut passer par le **Cyber Verification Program (CVP)** d'Anthropic, qui lève ce blocage pour les professionnels de la sécurité vérifiés.

### Le CVP en bref

- Candidature **au niveau de l'organisation** (pas individuelle), via le portail **portal.anthropic.com/programs/cvp**, par un **admin** de l'org Console.
- Trois niveaux : **Defense**, **Red Team**, **Specialized**.
    - Un **individu** ne peut obtenir que **Defense** (défensif non offensif : revue de code, threat modeling, triage).
    - **Faire tourner des exploits = tier Red Team**, réservé aux **organisations**.
- La candidature Red Team demande une **vérification d'identité**, une **description du use case** et une **attestation des contrôles de sécurité**. La **rétention de données** est obligatoire (comptes Zero Data Retention non éligibles).
- **Délai Red Team : « quelques semaines ».** En attendant, l'org est enrôlée en **Defense** (qui ne couvre pas l'exécution d'exploits).

### Donc, deux stratégies

| Stratégie         | Modèle                        | Phase d'exploitation            | Quand                                |
| ----------------- | ----------------------------- | ------------------------------- | ------------------------------------ |
| **Rodage rapide** | ancien modèle (ex. Haiku 4.5) | désactivée (`exploit: "false"`) | tout de suite, sans CVP              |
| **Scan complet**  | modèle récent via CVP         | activée (`exploit: "true"`)     | une fois l'accès **Red Team** obtenu |

> En clair : **soit on utilise un modèle plus ancien / moins restreint et on reste sur de la reconnaissance + SAST, soit on remplit le dossier CVP** pour débloquer l'exploitation avec un modèle récent.

---

## 🪟 Pourquoi WSL2 sous Windows

**Shannon refuse de tourner sur Windows natif — et sur Git Bash.** Il faut le lancer **depuis WSL2** (Ubuntu), avec **Docker Desktop** configuré en backend WSL2.

Piège classique : WSL2 hérite du `PATH` de Windows. Si aucun **Node n'est installé _dans_ Ubuntu**, la commande `npx` exécute le **`node.exe` de Windows** → Shannon détecte « native Windows » et refuse. Il faut donc un **Node installé dans WSL** (via nvm), prioritaire dans le `PATH`.

---

## 🌐 Pourquoi cibler l'IP LAN et pas `localhost`

L'application tourne sur l'**hôte Windows** (`next dev`). Le worker Shannon tourne dans un **conteneur Docker**. Un conteneur **ne joint pas le `localhost` de l'hôte**.

- `host.docker.internal` fonctionne **depuis un conteneur**, mais pas forcément depuis le **process Node de Shannon** (côté host WSL), qui fait une **vérification de connectivité pré-scan**. D'où l'erreur `InvalidTargetError` si on l'utilise.
- La solution robuste est de viser l'application par l'**IP LAN de la machine Windows** (ex. `192.168.1.10`), **joignable des deux côtés** : host WSL _et_ conteneur worker. C'est le même principe que le test cartographie iOS via IP LAN.

> ⚠️ L'IP LAN est en DHCP : elle peut changer. On la revérifie avec `ipconfig` si un scan échoue soudainement sur la cible.

---

## ⚠️ Règles de sécurité — à ne jamais oublier

Shannon **exécute réellement des attaques** : il peut créer des comptes, soumettre des formulaires, modifier l'état de l'application.

- **Jamais sur la production ni la préprod.** Uniquement une **instance locale** pointée sur une **base de données jetable** (pas la vraie base, qui contient des PII chiffrées).
- Tester **uniquement des systèmes qu'on est autorisé à tester** (ici, notre propre application).
- La **clé API** ne doit **jamais** être committée ni apparaître dans une capture d'écran. Si elle a fuité, on la **révoque** dans la Console et on en régénère une.

Voir la marche à suivre dans [comment-faire/shannon.md](../comment-faire/shannon.md).
