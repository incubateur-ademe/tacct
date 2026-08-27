// Récupère les emails de la table Baserow "CdM", filtrés (compte actif, hors BE),
// les chiffre et les pousse dans tacct.baserow_communaute.
//
//   node etl/prod/runBaserowCdm.mjs            # DRY-RUN (compte, n'écrit rien)
//   node etl/prod/runBaserowCdm.mjs --apply    # applique
//
// Table cible à créer au préalable : voir prisma/sql/create_baserow_communaute.sql

import { createCipheriv, hkdfSync, randomBytes } from 'node:crypto';
import dotenv from 'dotenv';
import fs from 'fs';
import { join } from 'path';
import pg from 'pg';
import { pathToFileURL } from 'node:url';

if (fs.existsSync('.env')) {
    dotenv.config();
}

const {
    SCALINGO_POSTGRESQL_URL,
    BASEROW_HOST,
    BASEROW_API_KEY,
    BASEROW_TABLE_ID_CDM = '490425',
    USER_ENCRYPTION_KEY
} = process.env;

// --- Crypto (copie canonique de src/lib/crypto/user-crypto.ts) -------------
const ENC_PREFIX = 'enc:v1:';
const HKDF_SALT = Buffer.from('tacct-user-crypto');
const IV_LENGTH = 12;

function deriveKeys(rawBase64) {
    const ikm = Buffer.from(rawBase64, 'base64');
    return {
        enc: Buffer.from(hkdfSync('sha256', ikm, HKDF_SALT, 'tacct-user-enc', 32))
    };
}

function encryptField(keys, plaintext) {
    const iv = randomBytes(IV_LENGTH);
    const cipher = createCipheriv('aes-256-gcm', keys.enc, iv);
    const ct = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
    const tag = cipher.getAuthTag();
    return ENC_PREFIX + Buffer.concat([iv, tag, ct]).toString('base64');
}

// --- Baserow -----------------------------------------------------------------
async function fetchBaserow(tableId) {
    const baseUrl = `${BASEROW_HOST}/api/database/rows/table/${tableId}/?user_field_names=true`;
    let allResults = [];
    let nextUrl = baseUrl;
    let page = 1;

    while (nextUrl) {
        console.log(`[baserow-cdm] requête page ${page} : ${nextUrl}`);
        const resp = await fetch(nextUrl, {
            method: 'GET',
            headers: { Authorization: `Token ${BASEROW_API_KEY}` }
        });
        if (!resp.ok)
            throw new Error(`Baserow ${resp.status}: ${await resp.text()}`);
        const data = await resp.json();
        allResults = allResults.concat(data.results);
        console.log(
            `[baserow-cdm] page ${page} reçue : ${data.results.length} ligne(s) (total ${allResults.length})`
        );
        nextUrl = data.next ? data.next.replace(/^http:/, 'https:') : null;
        page++;
    }

    return allResults;
}

// "Type Territoire" est un lookup au travers d'une liaison de table :
// [{ id, value: [{ id, value: "CC", color }] }, ...]. On aplatit vers les
// libellés de premier niveau.
const valeursTypeTerritoire = (valeur) => {
    if (!Array.isArray(valeur)) return [];
    return valeur.flatMap((lien) =>
        Array.isArray(lien?.value)
            ? lien.value.map((option) => option?.value).filter((v) => typeof v === 'string')
            : []
    );
};

function filtrerLignes(rows) {
    return rows.filter((row) => {
        const email = row['Email'];
        if (typeof email !== 'string' || email.trim().length === 0) return false;
        if (row['Compte inactif'] === true) return false;
        if (valeursTypeTerritoire(row['Type Territoire']).includes('BE')) return false;
        return true;
    });
}

// --- PostgreSQL ----------------------------------------------------------------
// Même logique que src/lib/queries/db.ts : en local, ca.pem est présent et fournit
// le certificat SecNumCloud ; sur Scalingo, ce fichier n'existe pas et le système
// a déjà les certificats voulus (ssl: true suffit).
const caPath = join(process.cwd(), 'ca.pem');
const sslConfig = fs.existsSync(caPath)
    ? { ca: fs.readFileSync(caPath, 'utf8'), rejectUnauthorized: false }
    : true;

// Retire les paramètres après `?` (ex: sslmode=verify-full) qui peuvent entrer
// en conflit avec l'option `ssl` ci-dessus — comme dans db.ts.
const cleanConnectionString = SCALINGO_POSTGRESQL_URL?.split('?')[0];

async function withPg(fn) {
    const client = new pg.Client({
        connectionString: cleanConnectionString,
        ssl: sslConfig
    });
    await client.connect();
    try {
        return await fn(client);
    } finally {
        await client.end();
    }
}

// Aucune clé de rapprochement avec Baserow n'est conservée (même l'id) : le
// couplage d'un email chiffré à une ligne Baserow identifiable romprait
// l'anonymisation. On repart donc de zéro à chaque run plutôt que d'upserter.
async function replaceCommunaute(client, rows, keys) {
    const sql = `INSERT INTO tacct.baserow_communaute (email) VALUES ($1)`;
    await client.query('BEGIN');
    try {
        await client.query('TRUNCATE tacct.baserow_communaute');
        for (const row of rows) {
            const email = encryptField(keys, row['Email'].trim());
            await client.query(sql, [email]);
        }
        await client.query('COMMIT');
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    }
    return rows.length;
}

// --- Main ------------------------------------------------------------------
export async function run({ apply }) {
    if (!BASEROW_HOST || !BASEROW_API_KEY) {
        throw new Error('BASEROW_HOST / BASEROW_API_KEY manquants');
    }
    if (!apply) {
        console.log('[baserow-cdm] mode=DRY-RUN (relancer avec --apply pour écrire)');
    } else {
        console.log('[baserow-cdm] mode=APPLY');
    }

    const rows = await fetchBaserow(BASEROW_TABLE_ID_CDM);
    console.log(`[baserow-cdm] lignes récupérées : ${rows.length}`);

    const lignesFiltrees = filtrerLignes(rows);
    console.log(
        `[baserow-cdm] lignes après filtre (compte actif, hors BE, email non vide) : ${lignesFiltrees.length}`
    );

    if (!apply) return { total: rows.length, filtrees: lignesFiltrees.length };

    if (!SCALINGO_POSTGRESQL_URL) {
        throw new Error('SCALINGO_POSTGRESQL_URL manquante');
    }
    if (!USER_ENCRYPTION_KEY) {
        throw new Error('USER_ENCRYPTION_KEY manquante');
    }
    const keys = deriveKeys(USER_ENCRYPTION_KEY);

    const count = await withPg((client) =>
        replaceCommunaute(client, lignesFiltrees, keys)
    );
    console.log(`[baserow-cdm] table remplacée : ${count} email(s) chiffré(s).`);

    return { total: rows.length, filtrees: lignesFiltrees.length, inseres: count };
}

// Exécution directe (node etl/prod/runBaserowCdm.mjs [--apply]) : indépendant
// du gate NEXT_PUBLIC_ENV, pour permettre le test en dry-run depuis n'importe
// quel environnement. Le gate de production vit dans etl/prod/index.mjs.
const estAppelDirect =
    process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (estAppelDirect) {
    run({ apply: process.argv.includes('--apply') }).catch((err) => {
        console.error('[baserow-cdm] échec :', err);
        process.exit(1);
    });
}
