import dotenv from 'dotenv';
import fs from 'fs';
import pg from 'pg';

if (fs.existsSync('.env')) {
    dotenv.config();
}

function safeParseJSON(s) {
    if (s == null) return null;
    if (typeof s === 'object') return s;
    try {
        return JSON.parse(s);
    } catch {
        return null;
    }
}

// === ENV ===
const {
    SCALINGO_POSTGRESQL_URL,
    POSTHOG_HOST = 'https://eu.posthog.com',
    POSTHOG_PROJECT_ID,
    POSTHOG_API_KEY
} = process.env;

if (!SCALINGO_POSTGRESQL_URL) {
    console.error('SCALINGO_POSTGRESQL_URL manquante');
    process.exit(1);
}
if (!POSTHOG_PROJECT_ID || !POSTHOG_API_KEY) {
    console.error('POSTHOG_PROJECT_ID / POSTHOG_API_KEY manquantes');
    process.exit(1);
}
// === SQL helpers (pg) ===
async function withPg(fn) {
    const client = new pg.Client({
        connectionString: SCALINGO_POSTGRESQL_URL,
        ssl:
            process.env.NODE_ENV === 'development'
                ? { ca: fs.readFileSync('ca.pem'), rejectUnauthorized: true }
                : { require: true, rejectUnauthorized: false }
    });
    await client.connect();
    try {
        return await fn(client);
    } finally {
        await client.end();
    }
}

async function getMaxTs(client, table) {
    const { rows } = await client.query(`
    SELECT COALESCE(MAX(event_timestamp), '1970-01-01'::timestamptz) AS max_ts
    FROM analytics.${table}
  `);
    return rows[0].max_ts;
}

async function insertAllPageviewRaw(client, rows) {
    const sql = `
    INSERT INTO analytics.all_pageview_raw
      (event_timestamp, properties, distinct_id, session_id, current_url, person_id)
    VALUES ($1::timestamptz, $2::jsonb, $3::text, $4::text, $5::text, $6::text)
    ON CONFLICT ON CONSTRAINT uq_all_pageview_raw_natural DO NOTHING
  `;
    let inserted = 0;
    for (const row of rows) {
        if (!Array.isArray(row)) continue;
        const [
            ts,
            propertiesStr,
            distinct_id,
            session_id,
            current_url,
            person_id
        ] = row;
        const props =
            typeof propertiesStr === 'string'
                ? safeParseJSON(propertiesStr)
                : propertiesStr;
        await client.query(sql, [
            ts,
            JSON.stringify(props ?? {}),
            distinct_id ?? '',
            session_id ?? '',
            current_url ?? '',
            person_id ?? ''
        ]);
        inserted++;
    }
    return inserted;
}

async function insertAllAutocaptureRaw(client, rows) {
    const sql = `
    INSERT INTO analytics.all_autocapture_raw
      (event_timestamp, properties, distinct_id, session_id, current_url, person_id)
    VALUES ($1::timestamptz, $2::jsonb, $3::text, $4::text, $5::text, $6::text)
    ON CONFLICT ON CONSTRAINT uq_all_autocapture_raw_natural DO NOTHING
  `;
    let inserted = 0;
    for (const row of rows) {
        if (!Array.isArray(row)) continue;
        const [
            ts,
            propertiesStr,
            distinct_id,
            session_id,
            current_url,
            person_id
        ] = row;
        const props =
            typeof propertiesStr === 'string'
                ? safeParseJSON(propertiesStr)
                : propertiesStr;
        await client.query(sql, [
            ts,
            JSON.stringify(props ?? {}),
            distinct_id ?? '',
            session_id ?? '',
            current_url ?? '',
            person_id ?? ''
        ]);
        inserted++;
    }
    return inserted;
}

