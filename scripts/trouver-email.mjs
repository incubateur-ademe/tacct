import 'dotenv/config';
import { createDecipheriv, hkdfSync } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { Pool } from 'pg';

// Lecture seule. Recherche PARTIELLE sur l'email.
//   node scripts/trouver-email.mjs <fragment>
//
// L'email est chiffré (AES-GCM) et le seul index cherchable, email_bidx, est un
// HMAC de la valeur exacte : aucun LIKE n'est possible côté base. On lit donc
// toutes les lignes, on déchiffre en mémoire, et on filtre sur le fragment
// (insensible à la casse). Sortie identique à lire-user.mjs pour chaque compte.

const fragment = process.argv[2];

if (!fragment) {
    console.error('Usage : node scripts/trouver-email.mjs <fragment>');
    console.error('Exemple : node scripts/trouver-email.mjs nievre.fr');
    process.exit(1);
}

const ikm = Buffer.from(process.env.USER_ENCRYPTION_KEY, 'base64');
const salt = Buffer.from('tacct-user-crypto');
const encKey = Buffer.from(hkdfSync('sha256', ikm, salt, 'tacct-user-enc', 32));

const decrypt = (v) => {
    if (typeof v !== 'string' || !v.startsWith('enc:v1:')) return v;
    const b = Buffer.from(v.slice(7), 'base64');
    const d = createDecipheriv('aes-256-gcm', encKey, b.subarray(0, 12));
    d.setAuthTag(b.subarray(12, 28));
    return Buffer.concat([d.update(b.subarray(28)), d.final()]).toString(
        'utf8'
    );
};

const ssl = existsSync('ca.pem')
    ? { ca: readFileSync('ca.pem', 'utf8'), rejectUnauthorized: false }
    : true;
const pool = new Pool({
    connectionString: process.env.SCALINGO_POSTGRESQL_URL.split('?')[0],
    ssl
});

const COLONNES = `id, email, username, firstname, lastname, authenticated_id,
                  validated, validated_terms_of_use, roles, commune_id,
                  study_office_id, encryption_version, created_at, updated_at`;

const cible = fragment.toLowerCase();

const { rows } = await pool.query(
    `SELECT ${COLONNES} FROM tacct."user" ORDER BY created_at`
);

const correspondances = [];
let illisibles = 0;

for (const r of rows) {
    let email;
    try {
        email = decrypt(r.email);
    } catch {
        // Ligne non déchiffrable (clé différente / donnée corrompue) : on l'ignore
        // mais on le signale pour ne pas laisser croire à un scan complet.
        illisibles++;
        continue;
    }
    if (typeof email === 'string' && email.toLowerCase().includes(cible)) {
        correspondances.push({ ...r, emailClair: email });
    }
}

console.log(
    `${rows.length} compte(s) parcouru(s), ${correspondances.length} correspondance(s) pour « ${fragment} ».\n`
);

if (illisibles) {
    console.log(
        `⚠ ${illisibles} ligne(s) non déchiffrable(s), exclue(s) de la recherche.\n`
    );
}

for (const r of correspondances) {
    console.log({
        id: r.id,
        email: r.emailClair,
        username: decrypt(r.username),
        firstname: decrypt(r.firstname),
        lastname: decrypt(r.lastname),
        authenticated_id: decrypt(r.authenticated_id),
        validated: r.validated,
        validated_terms_of_use: r.validated_terms_of_use,
        roles: r.roles,
        commune_id: r.commune_id,
        study_office_id: r.study_office_id,
        encryption_version: r.encryption_version,
        created_at: r.created_at,
        updated_at: r.updated_at
    });

    // Études associées via la table de jointure user_study (non chiffrées)
    const { rows: etudes } = await pool.query(
        `SELECT s.id, s.territory_name, s.year, s.commune_id,
                s.observed_exposure_valid, s.sensibility_valid,
                s.exposition_future_valid, s.strategy_construction_valid,
                us.head_study, s.created_at, s.updated_at
         FROM tacct.user_study us
         JOIN tacct.study s ON s.id = us.study_id
         WHERE us.user_id = $1
         ORDER BY s.created_at`,
        [r.id]
    );

    if (etudes.length === 0) {
        console.log('\nAucune étude associée.\n');
    } else {
        console.log(`\n${etudes.length} étude(s) associée(s) :`);
        for (const e of etudes) {
            console.log({
                id: e.id,
                territory_name: e.territory_name,
                year: Number(e.year),
                commune_id: e.commune_id,
                head_study: e.head_study,
                observed_exposure_valid: e.observed_exposure_valid,
                sensibility_valid: e.sensibility_valid,
                exposition_future_valid: e.exposition_future_valid,
                strategy_construction_valid: e.strategy_construction_valid,
                created_at: e.created_at,
                updated_at: e.updated_at
            });
        }
        console.log('');
    }
}

await pool.end();
