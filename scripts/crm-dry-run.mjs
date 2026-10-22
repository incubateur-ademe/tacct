import 'dotenv/config';

// Simulation d'une création de contact (CRM CONNECT) — AUCUN ENVOI.
// Construit la requête comme createContact (src/lib/crm/contact.ts) et l'affiche.
//   node scripts/crm-dry-run.mjs <email> [prenom] [nom]

const [email, prenom = 'Test', nom = 'TACCT'] = process.argv.slice(2);

if (!email) {
    console.error('Usage : node scripts/crm-dry-run.mjs <email> [prenom] [nom]');
    process.exit(1);
}

const base = (process.env.MULESOFT_ENV ?? '').replace(/\/+$/, '');
const clientId = process.env.MULESOFT_CLIENT_ID;
const clientSecret = process.env.MULESOFT_CLIENT_SECRET;
const source = process.env.MULESOFT_SOURCE;
const authMode = process.env.MULESOFT_AUTH_MODE === 'basic' ? 'basic' : 'headers';

if (!base || !clientId || !clientSecret || !source) {
    console.error('MULESOFT_ENV, MULESOFT_CLIENT_ID, MULESOFT_CLIENT_SECRET et MULESOFT_SOURCE sont requis.');
    process.exit(1);
}

const mask = (v) => `${v.slice(0, 4)}…${v.slice(-2)} (${v.length} car.)`;

const toCrmDate = (date) => {
    const pad = (n) => String(n).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T00:00:00`;
};

const stripEmpty = (payload) =>
    Object.fromEntries(
        Object.entries(payload).filter(([, value]) => {
            if (value === undefined || value === null) return false;
            if (typeof value === 'string' && value.trim() === '') return false;
            if (Array.isArray(value) && value.length === 0) return false;
            return true;
        })
    );

const originTags = (process.env.MULESOFT_ORIGIN_TAG ?? '')
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);

const body = stripEmpty({
    email,
    prenom,
    nom,
    dateCreation: toCrmDate(new Date()),
    source,
    rubriques: Array.from(new Set(originTags))
});

const headers =
    authMode === 'basic'
        ? { Authorization: `Basic ${mask(Buffer.from(`${clientId}:${clientSecret}`).toString('base64'))}` }
        : { client_id: mask(clientId), client_secret: mask(clientSecret) };

console.log(`POST ${base}/personnes`);
console.log("Mode d'authentification :", authMode);
for (const [name, value] of Object.entries({ ...headers, 'Content-Type': 'application/json' })) {
    console.log(`${name}: ${value}`);
}
console.log();
console.log(JSON.stringify(body, null, 2));
console.log('\nAucune requête envoyée.');
