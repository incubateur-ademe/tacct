/**
 * Étape B4bis — Aligne les NOMS d'index et de contraintes sur schema.prisma.
 *
 *   node renommer-index.mjs                       # DRY-RUN, n'écrit rien
 *   node renommer-index.mjs --apply               # applique
 *   node renommer-index.mjs --schema tacct_new    # autre schéma (ex. C1bis)
 *
 * Variables d'environnement : DATABASE_URL ou PREP_DATABASE_URL
 * (défaut : Postgres du docker-compose de préparation).
 *
 * POURQUOI CE SCRIPT EXISTE
 * Les noms d'index de prisma/schema.prisma (`idx_16589_primary`,
 * `idx_16589_idx_8d93d649131a4f72`, …) viennent du PREMIER import pgloader :
 * ils encodent les OID Postgres attribués à ce moment-là. Un nouveau passage
 * de pgloader attribue d'autres OID, donc d'autres noms — et `prisma db pull`
 * produirait un diff non vide alors que la structure est identique.
 *
 * Le script apparie chaque index/contrainte de la base par sa SIGNATURE
 * (table + colonnes + type d'objet), indépendamment de son nom, puis le
 * renomme au nom attendu par Prisma.
 *
 * En DRY-RUN il sert aussi de VÉRIFICATEUR de noms : sortie de code 1 si des
 * attendus sont introuvables ou si la base porte des objets en trop.
 */

import 'dotenv/config';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Pool } from 'pg';

// Chemins résolus depuis ce fichier : le script marche quel que soit le
// dossier courant (racine du repo ou scripts/reimport-dump-2026-08).
const RACINE = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

const args = process.argv.slice(2);
const apply = args.includes('--apply');
const schemaCible = args.includes('--schema')
  ? args[args.indexOf('--schema') + 1]
  : 'tacct';

const connectionString = (
  process.env.DATABASE_URL ??
  process.env.PREP_DATABASE_URL ??
  'postgres://postgres:prep@localhost:55432/tacct_prep'
).split('?')[0];

// Tables attendues absentes de la base de préparation : elles arrivent en
// étape C3 (sql/04) avec leurs noms d'origine, rien à renommer.
const TABLES_HORS_DUMP = new Set([
  'config',
  'command_migration',
  'command_process',
  'tacctoscope_answer',
  'tacctoscope_criterion_feedback'
]);

// --- 1. Attendus : parsing de prisma/schema.prisma (schéma tacct) -----------

/**
 * Retourne, par table, la liste des objets attendus :
 *   { kind: 'pk' | 'unique' | 'index' | 'fk', cols: [...], name: '...' }
 * `unique`/`index` visent un index (ou une contrainte UNIQUE équivalente),
 * `pk`/`fk` visent une contrainte.
 */
