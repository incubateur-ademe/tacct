# Lancer un scan de sécurité Shannon

## 🎯 Objectif

Lancer un audit de sécurité de l'application avec [Shannon](https://github.com/KeygraphHQ/shannon), sous Windows. Pour le **pourquoi** et les concepts (modèles bloqués, CVP, réseau), voir [explications/shannon.md](../explications/shannon.md).

> ⚠️ **Local uniquement, base jetable.** Shannon exécute de vraies attaques. Ne jamais le pointer vers la prod ou la préprod.

## 🛠️ Prérequis

- **WSL2** (Ubuntu) — Shannon ne tourne **pas** sur Windows natif ni Git Bash.
- **Docker Desktop** avec backend WSL2 activé.
- **Node 18+ installé _dans_ WSL** (pas le Node de Windows).
- Une **clé API Anthropic** (org Console).
- L'application **lancée en local** sur une **BDD jetable**.

---

## 1️⃣ Setup initial (une seule fois)

### a. WSL2 (PowerShell admin)

```powershell
wsl --install
wsl --set-default-version 2
wsl --list --verbose          # vérifier une distro en VERSION 2 (ex. Ubuntu-24.04)
```

### b. Docker Desktop → intégration WSL2

Dans **Docker Desktop → Settings** :

- _General_ → cocher **« Use the WSL 2 based engine »**
- _Resources → WSL Integration_ → **activer la distro** (Ubuntu-24.04)

### c. Node **dans** WSL (via nvm)

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
source ~/.bashrc
nvm install 22
# Vérifier : doit renvoyer un chemin ~/.nvm/... et PAS /mnt/c/... ni .exe
which node && node -v
```

### d. Fichier de config

Le fichier `shannon-config.yaml` est à la **racine du dépôt** et **gitignoré** (il peut contenir des credentials de test). S'il n'existe pas (ou a disparu après un `git clean`), le recréer depuis le [template en bas de ce document](#-recréer-le-fichier-de-config).

---

## 2️⃣ Avant chaque scan

### a. Lancer l'application en local (côté Windows, BDD jetable)

```bash
npm run dev     # app sur http://localhost:3000
```

### b. Récupérer l'IP LAN Windows (la cible ne doit **pas** être `localhost`)

```powershell
ipconfig        # relever l'« Adresse IPv4 » du réseau local, ex. 192.168.1.10
```

### c. Vérifier que le host WSL joint bien l'app

```bash
# dans WSL — doit afficher "HTTP/1.1 200 OK"
curl -sI --max-time 6 http://192.168.1.10:3000 | head -1
```

- `200 OK` → on peut scanner.
- timeout → c'est le **pare-feu Windows** qui bloque le sous-réseau WSL. Ajouter une règle entrante :

```powershell
# PowerShell admin
New-NetFirewallRule -DisplayName "Dev 3000 (WSL)" -Direction Inbound -LocalPort 3000 -Protocol TCP -Action Allow
```

---

## 3️⃣ Premier scan

```bash
# dans WSL, à la racine du dépôt
cd /mnt/c/path/to/depot

export ANTHROPIC_API_KEY=<ta_clé>
export SHANNON_AI_MODEL=anthropic:claude-<modele>

npx @keygraph/shannon@latest setup          # assistant de config des credentials
npx @keygraph/shannon@latest start \
  -u http://192.168.1.10:3000 \
  -r . \
  -c ./shannon-config.yaml
