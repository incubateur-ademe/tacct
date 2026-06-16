import 'dotenv/config';
import { createDecipheriv, createHmac, hkdfSync } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { Pool } from 'pg';

const email = process.argv[2]; // email EXACT (casse + espaces compris)
const ikm = Buffer.from(process.env.USER_ENCRYPTION_KEY, 'base64');
const salt = Buffer.from('tacct-user-crypto');
const encKey = Buffer.from(hkdfSync('sha256', ikm, salt, 'tacct-user-enc', 32));
const hmacKey = Buffer.from(
    hkdfSync('sha256', ikm, salt, 'tacct-user-bidx', 32)
);

// 1) blind index pour retrouver la ligne
const emailBidx = createHmac('sha256', hmacKey).update(email).digest('base64');

// 2) déchiffrement d'un champ enc:v1:
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

const { rows } = await pool.query(
    `SELECT id, email, username, firstname, lastname
     FROM tacct."user" WHERE email_bidx = $1`,
    [emailBidx]
);
for (const r of rows) {
    console.log({
        id: r.id,
        email: decrypt(r.email),
        username: decrypt(r.username),
        firstname: decrypt(r.firstname),
        lastname: decrypt(r.lastname)
    });
}
await pool.end();
