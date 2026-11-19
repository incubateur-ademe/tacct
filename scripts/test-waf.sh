#!/usr/bin/env bash
# Tests de bout en bout du WAF Coraza de waf-1 : Cloudflare -> Traefik -> WAF -> tacct-prod.
# Usage : bash scripts/test-waf.sh
# Prérequis : curl >= 7.83, aucun VPN, CLI scalingo connectée pour la colonne PROD.
set -u

BASE="https://tacct.ademe.fr"
HOTE_DIRECT="facili-tacct.beta.gouv.fr"
PROD_APP="${PROD_APP:-tacct-prod}"
REGION="${REGION:-osc-secnum-fr1}"
WSL_DISTRIB="${WSL_DISTRIB:-Ubuntu}"
CIBLE="/sitemap.xml"
LIMITE_DEFAUT=40
LIMITE_TUILES=100
CHEMIN_TUILES="/api/map-proxy"
RUN="wt$(date +%H%M%S)"
TMP="$(mktemp -d)"
POSTHOG='%7B%22%24initial_person_info%22%3A%7B%22r%22%3A%22%24direct%22%7D%7D'
XSS='%3Cscript%3Ealert(1)%3C%2Fscript%3E'
ACTION="Next-Action: 7f0000000000000000000000000000000000000000"
TESTS=()
declare -A ATT OBS KIND LOC CC LOCATT DUREE

compte() { sort | uniq -c | awk '{printf "%sx%s ", $1, $2}'; }

une() {
  local nom="$1" att="$2" adr="$3" code src; shift 3
  : > "$TMP/$nom.corps"; : > "$TMP/$nom.ent"
  code=$(curl -s -g --max-time 60 -o "$TMP/$nom.corps" -D "$TMP/$nom.ent" -w '%{http_code}' "$@" "$adr" 2>/dev/null)
  if [ "$code" = 000 ]; then src=erreur
  elif grep -qi '^via:.*caddy' "$TMP/$nom.ent"; then src=prod
  elif grep -qi cloudflare "$TMP/$nom.corps"; then src=Cloudflare
  elif grep -qx '404 page not found' "$TMP/$nom.corps"; then src=Traefik
  elif grep -q '<title>Site not available</title>' "$TMP/$nom.corps"; then src=proxy
  else src=WAF; fi
  TESTS+=("$nom"); KIND[$nom]=une; ATT[$nom]="$att"; OBS[$nom]="$code $src"
  LOC[$nom]=$(grep -i '^location:' "$TMP/$nom.ent" | head -1 | cut -d' ' -f2- | tr -d '\r')
  CC[$nom]=$(grep -i '^cache-control:' "$TMP/$nom.ent" | head -1 | cut -d' ' -f2- | tr -d '\r')
  printf '  %-15s %s%s\n' "$nom" "${OBS[$nom]}" "${LOC[$nom]:+ -> ${LOC[$nom]}}"
}

lot() {
  local nom="$1" att="$2" n="$3" chemin="$4" i http; shift 4
  local cfg="$TMP/$nom.cfg"
  : > "$cfg"
  for i in $(seq 1 "$n"); do
    printf 'url = "%s"\noutput = "/dev/null"\n' "$BASE$chemin?waftest=$RUN-$nom-$i" >> "$cfg"
  done
  "${CURL_LOT[@]}" -sS -g --max-time 60 -w '%{http_code} %{http_version} %header{via}\n' "$@" -K - \
    < "$cfg" > "$TMP/$nom.curl" 2> "$TMP/$nom.err"
  DUREE[$nom]=$(sed -n 's/^DUREE //p' "$TMP/$nom.curl")
  grep -v '^DUREE ' "$TMP/$nom.curl" \
    | awk '{ if ($1 == "000") print "000 erreur"; else print $1, (tolower($0) ~ /caddy/ ? "prod" : "WAF") }' > "$TMP/$nom.brut"
  http=$(grep -v '^DUREE ' "$TMP/$nom.curl" | awk '$1 != "000" { print "HTTP/" $2 }' | sort -u | paste -sd, -)
  TESTS+=("$nom"); KIND[$nom]=lot; ATT[$nom]="$att"
  OBS[$nom]=$(sed 's/ /_/' "$TMP/$nom.brut" | compte)
  printf '  %-15s %s(%s ms, %s)\n' "$nom" "${OBS[$nom]}" "${DUREE[$nom]:-?}" "${http:-?}"
  if [ -s "$TMP/$nom.err" ]; then
    printf '  %-15s erreurs curl : %s\n' "" "$(sort "$TMP/$nom.err" | uniq -c | head -3 | sed 's/^ *//' | paste -sd';' -)"
  fi
}

