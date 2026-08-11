/**
 * Compare la forme d'un schéma Postgres à `prisma/schema.prisma`.
 *
 * Répond à l'exigence : « la forme des tables et du schéma doit être
 * exactement celle du prisma.schema ». À lancer sur la base de préparation
 * avant la bascule, puis sur la prod après.
 *
 *   node verifier-schema.mjs                          # schéma `tacct`, base de prep
 *   node verifier-schema.mjs --schema tacct_new       # autre schéma
 *   DATABASE_URL=... node verifier-schema.mjs         # autre base
 *
 * LECTURE SEULE. Code de sortie 1 si une divergence structurelle est trouvée.
 */

import 'dotenv/config';
import { readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Pool } from 'pg';

// Chemins résolus depuis ce fichier : le script marche quel que soit le
// dossier courant (racine du repo ou scripts/reimport-dump-2026-08).
const RACINE = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

const args = process.argv.slice(2);
const schemaCible = args.includes('--schema')
  ? args[args.indexOf('--schema') + 1]
  : 'tacct';
// --sql [fichier] : au lieu du rapport, produit les ALTER corrigeant les
// écarts corrigeables (DEFAULT, NOT NULL). Avec un nom de fichier, écrit
// dedans (la redirection `>` est capricieuse sous Git Bash) ; sinon stdout.
// À relire puis jouer sur la base de PREP.
const modeSql = args.includes('--sql');
const fichierSql =
  modeSql && args[args.indexOf('--sql') + 1] && !args[args.indexOf('--sql') + 1].startsWith('--')
    ? args[args.indexOf('--sql') + 1]
    : null;

const connectionString = (
  process.env.DATABASE_URL ??
  process.env.PREP_DATABASE_URL ??
  'postgres://postgres:prep@localhost:55432/tacct_prep'
).split('?')[0];

// --- Lecture de prisma/schema.prisma ---------------------------------------

const SCALAIRES = new Set([
  'String', 'Boolean', 'Int', 'BigInt', 'Float', 'Decimal', 'DateTime', 'Json', 'Bytes'
]);

/** Type Prisma (+ attribut @db.*) → type attendu dans information_schema. */
function typeAttendu(base, attributs) {
  const db = attributs.match(/@db\.(\w+)/)?.[1];
  if (db === 'VarChar') return 'character varying';
  if (db === 'Char') return 'character';
  if (db === 'Text') return 'text';
  if (db === 'SmallInt') return 'smallint';
  if (db === 'Timestamptz' || db === 'Timestamp') return 'timestamp with time zone';
  if (db === 'Date') return 'date';
  if (db === 'Uuid') return 'uuid';
  if (db === 'JsonB') return 'jsonb';
  switch (base) {
    case 'String': return 'text';
    case 'Boolean': return 'boolean';
    case 'Int': return 'integer';
    case 'BigInt': return 'bigint';
    case 'Float': return 'double precision';
    case 'Decimal': return 'numeric';
    case 'DateTime': return 'timestamp with time zone';
    case 'Json': return 'jsonb';
    case 'Bytes': return 'bytea';
    default: return null;
  }
}

/**
 * Valeur `@default(...)` de Prisma, sous forme normalisée :
 *   { kind: 'now' | 'autoincrement' | 'bool' | 'number' | 'string', valeur? }
 * ou null si le champ n'a pas de défaut.
 */
function defautAttendu(attributs) {
  const m = attributs.match(
    /@default\((?:(now\(\))|(autoincrement\(\))|(true|false)|(-?\d+(?:\.\d+)?)|"([^"]*)")\)/
  );
  if (!m) return null;
  if (m[1]) return { kind: 'now' };
  if (m[2]) return { kind: 'autoincrement' };
  if (m[3]) return { kind: 'bool', valeur: m[3] };
  if (m[4]) return { kind: 'number', valeur: m[4] };
  return { kind: 'string', valeur: m[5] };
}

