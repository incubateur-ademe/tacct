#!/bin/bash
# Bloque tout acces aux fichiers .env* (lecture/edition/recherche/commande shell).

INPUT=$(cat)

extract() {
  printf '%s' "$INPUT" \
    | grep -oE "\"$1\"[[:space:]]*:[[:space:]]*\"([^\"\\\\]|\\\\.)*\"" \
    | head -n1 \
    | sed -E "s/^\"$1\"[[:space:]]*:[[:space:]]*\"//; s/\"$//"
}

HAYSTACK="$(extract file_path)
$(extract notebook_path)
$(extract path)
$(extract glob)
$(extract command)"

HAYSTACK=${HAYSTACK//process.env/}
HAYSTACK=${HAYSTACK//import.meta.env/}

if printf '%s' "$HAYSTACK" | grep -qiE "\.env([./\"'[:space:]\\]|$)"; then
  echo "Blocked: access to .env files is not allowed" >&2
  exit 2
fi

exit 0
