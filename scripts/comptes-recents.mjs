// Usage : node scripts/comptes-recents.mjs <date> [--champ created|updated|connexion|tous] [--csv]
//
// Lecture seule. Comptes crees, modifies ou connectes depuis une date
// (AAAA-MM-JJ ou ISO).
//
// last_login_at : ecrit a chaque connexion par le callback OIDC. NULL = aucune
// connexion depuis la mise en place du suivi (12/08/2026), pas « jamais
// connecte ».
//
// updated_at n'est PAS une date de connexion : il ne bouge qu'a la creation du
// compte, au premier rattachement SSO, et lors d'une modification de profil ou
// d'une action admin.

import 'dotenv/config';
import { createDecipheriv, hkdfSync } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { Pool } from 'pg';

const argv = process.argv;
const opt = (nom, def) => {
    const i = argv.indexOf(nom);
    return i === -1 ? def : argv[i + 1];
};

const date = argv[2];
const champ = opt('--champ', 'tous');
const CSV = argv.includes('--csv');

if (!date || !['created', 'updated', 'connexion', 'tous'].includes(champ)) {
    console.error('Usage : node scripts/comptes-recents.mjs <date> [--champ created|updated|connexion|tous] [--csv]');
    console.error('Exemple : node scripts/comptes-recents.mjs 2026-08-11');
    process.exit(1);
}
if (Number.isNaN(Date.parse(date))) {
    console.error(`Date illisible : ${date} (attendu AAAA-MM-JJ ou ISO)`);
    process.exit(1);
}
if (!process.env.USER_ENCRYPTION_KEY || !process.env.SCALINGO_POSTGRESQL_URL) {
    console.error('USER_ENCRYPTION_KEY ou SCALINGO_POSTGRESQL_URL manquant.');
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
        return Buffer.concat([d.update(b.subarray(28)), d.final()]).toString('utf8');
    } catch {
        return '<non dechiffrable>';
    }
};

const ssl = existsSync('ca.pem')
    ? { ca: readFileSync('ca.pem', 'utf8'), rejectUnauthorized: false }
    : true;
const pool = new Pool({
    connectionString: process.env.SCALINGO_POSTGRESQL_URL.split('?')[0],
    ssl
});

const CONDITION = {
    created: 'u.created_at >= $1',
    updated: 'u.updated_at >= $1',
    connexion: 'u.last_login_at >= $1',
    tous: '(u.created_at >= $1 OR u.updated_at >= $1 OR u.last_login_at >= $1)'
}[champ];

const horodatage = (d) => (d ? d.toISOString().slice(0, 16).replace('T', ' ') : null);

try {
    const { rows } = await pool.query(
        `SELECT u.id, u.email, u.firstname, u.lastname, u.commune_id, u.validated,
                u.roles, u.authenticated_id, u.created_at, u.updated_at, u.last_login_at,
                (SELECT count(*) FROM tacct.user_study us WHERE us.user_id = u.id) AS etudes
         FROM tacct."user" u
         WHERE ${CONDITION}
         ORDER BY greatest(u.created_at, u.updated_at, coalesce(u.last_login_at, 'epoch')) DESC`,
        [date]
    );

    const debut = new Date(date);
    const lignes = rows.map((r) => ({
        email: decrypt(r.email),
        nom: `${decrypt(r.firstname)} ${decrypt(r.lastname)}`.trim(),
        type: r.created_at >= debut ? 'cree' : 'modifie',
        cree_le: horodatage(r.created_at),
        modifie_le: horodatage(r.updated_at),
        derniere_connexion: horodatage(r.last_login_at) ?? '—',
        sso: r.authenticated_id ? 'oui' : 'non',
        validated: r.validated,
        commune: r.commune_id,
        etudes: Number(r.etudes),
        id: r.id
    }));

    const crees = lignes.filter((l) => l.type === 'cree').length;
    const connectes = rows.filter((r) => r.last_login_at && r.last_login_at >= debut).length;
    console.log(
        `${lignes.length} compte(s) depuis ${date} — ${crees} cree(s), ${lignes.length - crees} modifie(s), ` +
            `${connectes} connecte(s). ${lignes.filter((l) => l.sso === 'oui').length} rattache(s) SSO.\n`
    );

    if (CSV) {
        const cols = Object.keys(lignes[0] ?? {});
        console.log(cols.join(';'));
        for (const l of lignes)
            console.log(cols.map((c) => `"${String(l[c]).replace(/"/g, '""')}"`).join(';'));
    } else {
        console.table(lignes);
    }
} catch (err) {
    console.error('Erreur :', err.message);
    process.exitCode = 1;
} finally {
    await pool.end();
}
