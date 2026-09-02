// Sens inverse de runBaserowCdm.mjs : reporte la réponse à la question beta du
// questionnaire de connexion dans le champ "Souhaite participer à des tests
// utilisateurs" de la table Baserow "CdM".
//
// Seules les lignes Baserow dont l'email correspond à un compte chez nous sont
// modifiées : les autres ne sont jamais touchées, quel que soit l'état de leur
// cellule.
//
// Aucun email n'est déchiffré : on calcule le blind index de l'email lu dans
// Baserow et on le compare aux email_bidx de tacct."user". `recontact_email`
// n'est pas utilisé (il est NULL dès que la case n'est pas cochée, donc il ne
// peut pas porter les "Non").
//
//   node etl/prod/runBaserowTestsUtilisateurs.mjs                     # DRY-RUN (n'écrit rien)
//   node etl/prod/runBaserowTestsUtilisateurs.mjs --apply --limit=5   # écrit 5 lignes seulement
//   node etl/prod/runBaserowTestsUtilisateurs.mjs --apply             # applique

import { createHmac, hkdfSync } from 'node:crypto';
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
    BASEROW_WRITE_API_KEY,
    BASEROW_TABLE_ID_CDM = '490425',
    USER_ENCRYPTION_KEY
} = process.env;

const CHAMP_TESTS = 'Souhaite participer à des tests utilisateurs';
const TAG_OUI = 'Oui';
const TAG_NON = 'Non';
const TAG_PAS_PRECISE = 'Pas précisé';
const TAILLE_LOT = 200;

// Doit rester aligné sur PROFILS_AVEC_BETA dans src/lib/questionnaire-de-connexion/types.ts.
const PROFILS_AVEC_BETA = ['cdm', 'responsable', 'be'];

// --- Crypto (copie canonique de src/lib/crypto/user-crypto.ts) -------------
const HKDF_SALT = Buffer.from('tacct-user-crypto');

function deriveKeys(rawBase64) {
    const ikm = Buffer.from(rawBase64, 'base64');
    return {
        hmac: Buffer.from(hkdfSync('sha256', ikm, HKDF_SALT, 'tacct-user-bidx', 32))
    };
}

function blindIndex(keys, value) {
    return createHmac('sha256', keys.hmac).update(value).digest('base64');
}

// --- Baserow -----------------------------------------------------------------
function enteteBaserow() {
    return { Authorization: `Token ${BASEROW_WRITE_API_KEY}` };
}

async function fetchBaserow(tableId) {
    const baseUrl = `${BASEROW_HOST}/api/database/rows/table/${tableId}/?user_field_names=true`;
    let allResults = [];
    let nextUrl = baseUrl;
    let page = 1;

    while (nextUrl) {
        console.log(`[baserow-tests-utilisateurs] requête page ${page} : ${nextUrl}`);
        const resp = await fetch(nextUrl, { method: 'GET', headers: enteteBaserow() });
        if (!resp.ok)
            throw new Error(`Baserow ${resp.status}: ${await resp.text()}`);
        const data = await resp.json();
        allResults = allResults.concat(data.results);
        console.log(
            `[baserow-tests-utilisateurs] page ${page} reçue : ${data.results.length} ligne(s) (total ${allResults.length})`
        );
        nextUrl = data.next ? data.next.replace(/^http:/, 'https:') : null;
        page++;
    }

    return allResults;
}

// Le champ est une liste déroulante : on résout les identifiants d'options une
// fois pour toutes, et on échoue tôt si un des trois tags attendus manque.
async function chargerOptionsChampTests(tableId) {
    const resp = await fetch(
        `${BASEROW_HOST}/api/database/fields/table/${tableId}/`,
        { method: 'GET', headers: enteteBaserow() }
    );
    if (!resp.ok) throw new Error(`Baserow ${resp.status}: ${await resp.text()}`);

    const champs = await resp.json();
    const champ = champs.find((c) => c.name === CHAMP_TESTS);
    if (!champ) {
        throw new Error(
            `Champ "${CHAMP_TESTS}" introuvable sur la table ${tableId}. Champs disponibles : ${champs
                .map((c) => c.name)
                .join(', ')}`
        );
    }
    if (champ.type !== 'single_select') {
        throw new Error(
            `Champ "${CHAMP_TESTS}" de type ${champ.type}, liste déroulante (single_select) attendue.`
        );
    }

    const options = new Map(
        (champ.select_options ?? []).map((option) => [option.value, option.id])
    );
    for (const tag of [TAG_OUI, TAG_NON, TAG_PAS_PRECISE]) {
        if (!options.has(tag)) {
            throw new Error(
                `Option "${tag}" absente du champ "${CHAMP_TESTS}". Options présentes : ${[
                    ...options.keys()
                ].join(', ')}`
            );
        }
    }
    return options;
}

async function appliquerMisesAJour(tableId, misesAJour, options) {
    let ecrites = 0;
    for (let debut = 0; debut < misesAJour.length; debut += TAILLE_LOT) {
        const lot = misesAJour.slice(debut, debut + TAILLE_LOT);
        const resp = await fetch(
            `${BASEROW_HOST}/api/database/rows/table/${tableId}/batch/?user_field_names=true`,
            {
                method: 'PATCH',
                headers: { ...enteteBaserow(), 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items: lot.map(({ id, tag }) => ({
                        id,
                        [CHAMP_TESTS]: options.get(tag)
                    }))
                })
            }
        );
        if (!resp.ok)
            throw new Error(`Baserow ${resp.status}: ${await resp.text()}`);
        ecrites += lot.length;
        console.log(
            `[baserow-tests-utilisateurs] lot écrit : ${ecrites}/${misesAJour.length} ligne(s)`
        );
    }
    return ecrites;
}