function lireAttendus(cheminSchema) {
  const source = readFileSync(cheminSchema, 'utf8');
  const attendus = new Map();

  for (const bloc of source.split(/\nmodel /).slice(1)) {
    const table = bloc.split(/[\s{]/)[0];
    const corps = bloc.slice(0, bloc.indexOf('\n}'));
    if (!corps.includes('@@schema("tacct")')) continue;

    const objets = [];
    const pkCols = [];
    let pkName = null;

    for (const ligne of corps.split('\n')) {
      const t = ligne.trim();

      // Attributs de bloc
      let m = t.match(/^@@id\(\[([^\]]+)\](?:.*map: "([^"]+)")?/);
      if (m) {
        pkCols.push(...m[1].split(',').map((s) => s.trim()));
        pkName = m[2] ?? null;
        continue;
      }
      m = t.match(/^@@unique\(\[([^\]]+)\](?:.*map: "([^"]+)")?/);
      if (m) {
        const cols = m[1].split(',').map((s) => s.trim());
        objets.push({
          kind: 'unique',
          cols,
          name: m[2] ?? `${table}_${cols.join('_')}_key`
        });
        continue;
      }
      m = t.match(/^@@index\(\[([^\]]+)\](?:.*map: "([^"]+)")?/);
      if (m) {
        const cols = m[1].split(',').map((s) => s.trim());
        objets.push({
          kind: 'index',
          cols,
          name: m[2] ?? `${table}_${cols.join('_')}_idx`
        });
        continue;
      }
      if (t.startsWith('@@') || t.startsWith('//') || !t) continue;

      // Champs scalaires / relations
      const champ = t.match(/^(\w+)\s/)?.[1];
      if (!champ) continue;

      m = t.match(/@id(?:\((?:.*map: "([^"]+)")?[^)]*\))?/);
      if (m && t.includes('@id')) {
        pkCols.push(champ);
        if (m[1]) pkName = m[1];
      }
      m = t.match(/@unique(?:\((?:.*map: "([^"]+)")?[^)]*\))?/);
      if (t.includes('@unique') && !t.includes('@@unique')) {
        objets.push({
          kind: 'unique',
          cols: [champ],
          name: m?.[1] ?? `${table}_${champ}_key`
        });
      }
      // Relations, y compris nommées : @relation("nom", fields: [...], ...)
      const REL = /@relation\((?:"[^"]*",\s*)?fields: \[([^\]]+)\]/;
      m = t.match(new RegExp(REL.source + '.*?map: "([^"]+)"'));
      if (m) {
        objets.push({
          kind: 'fk',
          cols: m[1].split(',').map((s) => s.trim()),
          name: m[2]
        });
      } else if (REL.test(t)) {
        const cols = t
          .match(REL)[1]
          .split(',')
          .map((s) => s.trim());
        objets.push({ kind: 'fk', cols, name: `${table}_${cols[0]}_fkey` });
      }
    }

    if (pkCols.length) {
      objets.unshift({ kind: 'pk', cols: pkCols, name: pkName ?? `${table}_pkey` });
    }
    attendus.set(table, objets);
  }
  return attendus;
}

// --- 2. Existant : contraintes et index du schéma cible ---------------------

async function lireExistant(pool) {
  const contraintes = await pool.query(
    `SELECT t.relname AS table_, c.conname AS name, c.contype,
            (SELECT array_agg(a.attname::text ORDER BY k.ord)
               FROM unnest(c.conkey) WITH ORDINALITY k(attnum, ord)
               JOIN pg_attribute a
                 ON a.attrelid = c.conrelid AND a.attnum = k.attnum) AS cols
       FROM pg_constraint c
       JOIN pg_class t ON t.oid = c.conrelid
       JOIN pg_namespace n ON n.oid = t.relnamespace
      WHERE n.nspname = $1 AND c.contype IN ('p', 'u', 'f')`,
    [schemaCible]
  );

  // Index non rattachés à une contrainte (pgloader crée des index, pas des
  // contraintes UNIQUE) ; l'index de PK est déjà couvert par la contrainte.
  const index = await pool.query(
    `SELECT t.relname AS table_, i.relname AS name, x.indisunique AS is_unique,
            (SELECT array_agg(a.attname::text ORDER BY k.ord)
               FROM unnest(x.indkey::int[]) WITH ORDINALITY k(attnum, ord)
               JOIN pg_attribute a
                 ON a.attrelid = x.indrelid AND a.attnum = k.attnum
              WHERE k.attnum <> 0) AS cols
       FROM pg_index x
       JOIN pg_class i ON i.oid = x.indexrelid
       JOIN pg_class t ON t.oid = x.indrelid
       JOIN pg_namespace n ON n.oid = t.relnamespace
      WHERE n.nspname = $1
        AND NOT x.indisprimary
        AND NOT EXISTS (SELECT 1 FROM pg_constraint c WHERE c.conindid = x.indexrelid)`,
    [schemaCible]
  );

  return { contraintes: contraintes.rows, index: index.rows };
}

// --- 3. Appariement par signature -------------------------------------------

const sig = (cols) => (cols ?? []).join('+');

function apparier(attendus, existant) {
  const renames = []; // { type: 'constraint'|'index', table_, de, vers }
  const problemes = [];
  const consommes = new Set(); // objets existants appariés

  for (const [table, objets] of attendus) {
    const contraintesTable = existant.contraintes.filter((c) => c.table_ === table);
    const indexTable = existant.index.filter((i) => i.table_ === table);

    if (!contraintesTable.length && !indexTable.length) {
      if (!TABLES_HORS_DUMP.has(table)) {
        problemes.push(`${table} : table absente du schéma « ${schemaCible} »`);
      }
      continue;
    }

    for (const o of objets) {
      let trouve = null;
      let type = 'constraint';

      if (o.kind === 'pk') {
        trouve = contraintesTable.find((c) => c.contype === 'p');
      } else if (o.kind === 'fk') {
        const cands = contraintesTable.filter(
          (c) => c.contype === 'f' && sig(c.cols) === sig(o.cols) && !consommes.has(c)
        );
        trouve = cands.find((c) => c.name === o.name) ?? cands[0];
        if (cands.length > 1 && !cands.some((c) => c.name === o.name)) {
          problemes.push(`${table} : ${cands.length} FK candidates pour ${o.name} (${sig(o.cols)})`);
        }
      } else {
        // unique / index : contrainte UNIQUE d'abord, sinon index nu.
        if (o.kind === 'unique') {
          trouve = contraintesTable.find(
            (c) => c.contype === 'u' && sig(c.cols) === sig(o.cols) && !consommes.has(c)
          );
        }
        if (!trouve) {
          type = 'index';
          const cands = indexTable.filter(
            (i) =>
              sig(i.cols) === sig(o.cols) &&
              i.is_unique === (o.kind === 'unique') &&
              !consommes.has(i)
          );
          trouve = cands.find((i) => i.name === o.name) ?? cands[0];
        }
      }

      if (!trouve) {
        problemes.push(
          `${table} : AUCUN candidat pour ${o.kind} « ${o.name} » (colonnes : ${sig(o.cols) || '?'})`
        );
        continue;
      }
      consommes.add(trouve);
      if (trouve.name !== o.name) {
        renames.push({ type, table_: table, de: trouve.name, vers: o.name });
      }
    }
  }

  // Objets réels jamais appariés → prisma db pull les ferait apparaître.
  for (const c of existant.contraintes) {
    if (!consommes.has(c) && c.contype !== 'p') {
      problemes.push(`${c.table_} : contrainte EN TROP « ${c.name} » (${sig(c.cols)})`);
    }
  }
  for (const i of existant.index) {
    if (!consommes.has(i)) {
      problemes.push(`${i.table_} : index EN TROP « ${i.name} » (${sig(i.cols)})`);
    }
  }

  return { renames, problemes };
}

// --- 4. Exécution ------------------------------------------------------------

async function main() {
  const attendus = lireAttendus(join(RACINE, 'prisma', 'schema.prisma'));
  if (!attendus.size) throw new Error('Aucun modèle tacct lu dans prisma/schema.prisma');

  // `--attendus` : affiche ce qui a été lu dans schema.prisma et sort sans
  // toucher à aucune base (contrôle du parsing).
  if (args.includes('--attendus')) {
    let total = 0;
    for (const [table, objets] of attendus) {
      console.log(`\n${table}`);
      for (const o of objets) {
        total++;
        console.log(`  ${o.kind.padEnd(6)} ${o.name}  (${sig(o.cols)})`);
      }
    }
    console.log(`\n${attendus.size} tables, ${total} objets attendus.`);
    return;
  }

  const caPath = join(RACINE, 'ca.pem');
  const ssl =
    connectionString.includes('localhost') || connectionString.includes('127.0.0.1')
      ? false
      : existsSync(caPath)
        ? { ca: readFileSync(caPath, 'utf8'), rejectUnauthorized: false }
        : true;
  const pool = new Pool({ connectionString, ssl });

  console.log(`[renommer] cible  = ${connectionString.replace(/:[^:@/]*@/, ':***@')}`);
  console.log(`[renommer] schéma = ${schemaCible} | mode = ${apply ? 'APPLY' : 'DRY-RUN'}`);

  try {
    const existant = await lireExistant(pool);
    const { renames, problemes } = apparier(attendus, existant);

    // Collisions : un nom cible peut être encore porté par un AUTRE objet qui
    // doit lui-même être renommé (OID retombant sur un numéro déjà utilisé).
    // Passe 1 : ces renommages passent par un nom temporaire ; passe 2 : les
    // temporaires prennent leur nom final, une fois tous les noms libérés.
    const nomsAvant = new Set(renames.map((r) => r.de));
    const passe1 = [];
    const passe2 = [];
    for (const r of renames) {
      if (nomsAvant.has(r.vers)) {
        passe1.push({ ...r, vers: `${r.vers}_tmp_reprise` });
        passe2.push({ ...r, de: `${r.vers}_tmp_reprise` });
      } else {
        passe1.push(r);
      }
    }
    const ordres = [...passe1, ...passe2];

    console.log(`[renommer] renommages nécessaires : ${renames.length}`);
    for (const o of ordres) {
      const sqlTexte =
        o.type === 'constraint'
          ? `ALTER TABLE ${schemaCible}."${o.table_}" RENAME CONSTRAINT "${o.de}" TO "${o.vers}"`
          : `ALTER INDEX ${schemaCible}."${o.de}" RENAME TO "${o.vers}"`;
      console.log(`  ${sqlTexte}`);
      if (apply) await pool.query(sqlTexte);
    }

    if (problemes.length) {
      console.log(`\n[renommer] ⚠️ ${problemes.length} point(s) à arbitrer :`);
      for (const p of problemes) console.log(`  - ${p}`);
    }

    if (apply) {
      console.log(`\n[renommer] ${ordres.length} renommage(s) appliqué(s).`);
    } else if (renames.length || problemes.length) {
      console.log('\n[renommer] DRY-RUN : relancer avec --apply pour appliquer les renommages.');
    } else {
      console.log('\n✅ Tous les noms sont déjà conformes à prisma/schema.prisma.');
    }
    process.exit(problemes.length ? 1 : 0);
  } finally {
    await pool.end();
  }
}

main().catch((err) => {
  console.error('[renommer] échec :', err);
  process.exit(1);
});