rafale() {
  local nom="$1" limite="$2" statut="$3" chemin="$4" n=$(($2 + 20))
  local -a CURL_LOT=("${CURL_RAFALE[@]}")
  sleep 2
  lot "$nom" "${limite}x${statut}_prod 20x429_WAF" "$n" "$chemin" --parallel-max "$n"
  KIND[$nom]=rafale
}

ip_test() {
  local nom="$1" att="$2" adr="$3" vu; shift 3
  vu=$(curl -s --max-time 10 "$@" "$adr" 2>/dev/null | tr -d '\r\n')
  TESTS+=("$nom"); KIND[$nom]=ip; ATT[$nom]="${att:-?}"; OBS[$nom]="${vu:-?}"
  printf '  %-15s %s\n' "$nom" "${OBS[$nom]}"
}

canon() {
  une "$1" "301 WAF" "https://$2$CIBLE?waftest=$RUN-$1-1"
  KIND[$1]=canon; LOCATT[$1]="$BASE$CIBLE?waftest=$RUN-$1-1"
}

conforme() {
  local obs="$1" alt
  local -a alts
  IFS='|' read -ra alts <<< "$2"
  for alt in "${alts[@]}"; do
    [ "${alt#* }" = "${obs#* }" ] || continue
    [ "${alt%% *}" = "*" ] || [ "${alt%% *}" = "${obs%% *}" ] && return 0
  done
  return 1
}

lot_conforme() {
  awk -v att="$2" 'BEGIN { n = split(att, a, "+"); for (i = 1; i <= n; i++) voulu[a[i]] = 1 }
    { vu[$0] = 1; if (!($0 in voulu)) ko = 1 }
    END { for (v in voulu) if (!(v in vu)) ko = 1; exit ko }' "$1"
}

lire_logs() {
  local essai
  for essai in 1 2 3; do
    scalingo --region "$REGION" --app "$1" logs --lines 10000 2>/dev/null \
      | grep -E '^[0-9]{4}-[0-9]{2}-[0-9]{2} ' > "$2"
    [ -s "$2" ] && return 0
    sleep 5
  done
  echo "  ÉCHEC : logs de $1 illisibles (CLI ou API Scalingo), colonne PROD non vérifiée" >&2
  return 1
}

CHRONO='d=$(date +%s%N); "$@"; echo "DUREE $(( ($(date +%s%N) - d) / 1000000 ))"'
CURL_LOT=(sh -c "$CHRONO" sh curl)
if wsl -d "$WSL_DISTRIB" --exec curl -V 2>/dev/null | grep -q HTTP2; then
  CURL_RAFALE=(wsl -d "$WSL_DISTRIB" --exec sh -c "$CHRONO" sh curl -Z)
else
  CURL_RAFALE=(sh -c "$CHRONO" sh curl -Z --parallel-immediate)
  echo "curl avec HTTP/2 introuvable dans WSL ($WSL_DISTRIB) : rafales envoyées sans HTTP/2, trop lentes pour conclure"
fi

IP4=$(curl -4 -s --max-time 10 "$BASE/cdn-cgi/trace" 2>/dev/null | sed -n 's/^ip=//p' | tr -d '\r')
IP6=$(curl -6 -s --max-time 10 "$BASE/cdn-cgi/trace" 2>/dev/null | sed -n 's/^ip=//p' | tr -d '\r')