/** Compare un `column_default` Postgres au défaut attendu par Prisma. */
function defautConforme(attendu, colDefault) {
  if (attendu == null) return colDefault == null;
  if (colDefault == null) return false;
  const d = colDefault.trim();
  switch (attendu.kind) {
    case 'now':
      return /^(now\(\)|CURRENT_TIMESTAMP)/i.test(d);
    case 'autoincrement':
      return d.startsWith('nextval(');
    case 'bool':
      return d.replace(/::boolean$/, '') === attendu.valeur;
    case 'number': {
      const n = d.match(/^'?(-?\d+(?:\.\d+)?)'?(?:::[\w "]+)?$/);
      return n != null && Number(n[1]) === Number(attendu.valeur);
    }
    case 'string': {
      const s = d.match(/^'((?:[^']|'')*)'(?:::[\w "]+)?$/);
      return s != null && s[1].replace(/''/g, "'") === attendu.valeur;
    }
    default:
      return false;
  }
}

function lireModelesPrisma(cheminSchema, schemaPrisma) {
  const source = readFileSync(cheminSchema, 'utf8');
  const modeles = new Map();

  for (const bloc of source.split(/\nmodel /).slice(1)) {
    const nom = bloc.split(/[\s{]/)[0];
    const corps = bloc.slice(0, bloc.indexOf('\n}'));
    if (!new RegExp(`@@schema\\("${schemaPrisma}"\\)`).test(corps)) continue;

    const colonnes = new Map();
    for (const ligne of corps.split('\n').slice(1)) {
      const t = ligne.trim();
      if (!t || t.startsWith('@@') || t.startsWith('//') || t.startsWith('\\')) continue;
      const m = t.match(/^(\w+)\s+(\w+)(\[\])?(\?)?\s*(.*)$/);
      if (!m) continue;
      const [, champ, base, liste, optionnel, attributs = ''] = m;
      // Champs de relation : ni colonne, ni scalaire.
      if (liste || attributs.includes('@relation') || !SCALAIRES.has(base)) continue;
      const colonne = attributs.match(/@map\("([^"]+)"\)/)?.[1] ?? champ;
      colonnes.set(colonne, {
        type: typeAttendu(base, attributs),
        nullable: Boolean(optionnel),
        defaut: defautAttendu(attributs)
      });
    }
    modeles.set(nom, colonnes);
  }
  return modeles;
}

// --- Lecture de la base ----------------------------------------------------

const caPath = join(RACINE, 'ca.pem');
const ssl =
  connectionString.includes('localhost') || connectionString.includes('127.0.0.1')
    ? false
    : existsSync(caPath)
      ? { ca: readFileSync(caPath, 'utf8'), rejectUnauthorized: false }
      : true;

const pool = new Pool({ connectionString, ssl });

const { rows } = await pool.query(
  `SELECT table_name, column_name, data_type, is_nullable, column_default
     FROM information_schema.columns
    WHERE table_schema = $1
    ORDER BY table_name, ordinal_position`,
  [schemaCible]
);
await pool.end();

const base = new Map();
for (const r of rows) {
  if (!base.has(r.table_name)) base.set(r.table_name, new Map());
  base.get(r.table_name).set(r.column_name, {
    type: r.data_type,
    nullable: r.is_nullable === 'YES',
    defaut: r.column_default
  });
}

// --- Comparaison -----------------------------------------------------------

const attendu = lireModelesPrisma(
  join(RACINE, 'prisma', 'schema.prisma'),
  'tacct'
);

const ecarts = [];
const avertissements = [];
const correctifs = [];

/** Littéral SQL du défaut Prisma (null si non générable, ex. autoincrement). */
function litteralDefaut(d) {
  switch (d.kind) {
    case 'now': return 'now()';
    case 'bool': return d.valeur;
    case 'number': return d.valeur;
    case 'string': return `'${d.valeur.replace(/'/g, "''")}'`;
    default: return null;
  }
}

for (const [table, colonnes] of attendu) {
  const reelle = base.get(table);
  if (!reelle) {
    ecarts.push({ table, colonne: '—', probleme: 'TABLE ABSENTE de la base' });
    continue;
  }
  for (const [colonne, spec] of colonnes) {
    const r = reelle.get(colonne);
    if (!r) {
      ecarts.push({ table, colonne, probleme: 'COLONNE ABSENTE de la base' });
      continue;
    }
    if (spec.type && r.type !== spec.type) {
      // Divergence de type : signalée sans bloquer (char/varchar/text sont
      // interchangeables pour Prisma tant que la longueur suffit).
      avertissements.push({
        table, colonne, probleme: `type ${r.type} ≠ ${spec.type} (attendu par Prisma)`
      });
    }
    if (r.nullable !== spec.nullable) {
      ecarts.push({
        table, colonne,
        probleme: `nullable=${r.nullable} alors que Prisma attend ${spec.nullable}`
      });
      correctifs.push(
        `ALTER TABLE ${schemaCible}."${table}" ALTER COLUMN "${colonne}" ` +
          (spec.nullable ? 'DROP NOT NULL;' : 'SET NOT NULL;')
      );
    }
    if (!defautConforme(spec.defaut, r.defaut)) {
      const litteral = spec.defaut ? litteralDefaut(spec.defaut) : null;
      correctifs.push(
        `ALTER TABLE ${schemaCible}."${table}" ALTER COLUMN "${colonne}" ` +
          (spec.defaut == null
            ? 'DROP DEFAULT;'
            : litteral != null
              ? `SET DEFAULT ${litteral};`
              : `DROP DEFAULT; -- ⚠️ défaut ${spec.defaut.kind} à poser à la main`)
      );
      // Un DEFAULT divergent (présent, absent ou d'une autre valeur) ferait
      // dévier `prisma db pull` : bloquant, à corriger sur la base de prep.
      ecarts.push({
        table, colonne,
        probleme: `DEFAULT « ${r.defaut ?? '∅'} » ≠ Prisma « ${
          spec.defaut ? JSON.stringify(spec.defaut) : '∅'
        } »`
      });
    }
  }
  for (const colonne of reelle.keys()) {
    if (!colonnes.has(colonne)) {
      ecarts.push({ table, colonne, probleme: 'COLONNE EN TROP (absente de Prisma)' });
    }
  }
}

for (const table of base.keys()) {
  if (!attendu.has(table)) {
    ecarts.push({ table, colonne: '—', probleme: 'TABLE EN TROP (absente de Prisma)' });
  }
}

// --- Rapport ---------------------------------------------------------------

if (modeSql) {
  const lignes = [
    `-- GÉNÉRÉ par verifier-schema.mjs --sql (schéma « ${schemaCible} »).`,
    '-- Correctifs des écarts DEFAULT / NOT NULL constatés. À RELIRE avant de',
    '-- jouer, sur la base de PRÉPARATION uniquement.',
    '--',
    '-- Si un SET NOT NULL échoue, la colonne contient des NULL (dates « zéro »',
    '-- MySQL converties par pgloader) : lister les lignes avec',
    '--   SELECT * FROM <table> WHERE <colonne> IS NULL;  et arbitrer.',
    'BEGIN;',
    ...correctifs,
    'COMMIT;',
    ...(correctifs.length === 0 ? ['-- (aucun correctif générable)'] : [])
  ];
  if (fichierSql) {
    const { writeFileSync } = await import('node:fs');
    writeFileSync(fichierSql, lignes.join('\n') + '\n', 'utf8');
    console.log(`${correctifs.length} correctif(s) écrit(s) dans ${fichierSql}`);
  } else {
    for (const l of lignes) console.log(l);
  }
  process.exit(ecarts.length ? 1 : 0);
}

console.log(`\nSchéma « ${schemaCible} » : ${base.size} tables en base, ${attendu.size} modèles Prisma.\n`);

if (avertissements.length) {
  console.log(`Avertissements de type (non bloquants) : ${avertissements.length}`);
  console.table(avertissements.slice(0, 40));
  if (avertissements.length > 40) console.log(`… et ${avertissements.length - 40} autres.`);
}

if (ecarts.length === 0) {
  console.log('✅ Aucune divergence structurelle : la forme correspond à prisma/schema.prisma.\n');
  process.exit(0);
}

console.log(`❌ ${ecarts.length} divergence(s) structurelle(s) :`);
console.table(ecarts);
console.log(
  '\nCorriger avant de basculer. Une fois le schéma conforme, confirmer avec :\n' +
    '  npx prisma db pull   (le diff sur prisma/schema.prisma doit être vide)\n'
);
process.exit(1);