```

---

## 4️⃣ Scans suivants (version courte)

Setup déjà fait → app lancée, IP vérifiée, puis :

```bash
cd /mnt/c/path/to/depot
export ANTHROPIC_API_KEY=<ta_clé>                               # les export ne survivent pas au shell
export SHANNON_AI_MODEL=anthropic:claude-<modele>
npx @keygraph/shannon@latest start -u http://192.168.1.10:3000 -r . -c ./shannon-config.yaml
```

> 💡 Adapter l'IP si `ipconfig` en renvoie une différente (DHCP).

---

## 🤖 Modèle à utiliser

Format attendu : `<provider>:<model-id>`.

- **Par défaut / rodage** : `anthropic:claude-haiku-4-5-20251001` (ancien, peu coûteux, peu sujet au blocage).
- **Modèles récents (5.x)** : nécessitent le **CVP – tier Red Team** pour l'exécution d'exploits (voir [explications](../explications/shannon.md#-modèles-ia-bloqués--classifiers-de-sécurité--programme-cvp)). Sans ça, le scan risque d'être **interrompu en plein milieu**.

Tant que l'accès Red Team n'est pas obtenu, garder `exploit: "false"` dans la config (reconnaissance + SAST uniquement).

---

## 🪟 Spécificités Windows

- **WSL2 obligatoire** : `npx` doit pointer vers le **Node de WSL** (`which node` → `~/.nvm/...`), sinon « native Windows ».
- **Cible = IP LAN**, pas `localhost` (le conteneur worker ne joint pas le `localhost` de l'hôte).
- **Dépôt** monté via `/mnt/c/...` (lecture seule côté Shannon).
- **Windows Defender** peut signaler le code d'exploit des rapports comme faux positif → exclure le dossier Shannon si besoin.

---

## 🧯 Dépannage rapide

| Message / symptôme                                 | Cause                                                                    | Fix                                                        |
| -------------------------------------------------- | ------------------------------------------------------------------------ | ---------------------------------------------------------- |
| `Shannon does not run on native Windows`           | `npx` lance le Node Windows                                              | Installer Node dans WSL (nvm), nouveau shell, `which node` |
| `InvalidTargetError` / target could not be reached | cible via `localhost` / `host.docker.internal` injoignable côté host WSL | Viser l'**IP LAN** (`ipconfig`) + vérifier avec `curl -sI` |
| `curl` timeout vers l'IP LAN depuis WSL            | pare-feu Windows bloque le sous-réseau WSL                               | Règle entrante port 3000 (voir §2c)                        |
| `Config file not found`                            | `shannon-config.yaml` absent (gitignoré, supprimé par `git clean`)       | Recréer depuis le template ci-dessous                      |
| Scan interrompu type _safety_                      | classifiers de sécurité du modèle                                        | Modèle plus ancien, ou CVP Red Team                        |
| `docker` introuvable dans WSL                      | intégration WSL non activée                                              | Docker Desktop → Resources → WSL Integration               |

---

## 📄 Recréer le fichier de config

À placer en `shannon-config.yaml` à la racine du dépôt (gitignoré) :

```yaml
description: >
    TACCT — application Next.js 16 (Prisma/PostgreSQL), auth fédérée
    AgentConnect (OIDC). Environnement LOCAL de dev uniquement, base de données
    jetable. NE PAS pointer vers la production ni la préprod.

rules_of_engagement: |
    - Limiter à moins de 5 requêtes par seconde par endpoint.
    - Plafonner les tentatives de login à 5 par compte.
    - Ne jamais émettre de requêtes vers des domaines tiers (IdP AgentConnect,
      APIs externes) : rester strictement sur l'hôte local cible.

# Auth : 1er scan NON authentifié (AgentConnect/OIDC fédéré non pilotable par Shannon).
# Pour scanner la surface authentifiée, exposer un login de test local et renseigner
# un bloc `authentication` (voir docs Shannon).

rules:
    avoid:
        - description: 'Ne pas déclencher le logout (invalide la session)'
          type: url_path
          value: '/logout'
        - description: "Ne pas solliciter l'IdP AgentConnect (tiers, hors périmètre)"
          type: url_path
          value: '/api/auth'
    focus:
        - description: 'Prioriser les routes API'
          type: url_path
          value: '/api'

agentic_sast:
    enabled: 'true'

# Exploitation désactivée tant que l'accès CVP Red Team n'est pas obtenu
# (évite un blocage par les classifiers et la mutation de la base).
# Repasser à "true" une fois Red Team approuvé.
exploit: 'false'

report:
    min_severity: low
```
