# Règles du WAF de TACCT

Ce dossier décrit le WAF Caddy + Coraza qui protégera TACCT sur la VM `waf-1` de l'incubateur. Il est construit par Coolify à chaque merge qui le touche, à partir de l'image `ghcr.io/incubateur-ademe/waf-base`, qui vérifie les règles avant de les servir. Tant que le WAF n'est pas mis en service, ce dossier n'a aucun effet sur la prod : `tacct-nginx` reste le WAF en place.

| Fichier | Rôle |
|---|---|
| `Dockerfile` | deux lignes identiques dans chaque repo, à ne pas modifier |
| `waf.yaml` | contacts et zones de rate limit |
| `coraza/config.conf` | niveau de paranoïa, seuil de blocage, méthodes admises |
| `coraza/before.conf` | exclusions conditionnées par un chemin ou un en-tête, règles de durcissement |
| `coraza/after.conf` | exclusions de cibles, chargées après la CRS |

Les règles s'écrivent en SecLang, la syntaxe de la doc CRS sur les exclusions, limitée à des formes en liste blanche. Chaque instruction est précédée d'un commentaire qui en donne la raison. Les formes admises et leurs bornes sont dans `policy/formes.yaml` de `incubateur-ademe/waf-base`.

Toute modification de ce dossier passe par une PR relue par l'équipe `secops`.

## Reprise de tacct-nginx

Règles propres à TACCT dans `tacct-nginx` (branche `caddy-coraza`, `d33d94a`, déployée) et leur place ici :

| tacct-nginx | Ici | Écart |
|---|---|---|
| zone `par_ip`, 40/s par IP hors `/api/map-proxy` | `waf.yaml`, `default` | aucun |
| zone `tuiles_par_ip`, 100/s par IP sur `/api/map-proxy` | `waf.yaml`, zone `tuiles` | aucun |
| `text/plain` admis sur toutes les routes (`crs-setup.conf`, 900220) | `coraza/before.conf`, 31001 et 31002 | admis seulement avec l'en-tête `Next-Action` et sous `/workspace-tacct/` ; ailleurs, un corps `text/plain` prend un 403 (920420) |
| cookie PostHog `ph_phc_*` hors CRS (`secrules.conf`) | `coraza/after.conf` | aucun |
| paranoïa 1, seuil 5 (défauts de la CRS) | `coraza/config.conf`, 30001 | aucun |
| blocage actif (949110 gardée) | socle `waf-base` | aucun |

Le reste de la conf de `tacct-nginx` est porté par le socle : inspection des réponses coupée, limite de corps de 12,5 Mio, compression, en-tête `Host` de l'amont et réécriture de `Location` (`host_header: upstream` dans l'inventaire de `waf-base`).

Écarts qui viennent du socle, relevés au rejeu comparatif du 2026-11-18 :

- CRS 4.25.2 au lieu de 4.25.0. Elle inspecte aussi le chemin (règle 932130) : un chunk webpack nommé par route, avec des crochets comme `[slug]`, y prendrait un 403. Le build de prod passe par Turbopack, qui nomme ses chunks par empreinte : pas d'effet aujourd'hui. Les types `application/*+json` passent en plus, corps inspecté en JSON.
- Plus de 1000 arguments par source (query, formulaire, feuilles d'un JSON) : 400 (règles 200004 et 200005).
- Chemin qui contient un segment `.` ou `..`, en clair ou encodé : 403 (règle 10050). Next.js n'en produit pas.
- Seules les plages privées sont des proxys de confiance. Les plages Cloudflare de `tacct-nginx` ne sont pas reprises. Derrière un enregistrement Cloudflare proxifié, l'IP vue est celle du nœud Cloudflare, et le rate limit s'applique par nœud.
- Un domaine absent de l'inventaire de `waf-base` reçoit un 421. HSTS et `nosniff` sont posés quand l'app ne les pose pas.
- Pas de journal d'accès : seuls les 403 sont journalisés, en JSON. Les modes `--analyse` et `--trafic` de `scripts/test-waf.sh` de `tacct-nginx` ne s'appliquent pas.

## Vérifier en local

L'image de base étant privée, on la reconstruit depuis son dépôt public :

```sh
docker build -t waf-base:local https://github.com/incubateur-ademe/waf-base.git#main
docker build --build-arg WAF_BASE=waf-base:local waf/
```
