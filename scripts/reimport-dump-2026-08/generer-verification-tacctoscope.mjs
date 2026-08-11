/**
 * Étape 0 (préliminaire) — Génère `sql/00-verification-tacctoscope.sql`.
 *
 *   node generer-verification-tacctoscope.mjs
 *
 * Ne touche à AUCUNE base : lit le dump SQL à la racine du repo, extrait les
 * ids de la table `user`, et produit un fichier SQL à exécuter MANUELLEMENT
 * sur la production (lecture seule, table temporaire de session uniquement).
 *
 * Ce fichier SQL répond à la question qui conditionne toute la suite :
 * « les données de tacctoscope_answer / tacctoscope_criterion_feedback
 *   appartiennent-elles à des comptes présents dans le nouveau dump ? »
 *
 * Toute ligne dont le user_id est ABSENT du dump deviendra orpheline à la
 * bascule (mise à l'écart par sql/04) : à arbitrer AVANT de commencer.
 */

import { createReadStream } from 'node:fs';
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { createInterface } from 'node:readline';
import { fileURLToPath } from 'node:url';

const ici = dirname(fileURLToPath(import.meta.url));
const DUMP = join(ici, '..', '..', 'prod-tacct_2026_08_11_01_46.sql');
const SORTIE = join(ici, 'sql', '00-verification-tacctoscope.sql');

const UUID = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/;
// Un id de ligne n'apparaît qu'en tête de tuple : après `VALUES (` ou en
// début de ligne (mysqldump écrit ici un tuple par ligne).
const ID_EN_TETE = new RegExp(`(?:^|VALUES )\\('(${UUID.source})'`);

const ids = new Set();
let dansInsertUser = false;

const rl = createInterface({
  input: createReadStream(DUMP, 'utf8'),
  crlfDelay: Infinity
});

for await (const ligne of rl) {
  if (ligne.startsWith('INSERT INTO `user` ')) dansInsertUser = true;
  if (!dansInsertUser) continue;

  const m = ligne.match(ID_EN_TETE);
  if (m) ids.add(m[1]);

  // Fin de l'instruction INSERT (une instruction peut couvrir des milliers
  // de lignes ; mysqldump la termine par `;` en fin de ligne).
  if (ligne.endsWith(';')) dansInsertUser = false;
}

if (ids.size === 0) {
  console.error(`Aucun id extrait de ${DUMP} : dump absent ou format inattendu.`);
  process.exit(1);
}

const valeurs = [...ids]
  .sort()
  .map((id) => `('${id}')`)
  .join(',\n');

const sql = `-- GÉNÉRÉ par generer-verification-tacctoscope.mjs — ne pas éditer à la main.
-- Source : prod-tacct_2026_08_11_01_46.sql (${ids.size} comptes user).
--
-- À exécuter MANUELLEMENT sur la PRODUCTION, AVANT toute autre étape :
--   psql "$SCALINGO_POSTGRESQL_URL" -f sql/00-verification-tacctoscope.sql
--
-- LECTURE SEULE : seule une table temporaire de session est créée, elle
-- disparaît à la déconnexion. Aucune table réelle n'est modifiée.

CREATE TEMP TABLE dump_user_ids (id char(36) PRIMARY KEY);

INSERT INTO dump_user_ids (id) VALUES
${valeurs};

-- ───────────────────────────────────────────────────────────────────────────
-- 1. Vue d'ensemble : chaque ligne TACCToscope pointe-t-elle vers un compte
--    présent dans le nouveau dump ?  orphelines_apres_bascule doit être 0 ;
--    sinon, arbitrer (cf. README §2.2) avant de lancer quoi que ce soit.
-- ───────────────────────────────────────────────────────────────────────────

SELECT 'tacctoscope_answer' AS table_,
       count(*)                                    AS lignes,
       count(d.id)                                 AS sur_compte_du_dump,
       count(*) - count(d.id)                      AS orphelines_apres_bascule,
       count(DISTINCT a.user_id)                   AS comptes_distincts
  FROM tacct.tacctoscope_answer a
  LEFT JOIN dump_user_ids d ON d.id = a.user_id
UNION ALL
SELECT 'tacctoscope_criterion_feedback',
       count(*), count(d.id), count(*) - count(d.id), count(DISTINCT f.user_id)
  FROM tacct.tacctoscope_criterion_feedback f
  LEFT JOIN dump_user_ids d ON d.id = f.user_id;

-- ───────────────────────────────────────────────────────────────────────────
-- 2. Détail des comptes concernés qui sont ABSENTS du dump (créés depuis la
--    MEP, ou supprimés côté legacy). L'e-mail est chiffré : utiliser
--    scripts/lire-user.mjs (branche dev) avec l'id pour identifier le compte.
-- ───────────────────────────────────────────────────────────────────────────

SELECT u.id,
       u.created_at,
       u.validated,
       (u.authenticated_id_bidx IS NOT NULL)                       AS lien_moncompteademe,
       (SELECT count(*) FROM tacct.tacctoscope_answer a
         WHERE a.user_id = u.id)                                   AS reponses,
       (SELECT count(*) FROM tacct.tacctoscope_criterion_feedback f
         WHERE f.user_id = u.id)                                   AS feedbacks
  FROM tacct."user" u
 WHERE u.id NOT IN (SELECT id FROM dump_user_ids)
   AND (EXISTS (SELECT 1 FROM tacct.tacctoscope_answer a WHERE a.user_id = u.id)
     OR EXISTS (SELECT 1 FROM tacct.tacctoscope_criterion_feedback f WHERE f.user_id = u.id))
 ORDER BY u.created_at DESC;
`;

writeFileSync(SORTIE, sql, 'utf8');
console.log(`${ids.size} ids user extraits du dump → ${SORTIE}`);
