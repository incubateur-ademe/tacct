import 'dotenv/config';

// Sonde manuelle des API Mulesoft (CRM CONNECT) — LECTURE SEULE.
// N'effectue que des GET : aucune création ni modification de contact.
//   node scripts/crm-ping.mjs <email>

const email = process.argv[2];

if (!email) {
    console.error('Usage : node scripts/crm-ping.mjs <email>');
    process.exit(1);
}

const base = (process.env.MULESOFT_ENV ?? '').replace(/\/+$/, '');
const clientId = process.env.MULESOFT_CLIENT_ID;
const clientSecret = process.env.MULESOFT_CLIENT_SECRET;

if (!base || !clientId || !clientSecret) {
    console.error('MULESOFT_ENV, MULESOFT_CLIENT_ID et MULESOFT_CLIENT_SECRET sont requis.');
    process.exit(1);
}

const mask = (v) => `${v.slice(0, 4)}…${v.slice(-2)} (${v.length} car.)`;

console.log('Base URL     :', base);
console.log('client_id    :', mask(clientId));
console.log('client_secret:', mask(clientSecret));
console.log('Mode         : GET uniquement, aucune écriture\n');

const MODES = {
    headers: () => ({ client_id: clientId, client_secret: clientSecret }),
    basic: () => ({
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`
    }),
    aucun: () => ({})
};

async function probe(modeName, path, full) {
    const started = Date.now();
    try {
        const res = await fetch(`${base}${path}`, {
            method: 'GET',
            headers: MODES[modeName]()
        });
        const text = await res.text();
        console.log(`[${modeName}] GET ${path} → HTTP ${res.status} (${Date.now() - started} ms)`);
        console.log(`  content-type: ${res.headers.get('content-type') ?? '—'}`);
        if (full) {
            let rendered = text;
            try {
                rendered = JSON.stringify(JSON.parse(text), null, 2);
            } catch {
                /* corps non-JSON : affiché tel quel */
            }
            console.log(rendered);
        } else {
            console.log(`  body: ${text.slice(0, 600)}${text.length > 600 ? '…' : ''}`);
        }
        console.log();
        return res.status;
    } catch (err) {
        console.log(`[${modeName}] GET ${path} → échec réseau : ${err.message}\n`);
        return null;
    }
}

const path = `/personnes/mail/${encodeURIComponent(email)}`;
const configuredMode = process.env.MULESOFT_AUTH_MODE;

// Mode connu : une seule sonde, corps complet. Sinon découverte sur les trois.
if (configuredMode && MODES[configuredMode]) {
    console.log(`Mode d_authentification : ${configuredMode} (MULESOFT_AUTH_MODE)\n`);
    await probe(configuredMode, path, true);
    process.exit(0);
}

const status = {};
for (const mode of ['headers', 'basic', 'aucun']) {
    status[mode] = await probe(mode, path, false);
}

const accepted = ['headers', 'basic'].filter(
    (m) => status[m] !== null && ![401, 403].includes(status[m])
);
const witnessRejected = [401, 403].includes(status.aucun);

console.log('--- Verdict ---');
if (accepted.length === 0) {
    console.log('Aucun mode ne passe : identifiants invalides, ou mode d_auth autre que les deux testés.');
} else if (accepted.length === 2 && !witnessRejected) {
    console.log('Les deux modes passent, et l_appel sans authentification aussi.');
    console.log('Le test ne tranche donc rien : cet endpoint ne semble pas protégé.');
} else {
    console.log(`Mode(s) accepté(s) : ${accepted.join(', ')}`);
    console.log(`→ MULESOFT_AUTH_MODE=${accepted[0]}`);
}
