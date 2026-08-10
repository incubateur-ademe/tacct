import 'dotenv/config';
import { createDecipheriv, hkdfSync } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { Pool } from 'pg';

// Lecture seule. Liste les comptes créés à partir d'une date, avec email déchiffré.
//   node scripts/lister-users-recents.mjs [date-ISO]
// Exemples :
//   node scripts/lister-users-recents.mjs              -> depuis 2026-05-01
//   node scripts/lister-users-recents.mjs 2026-06-01   -> depuis le 1er juin 2026
//
// created_at est en clair : le filtrage se fait en SQL. Seul l'email est
// déchiffré côté Node (AES-256-GCM), comme dans scripts/lire-user.mjs.

const depuis = process.argv[2] ?? '2026-05-01';

if (Number.isNaN(Date.parse(depuis))) {
    console.error(`Date invalide : « ${depuis} ». Format attendu : AAAA-MM-JJ`);
    process.exit(1);
}

const ikm = Buffer.from(process.env.USER_ENCRYPTION_KEY, 'base64');
const salt = Buffer.from('tacct-user-crypto');
const encKey = Buffer.from(hkdfSync('sha256', ikm, salt, 'tacct-user-enc', 32));

const decrypt = (v) => {
    if (typeof v !== 'string' || !v.startsWith('enc:v1:')) return v;
    try {
        const b = Buffer.from(v.slice(7), 'base64');
        const d = createDecipheriv('aes-256-gcm', encKey, b.subarray(0, 12));
        d.setAuthTag(b.subarray(12, 28));
        return Buffer.concat([d.update(b.subarray(28)), d.final()]).toString(
            'utf8'
        );
    } catch {
        // Clé incorrecte ou donnée corrompue : on ne fait pas tomber tout le listing.
        return '<déchiffrement impossible>';
    }
};

const ssl = existsSync('ca.pem')
    ? { ca: readFileSync('ca.pem', 'utf8'), rejectUnauthorized: false }
    : true;
const pool = new Pool({
    connectionString: process.env.SCALINGO_POSTGRESQL_URL.split('?')[0],
    ssl
});

const { rows } = await pool.query(
    `SELECT id, email, firstname, lastname, validated, encryption_version,
            created_at
       FROM tacct."user"
      WHERE created_at >= $1
      ORDER BY created_at`,
    [depuis]
);

console.log(`${rows.length} compte(s) créé(s) depuis le ${depuis}\n`);

for (const r of rows) {
    console.log({
        created_at: r.created_at.toISOString().slice(0, 19).replace('T', ' '),
        email: decrypt(r.email),
        prenom: decrypt(r.firstname),
        nom: decrypt(r.lastname),
        validated: r.validated,
        enc_v: r.encryption_version,
        id: r.id
    });
}

await pool.end();