echo "RUN=$RUN ($(date '+%H:%M:%S'))  ->  $BASE"
echo "IP vues par Cloudflare : IPv4 ${IP4:-aucune}, IPv6 ${IP6:-aucune}"
echo "== Réponses reçues"
ip_test ip_cf_v4 "$IP4" "$BASE/__waf/ip" -4 -H "X-Forwarded-For: 1.2.3.4"
[ -n "$IP6" ] && ip_test ip_cf_v6 "$IP6" "$BASE/__waf/ip" -6 -H "X-Forwarded-For: 1.2.3.4"
ip_test edge_faux "$IP4" "https://$HOTE_DIRECT/__waf/ip" -4 -H "CF-Connecting-IP: 198.51.100.7" -H "X-Ademe-Edge: $(printf 'x%.0s' $(seq 1 40))"
ip_test edge_sans "$IP4" "https://$HOTE_DIRECT/__waf/ip" -4 -H "CF-Connecting-IP: 198.51.100.7"
lot base "200 prod" 3 "$CIBLE"
une xss "403 WAF" "$BASE$CIBLE?waftest=$RUN-xss-1&q=$XSS"
une sqli "403 WAF" "$BASE$CIBLE?waftest=$RUN-sqli-1&id=1%27%20OR%20%271%27%3D%271"
une lfi "403 WAF" "$BASE$CIBLE?waftest=$RUN-lfi-1&file=..%2F..%2F..%2F..%2Fetc%2Fpasswd"
une rce "403 WAF" "$BASE$CIBLE?waftest=$RUN-rce-1&cmd=%3Bcat%20%2Fetc%2Fpasswd"
une scanner "403 Cloudflare|403 WAF" "$BASE/waf-test?waftest=$RUN-scanner-1" -A "sqlmap/1.7.2#stable (https://sqlmap.org)"
une log4j "403 Cloudflare|403 WAF" "$BASE/waf-test?waftest=$RUN-log4j-1" -H 'X-Api-Version: ${jndi:ldap://127.0.0.1/a}'
une fpposthog "200 prod" "$BASE$CIBLE?waftest=$RUN-fpposthog-1" -H "Cookie: ph_phc_testwaf_posthog=$POSTHOG"
une fptemoin "403 WAF" "$BASE$CIBLE?waftest=$RUN-fptemoin-1" -H "Cookie: cookie_temoin=$POSTHOG"
une action_avec "* prod" "$BASE$CIBLE?waftest=$RUN-action_avec-1" -X POST -H "$ACTION" -H "Content-Type: text/plain;charset=UTF-8" --data-binary '["test"]'
une action_sans "403 WAF" "$BASE$CIBLE?waftest=$RUN-action_sans-1" -X POST -H "Content-Type: text/plain;charset=UTF-8" --data-binary '["test"]'
une json "400 WAF" "$BASE$CIBLE?waftest=$RUN-json-1" -X POST -H "Content-Type: application/json" --data-binary '{"a":'
une multipart "400 WAF" "$BASE$CIBLE?waftest=$RUN-multipart-1" -X POST -H "Content-Type: multipart/form-data; boundary=xyz" \
  --data-binary $'--xyz\r\nContent-Disposition: form-data; name="a"\r\n\r\nb\r\n'
head -c 13631488 /dev/zero | tr '\0' a > "$TMP/gros.txt"
une gros "413 WAF" "$BASE$CIBLE?waftest=$RUN-gros-1" -X POST -H "$ACTION" -H "Content-Type: text/plain" --data-binary "@$TMP/gros.txt"
ARGS=$(seq 0 1000 | sed 's/.*/a&=1/' | paste -sd'&' -)
une args_1001 "400 WAF" "$BASE$CIBLE?waftest=$RUN-args_1001-1&$ARGS"
une chemin_brut "403 WAF|* prod" "$BASE/waf-test/..$CIBLE?waftest=$RUN-chemin_brut-1" --path-as-is
une chemin_encode "403 WAF|* prod" "$BASE/waf-test/%2e%2e$CIBLE?waftest=$RUN-chemin_encode-1" --path-as-is
KIND[chemin_brut]=chemin; KIND[chemin_encode]=chemin
une hote_inconnu "503 proxy" "https://$HOTE_DIRECT$CIBLE?waftest=$RUN-hote_inconnu-1" -H "Host: inconnu.invalid"
canon canon_www www.tacct.ademe.fr
canon canon_beta facili-tacct.beta.gouv.fr
canon canon_wwwbeta www.facili-tacct.beta.gouv.fr
une canon_attaque "403 WAF" "https://www.tacct.ademe.fr$CIBLE?waftest=$RUN-canon_attaque-1&q=$XSS"
lot jsonvol "400 WAF" 200 "$CIBLE" --rate 20/s -X POST -H "Content-Type: application/json" --data-binary '{"a":'
rafale rl_defaut "$LIMITE_DEFAUT" 200 "$CIBLE"
rafale rl_tuiles "$LIMITE_TUILES" 400 "$CHEMIN_TUILES"
une rl_separees "200 prod" "$BASE$CIBLE?waftest=$RUN-rl_separees-1"

