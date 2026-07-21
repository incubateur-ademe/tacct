import 'dotenv/config';
import { createDecipheriv, createHmac, hkdfSync } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { Pool } from 'pg';

// Lecture seule. Accepte au choix :
//   - un email          → recherche par blind index email_bidx
//   - un user.id        → recherche directe (colonne en clair)
//   - un sub ProConnect → recherche par blind index authenticated_id_bidx
//   node scripts/lire-user.mjs <email | id | sub>

const identifiant = process.argv[2]; // valeur EXACTE (casse + espaces compris)

if (!identifiant) {
    console.error('Usage : node scripts/lire-user.mjs <email | id | sub>');
    process.exit(1);
}

const ikm = Buffer.from(process.env.USER_ENCRYPTION_KEY, 'base64');
const salt = Buffer.from('tacct-user-crypto');
const encKey = Buffer.from(hkdfSync('sha256', ikm, salt, 'tacct-user-enc', 32));
const hmacKey = Buffer.from(
    hkdfSync('sha256', ikm, salt, 'tacct-user-bidx', 32)
);

const bidx = (v) => createHmac('sha256', hmacKey).update(v).digest('base64');

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

const estUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    identifiant
);

// Ordre d'essai selon la forme de l'identifiant. Le premier qui renvoie une ligne gagne.
const strategies = identifiant.includes('@')
    ? [['email (email_bidx)', 'email_bidx = $1', bidx(identifiant)]]
    : estUuid
      ? [
            ['user.id (colonne en clair)', 'id = $1', identifiant],
            ['sub ProConnect (authenticated_id_bidx)', 'authenticated_id_bidx = $1', bidx(identifiant)]
        ]
      : [
            ['email (email_bidx)', 'email_bidx = $1', bidx(identifiant)],
            ['sub ProConnect (authenticated_id_bidx)', 'authenticated_id_bidx = $1', bidx(identifiant)]
        ];

let trouve = false;

for (const [libelle, clause, valeur] of strategies) {
    const { rows } = await pool.query(
        `SELECT ${COLONNES} FROM tacct."user" WHERE ${clause}`,
        [valeur]
    );
    if (rows.length === 0) continue;

    trouve = true;
    console.log(`Trouvé via ${libelle}\n`);
    for (const r of rows) {
        console.log({
            id: r.id,
            email: decrypt(r.email),
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
    }
    break;
}

if (!trouve) {
    console.log(
        `Aucun compte pour « ${identifiant} » (pistes essayées : ${strategies
            .map(([l]) => l)
            .join(', ')}).`
    );
}

await pool.end();