// --- PostgreSQL ----------------------------------------------------------------
const caPath = join(process.cwd(), 'ca.pem');
const sslConfig = fs.existsSync(caPath)
    ? { ca: fs.readFileSync(caPath, 'utf8'), rejectUnauthorized: false }
    : true;

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

// La question beta étant la dernière étape des profils qui la voient,
// questionnaire_validated suffit à distinguer "a vu la case et n'a pas coché"
// de "n'est pas allé jusque-là".
async function chargerReponses(client) {
    const result = await client.query(
        `SELECT email_bidx, wants_beta_features, questionnaire_validated, profil
         FROM tacct."user"
         WHERE email_bidx IS NOT NULL`
    );
    return new Map(
        result.rows.map((row) => {
            if (row.wants_beta_features) return [row.email_bidx, TAG_OUI];
            if (row.questionnaire_validated && PROFILS_AVEC_BETA.includes(row.profil))
                return [row.email_bidx, TAG_NON];
            return [row.email_bidx, TAG_PAS_PRECISE];
        })
    );
}

// --- Rapprochement -----------------------------------------------------------
function calculerMisesAJour(rows, reponses, keys) {
    const misesAJour = [];
    const repartition = { [TAG_OUI]: 0, [TAG_NON]: 0, [TAG_PAS_PRECISE]: 0 };
    let sansEmail = 0;
    let sansCorrespondance = 0;
    let inchangees = 0;

    for (const row of rows) {
        const email = row['Email'];
        if (typeof email !== 'string' || email.trim().length === 0) {
            sansEmail++;
            continue;
        }
        // Aucun compte chez nous pour cet email : on ne touche pas la ligne.
        const tag = reponses.get(blindIndex(keys, email.trim()));
        if (!tag) {
            sansCorrespondance++;
            continue;
        }
        repartition[tag]++;

        if (row[CHAMP_TESTS]?.value === tag) {
            inchangees++;
            continue;
        }
        misesAJour.push({ id: row.id, tag });
    }

    return { misesAJour, repartition, sansEmail, sansCorrespondance, inchangees };
}

// --- Main ------------------------------------------------------------------
export async function run({ apply, limite }) {
    if (!BASEROW_HOST || !BASEROW_WRITE_API_KEY) {
        throw new Error('BASEROW_HOST / BASEROW_WRITE_API_KEY manquants');
    }
    if (!SCALINGO_POSTGRESQL_URL) {
        throw new Error('SCALINGO_POSTGRESQL_URL manquante');
    }
    if (!USER_ENCRYPTION_KEY) {
        throw new Error('USER_ENCRYPTION_KEY manquante');
    }
    console.log(
        apply
            ? '[baserow-tests-utilisateurs] mode=APPLY'
            : '[baserow-tests-utilisateurs] mode=DRY-RUN (relancer avec --apply pour écrire)'
    );

    const keys = deriveKeys(USER_ENCRYPTION_KEY);
    const options = await chargerOptionsChampTests(BASEROW_TABLE_ID_CDM);

    const rows = await fetchBaserow(BASEROW_TABLE_ID_CDM);
    console.log(`[baserow-tests-utilisateurs] lignes récupérées : ${rows.length}`);

    const reponses = await withPg(chargerReponses);
    console.log(
        `[baserow-tests-utilisateurs] comptes avec email_bidx : ${reponses.size}`
    );

    const { misesAJour, repartition, sansEmail, sansCorrespondance, inchangees } =
        calculerMisesAJour(rows, reponses, keys);
    console.log(
        `[baserow-tests-utilisateurs] lignes ignorées : ${sansCorrespondance} sans compte chez nous, ` +
            `${sansEmail} sans email`
    );
    console.log(
        `[baserow-tests-utilisateurs] correspondances : ${TAG_OUI}=${repartition[TAG_OUI]}, ` +
            `${TAG_NON}=${repartition[TAG_NON]}, ${TAG_PAS_PRECISE}=${repartition[TAG_PAS_PRECISE]}`
    );
    console.log(
        `[baserow-tests-utilisateurs] déjà à jour : ${inchangees}, à modifier : ${misesAJour.length}`
    );

    if (!apply) {
        return {
            total: rows.length,
            repartition,
            sansEmail,
            sansCorrespondance,
            inchangees,
            aModifier: misesAJour.length
        };
    }

    const aEcrire = limite ? misesAJour.slice(0, limite) : misesAJour;
    if (limite) {
        console.log(
            `[baserow-tests-utilisateurs] --limit=${limite} : ${aEcrire.length} ligne(s) écrite(s) sur ${misesAJour.length}`
        );
    }

    const ecrites = await appliquerMisesAJour(
        BASEROW_TABLE_ID_CDM,
        aEcrire,
        options
    );
    console.log(`[baserow-tests-utilisateurs] terminé : ${ecrites} ligne(s) mise(s) à jour.`);

    return {
        total: rows.length,
        repartition,
        sansEmail,
        sansCorrespondance,
        inchangees,
        ecrites
    };
}

const estAppelDirect =
    process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (estAppelDirect) {
    const argLimite = process.argv.find((arg) => arg.startsWith('--limit='));
    const limite = argLimite ? Number(argLimite.split('=')[1]) : undefined;
    run({ apply: process.argv.includes('--apply'), limite }).catch((err) => {
        console.error('[baserow-tests-utilisateurs] échec :', err);
        process.exit(1);
    });
}
