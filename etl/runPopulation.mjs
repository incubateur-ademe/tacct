import dotenv from 'dotenv';
import fs from 'fs';
import pg from 'pg';
import XLSX from 'xlsx';

if (fs.existsSync('.env')) {
    dotenv.config();
}

const { BASEROW_HOST, BASEROW_API_KEY, SCALINGO_POSTGRESQL_URL } = process.env;
const BASEROW_TABLE_ID_TERRITOIRES = '497101';
const dbConnectionString = SCALINGO_POSTGRESQL_URL;

if (!BASEROW_HOST || !BASEROW_API_KEY || !SCALINGO_POSTGRESQL_URL) {
    console.error(
        "Variables d'environnement manquantes : BASEROW_HOST, BASEROW_API_KEY, et DB_CONNECTION_STRING ou SCALINGO_POSTGRESQL_URL"
    );
    process.exit(1);
}

// === SQL helpers (pg) ===
async function withPg(fn) {
    const client = new pg.Client({
        connectionString: dbConnectionString,
        ssl:
            process.env.NODE_ENV === 'dev'
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

// Fonction pour parser CSV simple
function parseCSV(csvText, delimiter = ';') {
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(delimiter).map((h) => h.trim());
    const rows = lines.slice(1).map((line) => {
        const values = line.split(delimiter).map((v) => v.trim());
        const obj = {};
        headers.forEach((h, i) => (obj[h] = values[i]));
        return obj;
    });
    return rows;
}

// Fonction merge simple (left join) - gère les multiples matches
function leftMerge(left, right, leftKey, rightKey) {
    const rightMap = new Map();
    right.forEach((row) => {
        const key = row[rightKey];
        if (!rightMap.has(key)) rightMap.set(key, []);
        rightMap.get(key).push(row);
    });
    return left.flatMap((leftRow) => {
        const rightRows = rightMap.get(leftRow[leftKey]) || [];
        return rightRows.length > 0
            ? rightRows.map((rightRow) => ({ ...leftRow, ...rightRow }))
            : [leftRow];
    });
}

// === Fonctions ===
async function fetchBaserow(tableId) {
    const baseUrl = `${BASEROW_HOST}/api/database/rows/table/${tableId}/?user_field_names=true`;
    let allResults = [];
    let nextUrl = baseUrl;
    while (nextUrl) {
        const resp = await fetch(nextUrl, {
            headers: { Authorization: `Token ${BASEROW_API_KEY}` }
        });
        if (!resp.ok) {
            throw new Error(`Baserow ${resp.status}: ${await resp.text()}`);
        }
        const data = await resp.json();
        allResults = allResults.concat(data.results);
        nextUrl = data.next;
        if (nextUrl) {
            nextUrl = nextUrl.replace('http:', 'https:');
        }
    }
    console.log('[Baserow] Fetched', allResults.length, 'table', allResults);
    return allResults;
}

async function loadPopulation() {
    const resp = await fetch(
        'https://www.insee.fr/fr/statistiques/fichier/3698339/base-pop-historiques-1876-2023.xlsx'
    );
    if (!resp.ok)
        throw new Error(`Erreur chargement population: ${resp.status}`);
    const buffer = await resp.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: 'array' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1, range: 5 }); // header=5 (0-indexed)
    const headers = jsonData[0];
    const rows = jsonData.slice(1).map((row) => {
        const obj = {};
        headers.forEach((h, i) => (obj[h] = row[i]));
        return obj;
    });
    return rows
        .map((row) => ({
            code_geographique: row['CODGEO'],
            population_2023: row['PMUN2023']
        }))
        .filter((row) => row.code_geographique && row.population_2023);
}

async function loadTerritoires() {
    return await withPg(async (client) => {
        await client.query("SET search_path = 'databases'");
        const { rows } = await client.query(
            'SELECT * FROM databases_v2.collectivites_searchbar'
        );
        return rows.filter((row) => row.code_geographique != null);
    });
}

async function loadSirenCode() {
    const resp = await fetch(
        'https://data.smartidf.services/api/explore/v2.1/catalog/datasets/georef-france-matching-siren-code/exports/csv?lang=fr&timezone=Europe%2FBerlin&use_labels=true&delimiter=%3B'
    );
    if (!resp.ok)
        throw new Error(`Erreur chargement siren_code: ${resp.status}`);
    const csvText = await resp.text();
    const rows = parseCSV(csvText, ';');
    return rows.map((row) => ({
        type: row['Type'],
        siren: row['SIREN'],
        code_geographique: row['Code INSEE Officiel']
    }));
}

function processTerritoires(df, territoires, sirenCode) {
    const typesACompter = [
        'CC',
        'CA',
        'CU',
        'Commune',
        'PETR',
        'Département',
        'PNR',
        'Métropole',
        'EPT'
    ];
    let data = df.filter(
        (row) =>
            row.siren &&
            row.siren.length > 0 &&
            typesACompter.includes(row.type)
    );

    // Renommer types
    data = data.map((row) => ({
        ...row,
        type: ['CC', 'CA', 'CU', 'Métropole'].includes(row.type)
            ? 'EPCI'
            : row.type
    }));

    // EPT
    const eptMap = {
        200057966: 'Vallée Sud Grand Paris - T2',
        200057974: 'Grand Paris Seine Ouest - T3',
        200057982: 'Paris Ouest La Défense - T4',
        200057990: 'Boucle Nord de Seine - T5',
        200057867: 'Plaine Commune - T6',
        200058097: "Paris Terres d'Envol - T7",
        200057875: 'Est Ensemble - T8',
        200058790: 'Grand Paris - Grand Est - T9',
        200057941: 'Paris-Est-Marne et Bois - T10',
        200058006: 'Grand Paris Sud Est Avenir - T11',
        200058014: 'Grand-Orly Seine Bièvre - T12'
    };
    data = data.map((row) => ({
        ...row,
        libelle: row.type === 'EPT' ? eptMap[row.siren] : row.libelle
    }));
    const eptClean = data.filter((row) => row.type === 'EPT');
    const communesEpt = leftMerge(eptClean, territoires, 'libelle', 'ept')
        .map((row) => row.code_geographique)
        .filter(Boolean);

    // Département
    const sirenCodeDptmt = sirenCode
        .filter((row) => row.type === 'département')
        .map((row) => ({ ...row, siren: String(row.siren) }));
    const departementClean = leftMerge(
        data.filter((row) => row.type === 'Département'),
        sirenCodeDptmt,
        'siren',
        'siren'
    );
    const communesDepartement = leftMerge(
        departementClean,
        territoires,
        'code_geographique',
        'departement'
    )
        .map((row) => row.code_geographique)
        .filter(Boolean);

    // EPCI
    const communesEpci = leftMerge(
        data.filter((row) => row.type === 'EPCI'),
        territoires,
        'siren',
        'epci'
    )
        .map((row) => row.code_geographique)
        .filter(Boolean);

    // PETR
    const communesPetr = leftMerge(
        data.filter((row) => row.type === 'PETR'),
        territoires,
        'siren',
        'epci'
    )
        .map((row) => row.code_geographique)
        .filter(Boolean);

    // PNR
    const communesPnr = leftMerge(
        data.filter((row) => row.type === 'PNR'),
        territoires,
        'siren',
        'code_pnr'
    )
        .map((row) => row.code_geographique)
        .filter(Boolean);

    // Communes
    const sirenCodeCommune = sirenCode
        .filter((row) => row.type === 'commune')
        .map((row) => ({ ...row, siren: String(row.siren) }));
    const communesClean = leftMerge(
        data.filter((row) => row.type === 'Commune'),
        sirenCodeCommune,
        'siren',
        'siren'
    );
    const communesCommune = leftMerge(
        communesClean,
        territoires,
        'code_geographique',
        'code_geographique'
    )
        .map((row) => row.code_geographique)
        .filter(Boolean);

    // Métropoles
    const dataMetropole = df.filter(
        (row) => row.siren && row.siren.length > 0 && row.type === 'Métropole'
    );
    const communesMetropole = leftMerge(
        dataMetropole,
        territoires,
        'siren',
        'epci'
    )
        .map((row) => row.code_geographique)
        .filter(Boolean);

    return {
        communesEpt,
        communesEpci,
        communesDepartement,
        communesPetr,
        communesPnr,
        communesCommune,
        communesMetropole
    };
}

function calculatePopulationCoverage(
    population,
    communesEpt,
    communesEpci,
    communesDepartement,
    communesPetr,
    communesPnr,
    communesCommune,
    communesMetropole
) {
    const toutesLesCommunes = [
        ...communesEpt,
        ...communesEpci,
        ...communesDepartement,
        ...communesPetr,
        ...communesPnr,
        ...communesCommune
    ];
    const uniqueCommunes = [...new Set(toutesLesCommunes)];
    const popTotaleCouverte = population
        .filter((row) => uniqueCommunes.includes(row.code_geographique))
        .reduce((sum, row) => sum + (row.population_2023 || 0), 0);

    console.log(
        'Population dans nos EPCI :',
        population
            .filter((row) => communesEpci.includes(row.code_geographique))
            .reduce((sum, row) => sum + (row.population_2023 || 0), 0)
    );
    console.log(
        'Population dans nos départements :',
        population
            .filter((row) =>
                communesDepartement.includes(row.code_geographique)
            )
            .reduce((sum, row) => sum + (row.population_2023 || 0), 0)
    );
    console.log(
        'Population dans nos communes :',
        population
            .filter((row) => communesCommune.includes(row.code_geographique))
            .reduce((sum, row) => sum + (row.population_2023 || 0), 0)
    );
    console.log(
        'Population dans nos PNR :',
        population
            .filter((row) => communesPnr.includes(row.code_geographique))
            .reduce((sum, row) => sum + (row.population_2023 || 0), 0)
    );
    console.log(
        'Population dans nos PETR :',
        population
            .filter((row) => communesPetr.includes(row.code_geographique))
            .reduce((sum, row) => sum + (row.population_2023 || 0), 0)
    );
    console.log(
        'Population dans nos EPT :',
        population
            .filter((row) => communesEpt.includes(row.code_geographique))
            .reduce((sum, row) => sum + (row.population_2023 || 0), 0)
    );
    console.log('------');
    console.log(
        'Population dans nos départements + EPCI :',
        population
            .filter((row) =>
                [...communesDepartement, ...communesEpci].includes(
                    row.code_geographique
                )
            )
            .reduce((sum, row) => sum + (row.population_2023 || 0), 0)
    );
    console.log(
        'Population dans nos métropoles :',
        population
            .filter((row) => communesMetropole.includes(row.code_geographique))
            .reduce((sum, row) => sum + (row.population_2023 || 0), 0)
    );
    console.log('------');
    console.log('Population totale couverte :', popTotaleCouverte);
    console.log(
        'Pourcentage de population couverte :',
        ((100 * popTotaleCouverte) / 67760573).toFixed(2) + '%'
    );

    return Math.floor(popTotaleCouverte);
}

async function insertPopulationCoverage(popTotaleCouverte) {
    const sql = `
    WITH last AS (
      SELECT population
      FROM couverture_population
      ORDER BY date DESC
      LIMIT 1
    )
    INSERT INTO couverture_population (population)
    SELECT $1
    WHERE NOT EXISTS (SELECT 1 FROM last WHERE population = $1)
    RETURNING id, date, population;
    `;

    const row = await withPg(async (client) => {
        await client.query("SET search_path = 'analytics'");
        const result = await client.query(sql, [popTotaleCouverte]);
        return result.rows[0];
    });

    if (!row) {
        console.log(
            'Aucune insertion : la valeur est identique à la dernière en base.'
        );
    } else {
        console.log(
            `Insertion OK → id=${row.id}, date=${row.date}, population=${row.population}`
        );
    }
}

// === Main ===
(async () => {
    console.log('[ETL Baserow Coverage] Début du processus');

    try {
        // Récupération des données Baserow
        console.log('[territoires] Récupération des données...');
        const baserowData = await fetchBaserow(BASEROW_TABLE_ID_TERRITOIRES);
        let df = baserowData.map((row) => ({
            libelle: row['⚠️ Nom du territoire'],
            type:
                Array.isArray(row['⚠️ Type de structure']) &&
                row['⚠️ Type de structure'].length > 0
                    ? row['⚠️ Type de structure'][0].value
                    : null,
            siren: row['⚠️ # SIREN']
        }));
        console.log(`[territoires] Données récupérées : ${df.length} lignes`);

        // Chargement des données externes
        console.log('[population] Chargement des données population...');
        const population = await loadPopulation();

        console.log('[territoires] Chargement de la table des territoires...');
        const territoires = await loadTerritoires();

        console.log(
            '[siren_code] Chargement de la correspondance SIREN/Code...'
        );
        const sirenCode = await loadSirenCode();

        // Traitement des territoires
        console.log('[traitement] Traitement des territoires...');
        const {
            communesEpt,
            communesEpci,
            communesDepartement,
            communesPetr,
            communesPnr,
            communesCommune,
            communesMetropole
        } = processTerritoires(df, territoires, sirenCode);

        // Calcul de la population couverte
        console.log('[calcul] Calcul de la population couverte...');
        const popTotaleCouverte = calculatePopulationCoverage(
            population,
            communesEpt,
            communesEpci,
            communesDepartement,
            communesPetr,
            communesPnr,
            communesCommune,
            communesMetropole
        );

        // Insertion en base
        console.log('[insertion] Insertion en base...');
        await insertPopulationCoverage(popTotaleCouverte);

        console.log('[ETL Baserow Coverage] Processus terminé avec succès');
    } catch (error) {
        console.error('[ETL Baserow Coverage] Erreur :', error);
        process.exit(1);
    }
})();