async function insertBoutonsExportRaw(client, rows) {
    const sql = `
    INSERT INTO analytics.boutons_export_raw
      (event, event_timestamp, session_id, person_id, code_geographique, libelle_geographique, thematique)
    VALUES ($1::text, $2::timestamptz, $3::text, $4::text, $5::text, $6::text, $7::text)
    ON CONFLICT ON CONSTRAINT uq_boutons_export_raw_natural DO NOTHING
  `;
    let inserted = 0;
    for (const row of rows) {
        if (!Array.isArray(row)) continue;
        const [
            event,
            ts,
            session_id,
            person_id,
            code_geographique,
            libelle_geographique,
            thematique
        ] = row;
        await client.query(sql, [
            event ?? '',
            ts,
            session_id ?? '',
            person_id ?? '',
            code_geographique ?? '',
            libelle_geographique ?? '',
            thematique ?? ''
        ]);
        inserted++;
    }
    return inserted;
}

async function insertBoutonsHomepage(client, rows) {
    const sql = `
    INSERT INTO analytics.boutons_homepage
      (event, event_timestamp, properties, distinct_id, session_id, person_id)
    VALUES ($1::text, $2::timestamptz, $3::jsonb, $4::text, $5::text, $6::text)
    ON CONFLICT ON CONSTRAINT uq_boutons_homepage_natural DO NOTHING
  `;
    let inserted = 0;
    for (const row of rows) {
        if (!Array.isArray(row)) continue;
        const [ts, event, propertiesStr, distinct_id, session_id, person_id] =
            row;
        const props =
            typeof propertiesStr === 'string'
                ? safeParseJSON(propertiesStr)
                : propertiesStr;
        await client.query(sql, [
            ts,
            event ?? '',
            JSON.stringify(props ?? {}),
            distinct_id ?? '',
            session_id ?? '',
            person_id ?? ''
        ]);
        inserted++;
    }
    return inserted;
}

async function insertBoutonsEtape2(client, rows) {
    const sql = `
    INSERT INTO analytics.boutons_etape2
      (event, event_timestamp, properties, distinct_id, session_id, person_id)
    VALUES ($1::text, $2::timestamptz, $3::jsonb, $4::text, $5::text, $6::text)
    ON CONFLICT ON CONSTRAINT uq_boutons_etape2_natural DO NOTHING
  `;
    let inserted = 0;
    for (const row of rows) {
        if (!Array.isArray(row)) continue;
        const [event, ts, propertiesStr, distinct_id, session_id, person_id] =
            row;
        const props =
            typeof propertiesStr === 'string'
                ? safeParseJSON(propertiesStr)
                : propertiesStr;
        await client.query(sql, [
            event ?? '',
            ts,
            JSON.stringify(props ?? {}),
            distinct_id ?? '',
            session_id ?? '',
            person_id ?? ''
        ]);
        inserted++;
    }
    return inserted;
}

async function insertThematique(client, rows) {
    const sql = `
    INSERT INTO analytics.thematique
      (event_timestamp, properties, distinct_id, session_id, person_id, thematique)
    VALUES ($1::timestamptz, $2::jsonb, $3::text, $4::text, $5::text, $6::text)
    ON CONFLICT ON CONSTRAINT uq_thematique_natural DO NOTHING
  `;
    let inserted = 0;
    for (const row of rows) {
        if (!Array.isArray(row)) continue;
        const [
            ts,
            propertiesStr,
            distinct_id,
            session_id,
            person_id,
            thematique
        ] = row;
        const props =
            typeof propertiesStr === 'string'
                ? safeParseJSON(propertiesStr)
                : propertiesStr;
        await client.query(sql, [
            ts,
            JSON.stringify(props ?? {}),
            distinct_id ?? '',
            session_id ?? '',
            person_id ?? '',
            thematique ?? ''
        ]);
        inserted++;
    }
    return inserted;
}

async function insertTacctoscopeRessources(client, rows) {
    const sql = `
    INSERT INTO analytics.tacctoscope_ressources
      (event_timestamp, session_id, person_id, ressource_url, ressource_titre, ressource_tag)
    VALUES ($1::timestamptz, $2::text, $3::text, $4::text, $5::text, $6::text)
    ON CONFLICT ON CONSTRAINT uq_tacctoscope_ressources_natural DO NOTHING
  `;
    let inserted = 0;
    for (const row of rows) {
        if (!Array.isArray(row)) continue;
        const [
            ts,
            session_id,
            person_id,
            ressource_url,
            ressource_titre,
            ressource_tag
        ] = row;
        await client.query(sql, [
            ts,
            session_id ?? '',
            person_id ?? '',
            ressource_url ?? '',
            ressource_titre ?? '',
            ressource_tag ?? ''
        ]);
        inserted++;
    }
    return inserted;
}

