import 'dotenv/config';

// Création d'un contact de test (CRM CONNECT) — ÉCRITURE, recette uniquement.
// Envoie le même corps que scripts/crm-dry-run.mjs.
//   node scripts/crm-post-test.mjs <email> [prenom] [nom]

const RECETTE_HOST = 'preprod-api-interne.ademe.fr';

const [email, prenom = 'Test', nom = 'TACCT'] = process.argv.slice(2);

if (!email) {
    console.error('Usage : node scripts/crm-post-test.mjs <email> [prenom] [nom]');
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

if (new URL(base).host !== RECETTE_HOST) {
    console.error(`Refusé : MULESOFT_ENV doit pointer sur la recette (${RECETTE_HOST}), reçu ${base}`);
    process.exit(1);
}

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

const authHeaders =
    authMode === 'basic'
        ? { Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}` }
        : { client_id: clientId, client_secret: clientSecret };

console.log(`POST ${base}/personnes`);
console.log(JSON.stringify(body, null, 2));
console.log();

const started = Date.now();
try {
    const res = await fetch(`${base}/personnes`, {
        method: 'POST',
        headers: { ...authHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });
    const text = await res.text();
    console.log(`→ HTTP ${res.status} (${Date.now() - started} ms)`);
    try {
        console.log(JSON.stringify(JSON.parse(text), null, 2));
    } catch {
        console.log(text);
    }
    if (res.ok) {
        console.log(`\nMis en file. Relecture dans quelques minutes : node scripts/crm-ping.mjs ${email}`);
    }
} catch (err) {
    console.log(`→ échec réseau : ${err.message}`);
}
