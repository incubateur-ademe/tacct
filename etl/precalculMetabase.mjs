// Sans dépendance : lancé tel quel par le cron, node_modules n'est pas dans le slug.
const { METABASE_PRECALCUL_URL, METABASE_PRECALCUL_SECRET } = process.env;

if (!METABASE_PRECALCUL_URL || !METABASE_PRECALCUL_SECRET) {
    console.error(
        'METABASE_PRECALCUL_URL / METABASE_PRECALCUL_SECRET manquantes'
    );
    process.exit(1);
}

const reponse = await fetch(METABASE_PRECALCUL_URL, {
    method: 'POST',
    headers: { Authorization: `Bearer ${METABASE_PRECALCUL_SECRET}` }
});

console.log(`[metabase] précalcul demandé : ${reponse.status}`);
if (!reponse.ok) {
    process.exit(1);
}