// === HogQL fetch ===
async function fetchPosthog(query) {
    const url = `${POSTHOG_HOST}/api/projects/${POSTHOG_PROJECT_ID}/query/`;
    const resp = await fetch(url, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${POSTHOG_API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query: { kind: 'HogQLQuery', query } })
    });
    if (!resp.ok)
        throw new Error(`PostHog ${resp.status}: ${await resp.text()}`);
    const { results = [] } = await resp.json();
    return results;
}

function injectWindow(hogql, startIso) {
    // remplace "AND timestamp < now()" par borne basse + haute
    return hogql.replace(
        /AND\s+timestamp\s*<\s*now\(\)/i,
        `AND timestamp >= toDateTime('${startIso}') AND timestamp < now()`
    );
}

// === Main ===
(async () => {
    // Configuration des requêtes ETL avec leurs paramètres
    const etlQueries = [
        {
            name: 'pageviews',
            sqlFile: './etl/queries/pageviews.hogql.sql',
            table: 'all_pageview_raw',
            insertFunction: insertAllPageviewRaw,
            description: 'Événements de pages vues'
        },
        {
            name: 'autocapture',
            sqlFile: './etl/queries/autocapture.hogql.sql',
            table: 'all_autocapture_raw',
            insertFunction: insertAllAutocaptureRaw,
            description: "Événements d'auto-capture"
        },
        {
            name: 'exports',
            sqlFile: './etl/queries/exports.hogql.sql',
            table: 'boutons_export_raw',
            insertFunction: insertBoutonsExportRaw,
            description: "Événements d'export de boutons"
        },
        {
            name: 'boutons_homepage',
            sqlFile: './etl/queries/boutons_homepage.hogql.sql',
            table: 'boutons_homepage',
            insertFunction: insertBoutonsHomepage,
            description: 'Événements de boutons sur la homepage'
        },
        {
            name: 'boutons_etape2',
            sqlFile: './etl/queries/boutons_etape2.hogql.sql',
            table: 'boutons_etape2',
            insertFunction: insertBoutonsEtape2,
            description: 'Événements de boutons étape 2'
        },
        {
            name: 'thematique',
            sqlFile: './etl/queries/thematique.hogql.sql',
            table: 'thematique',
            insertFunction: insertThematique,
            description: 'Événements de thématique'
        },
        {
            name: 'tacctoscope_ressources',
            sqlFile: './etl/queries/tacctoscope_ressources.hogql.sql',
            table: 'tacctoscope_ressources',
            insertFunction: insertTacctoscopeRessources,
            description:
                'Clics sur les ressources de la feuille de route du tacctoscope'
        }
    ];

    console.log(`[ETL] Début du processus avec ${etlQueries.length} requêtes`);

    for (const queryConfig of etlQueries) {
        console.log(
            `\n[ETL] Traitement de ${queryConfig.name} (${queryConfig.description})...`
        );

        try {
            //Calculer la borne basse : now() - 30h
            const startIso = new Date(
                Date.now() - 30 * 60 * 60 * 1000
            ).toISOString();

            let hogql = fs.readFileSync(queryConfig.sqlFile, 'utf8');
            hogql = injectWindow(hogql, startIso);

            const results = await fetchPosthog(hogql);
            console.log(
                `[${queryConfig.name}] Données récupérées : ${results.length} lignes`
            );

            const inserted = await withPg(async (client) =>
                queryConfig.insertFunction(client, results)
            );

            console.log(
                `[${queryConfig.name}] Terminé : ${inserted}/${results.length} ligne(s) insérée(s).`
            );
        } catch (error) {
            console.error(`[${queryConfig.name}] Erreur :`, error);
        }
    }

    console.log('\n[ETL] Processus terminé pour toutes les requêtes.');
})().catch((e) => {
    console.error('[ETL] Erreur fatale :', e);
    process.exit(1);
});