echo "== Attente de 20 s pour l'arrivée des logs de la prod"
sleep 20
ok_prod=1
lire_logs "$PROD_APP" "$TMP/prod.log" || ok_prod=0

echo "== Verdicts (RUN=$RUN)"
echo "  Source : prod = réponse de tacct-prod à travers le WAF (en-tête Via), WAF = réponse du WAF,"
echo "           Cloudflare = page de blocage Cloudflare, Traefik = 404 de Traefik,"
echo "           proxy = page « Site not available » de Coolify/Traefik pour un domaine inconnu."
printf '  %-15s %-22s %-34s %-16s %s\n' TEST ATTENDU "REÇU" PROD VERDICT
echecs=0
for t in "${TESTS[@]}"; do
  voulu=0
  case "${KIND[$t]}" in
    ip) [ "${OBS[$t]}" = "${ATT[$t]}" ] && v=OK || v=ÉCHEC ;;
    lot) lot_conforme "$TMP/$t.brut" "${ATT[$t]}" && v=OK || v=ÉCHEC
         voulu=$(grep -c ' prod$' "$TMP/$t.brut") ;;
    rafale) if [ "${DUREE[$t]:-99999}" -ge 1000 ]; then v="? (envoi en ${DUREE[$t]:-?} ms, plus d'1 s)"
            elif [ "${OBS[$t]% }" = "${ATT[$t]}" ]; then v=OK; else v=ÉCHEC; fi
            voulu=$(grep -c ' prod$' "$TMP/$t.brut") ;;
    *) conforme "${OBS[$t]}" "${ATT[$t]}" && v=OK || v=ÉCHEC
       [ "${OBS[$t]#* }" = prod ] && voulu=1 ;;
  esac
  if [ "${KIND[$t]}" = canon ] && [ "$v" = OK ]; then
    { [ "${LOC[$t]}" = "${LOCATT[$t]}" ] && [[ "${CC[$t]}" == *max-age=86400* ]]; } \
      || v="ÉCHEC (Location ou Cache-Control : ${CC[$t]:-absent})"
  fi
  prod=""
  if [ "${KIND[$t]}" != ip ]; then
    if [ "$ok_prod" = 1 ]; then
      lignes=$(grep "waftest=$RUN-$t-" "$TMP/prod.log" | grep -E ' status=[0-9]+')
      n=$(printf '%s' "$lignes" | grep -c .)
      prod=$(printf '%s\n' "$lignes" | grep -oE ' status=[0-9]+' | cut -d= -f2 | compte)
      prod="${prod:--}"
      if [ "${KIND[$t]}" = chemin ] && [ "$voulu" = 1 ]; then
        printf '%s' "$lignes" | grep -Eqi '/\.\./|%2e%2e' && v="ÉCHEC (.. reçu par la prod)" || v="OK (chemin nettoyé avant le WAF)"
      fi
      [[ "$v" == OK* ]] && [ "$n" != "$voulu" ] && v="ÉCHEC (prod : $n reçue(s), $voulu attendue(s))"
    else
      prod="?"
    fi
  fi
  [[ "$v" == OK* ]] || echecs=$((echecs + 1))
  printf '  %-15s %-22s %-34s %-16s %s\n' "$t" "${ATT[$t]}" "${OBS[$t]}" "$prod" "$v"
done
echo "== $echecs test(s) en échec ou non concluant(s) sur ${#TESTS[@]}"
echo "Fichiers : $TMP"
