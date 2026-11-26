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
    BASEROW_HOST,
    BASEROW_API_KEY,
    BASEROW_TABLE_ID_EVENEMENTS = '497107',
    BASEROW_TABLE_ID_TERRITOIRES = '497101'
} = process.env;

if (!SCALINGO_POSTGRESQL_URL) {
    console.error('SCALINGO_POSTGRESQL_URL manquante');
    process.exit(1);
}
if (!BASEROW_HOST || !BASEROW_API_KEY) {
    console.error('BASEROW_HOST / BASEROW_API_KEY manquants');
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

async function insertEvenements(client, rows) {
    const sql = `
    INSERT INTO analytics.baserow_evenements
      (ordre, nom, date, type, qui_anime_evenement, compte_rendu, nom_participants, nom_territoires, propos_nom_evenement, campagne_test_utilisateur, champs_rapporte, fichier)
    VALUES ($1, $2, $3, $4::jsonb, $5, $6, $7, $8, $9, $10::jsonb, $11, $12)
    ON CONFLICT (ordre) DO UPDATE SET
      nom = EXCLUDED.nom,
      date = EXCLUDED.date,
      type = EXCLUDED.type,
      qui_anime_evenement = EXCLUDED.qui_anime_evenement,
      compte_rendu = EXCLUDED.compte_rendu,
      nom_participants = EXCLUDED.nom_participants,
      nom_territoires = EXCLUDED.nom_territoires,
      propos_nom_evenement = EXCLUDED.propos_nom_evenement,
      campagne_test_utilisateur = EXCLUDED.campagne_test_utilisateur,
      champs_rapporte = EXCLUDED.champs_rapporte,
      fichier = EXCLUDED.fichier
  `;
    let inserted = 0;
    let updated = 0;
    for (const row of rows) {
        // Assuming row is an object from Baserow
        const ordre = row['order'] || null;
        const nom = row['Nom'] || null;
        const date = row['Dates'] || null;
        const type = safeParseJSON(row['Type']) || null;
        const qui_anime_evenement = Array.isArray(row["Qui anime l'évènement"])
            ? row["Qui anime l'évènement"]
            : row["Qui anime l'évènement"]
              ? [row["Qui anime l'évènement"]]
              : [];
        const compte_rendu = row["Compte rendu de l'évènement"] || null;
        const nom_participants = Array.isArray(row['Nom participant(s)'])
            ? row['Nom participant(s)']
            : row['Nom participant(s)']
              ? [row['Nom participant(s)']]
              : [];
        const nom_territoires = Array.isArray(row['Nom Territoire'])
            ? row['Nom Territoire']
            : row['Nom Territoire']
              ? [row['Nom Territoire']]
              : [];
        const propos_nom_evenement = Array.isArray(
            row['Propos - Nom évènement']
        )
            ? row['Propos - Nom évènement']
            : row['Propos - Nom évènement']
              ? [row['Propos - Nom évènement']]
              : [];
        const campagne_test_utilisateur =
            safeParseJSON(row['Campagne Tests Utilisateurs']) || null;
        const champs_rapporte = Array.isArray(row['Champ rapporté'])
            ? row['Champ rapporté']
            : row['Champ rapporté']
              ? [row['Champ rapporté']]
              : [];
        const fichier = Array.isArray(row['Fichier'])
            ? row['Fichier']
            : row['Fichier']
              ? [row['Fichier']]
              : [];

        const result = await client.query(sql, [
            ordre,
            nom,
            date,
            JSON.stringify(type),
            qui_anime_evenement,
            compte_rendu,
            nom_participants,
            nom_territoires,
            propos_nom_evenement,
            JSON.stringify(campagne_test_utilisateur),
            champs_rapporte,
            fichier
        ]);
        if (result.rowCount > 0) {
            if (result.command === 'INSERT') {
                inserted++;
            } else if (result.command === 'UPDATE') {
                updated++;
            }
        }
    }
    return { inserted, updated };
}

async function insertTerritoires(client, rows) {
    const sql = `
    INSERT INTO analytics.baserow_territoires
      (ordre, nom_territoire, notes_ouvertes, typologie_territoire, thematique_prioritaire, be, soumis_a_pcaet, demarches_et_programmes, documents_de_planification, avancee_sur_le_ddv, avancee_sur_la_strategie, suivi_evaluation, date_validation, date_revision_estimee, propos, attente_session_accueil, role_be, cdm, siren)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
    ON CONFLICT (ordre) DO UPDATE SET
      nom_territoire = EXCLUDED.nom_territoire,
      notes_ouvertes = EXCLUDED.notes_ouvertes,
      typologie_territoire = EXCLUDED.typologie_territoire,
      thematique_prioritaire = EXCLUDED.thematique_prioritaire,
      be = EXCLUDED.be,
      soumis_a_pcaet = EXCLUDED.soumis_a_pcaet,
      demarches_et_programmes = EXCLUDED.demarches_et_programmes,
      documents_de_planification = EXCLUDED.documents_de_planification,
      avancee_sur_le_ddv = EXCLUDED.avancee_sur_le_ddv,
      avancee_sur_la_strategie = EXCLUDED.avancee_sur_la_strategie,
      suivi_evaluation = EXCLUDED.suivi_evaluation,
      date_validation = EXCLUDED.date_validation,
      date_revision_estimee = EXCLUDED.date_revision_estimee,
      propos = EXCLUDED.propos,
      attente_session_accueil = EXCLUDED.attente_session_accueil,
      role_be = EXCLUDED.role_be,
      cdm = EXCLUDED.cdm,
      siren = EXCLUDED.siren
  `;
    let inserted = 0;
    let updated = 0;
    for (const row of rows) {
        // Assuming row is an object from Baserow
        const ordre = row['order'] || null;
        const nom_territoire = row['⚠️ Nom du territoire'] || null;
        const notes_ouvertes = row['Notes ouvertes'] || null;
        const typologie_territoire = Array.isArray(row['⚠️ Type de structure'])
            ? row['⚠️ Type de structure']
            : row['⚠️ Type de structure']
              ? [row['⚠️ Type de structure']]
              : [];
        const thematique_prioritaire = Array.isArray(
            row['Thématique prioritaire']
        )
            ? row['Thématique prioritaire']
            : row['Thématique prioritaire']
              ? [row['Thématique prioritaire']]
              : [];
        const be = row['BE ?'] === 'true' || row['BE ?'] === true || null;
        const soumis_a_pcaet =
            row['Soumis à PCAET'] === 'true' ||
            row['Soumis à PCAET'] === true ||
            null;
        const demarches_et_programmes = Array.isArray(
            row['Démarches & programmes']
        )
            ? row['Démarches & programmes']
            : row['Démarches & programmes']
              ? [row['Démarches & programmes']]
              : [];
        const documents_de_planification = Array.isArray(
            row['Documents de planifications']
        )
            ? row['Documents de planifications']
            : row['Documents de planifications']
              ? [row['Documents de planifications']]
              : [];
        const avancee_sur_le_ddv = Array.isArray(row['Avancée sur le DDV'])
            ? row['Avancée sur le DDV']
            : row['Avancée sur le DDV']
              ? [row['Avancée sur le DDV']]
              : [];
        const avancee_sur_la_strategie = Array.isArray(
            row['Avancée sur la stratégie']
        )
            ? row['Avancée sur la stratégie']
            : row['Avancée sur la stratégie']
              ? [row['Avancée sur la stratégie']]
              : [];
        const suivi_evaluation =
            row['Suivi - évaluation'] === 'true' ||
            row['Suivi - évaluation'] === true ||
            null;
        const date_validation = row['Date de validation'] || null;
        const date_revision_estimee = row['Date de révision estimée'] || null; // Assuming this maps to date_revision_estimee; 'Date de finalisation estimée' not in table
        const propos = Array.isArray(row['Propos'])
            ? row['Propos']
            : row['Propos']
              ? [row['Propos']]
              : [];
        const attente_session_accueil = Array.isArray(
            row["Attente communiquées lors de la session d'accueil"]
        )
            ? row["Attente communiquées lors de la session d'accueil"]
            : row["Attente communiquées lors de la session d'accueil"]
              ? [row["Attente communiquées lors de la session d'accueil"]]
              : [];
        const role_be = Array.isArray(row['Rôle du BE'])
            ? row['Rôle du BE']
            : row['Rôle du BE']
              ? [row['Rôle du BE']]
              : [];
        const cdm = Array.isArray(row['CdM'])
            ? row['CdM']
            : row['CdM']
              ? [row['CdM']]
              : [];
        const siren = row['⚠️ # SIREN'] || null;

        const result = await client.query(sql, [
            ordre,
            nom_territoire,
            notes_ouvertes,
            typologie_territoire,
            thematique_prioritaire,
            be,
            soumis_a_pcaet,
            demarches_et_programmes,
            documents_de_planification,
            avancee_sur_le_ddv,
            avancee_sur_la_strategie,
            suivi_evaluation,
            date_validation,
            date_revision_estimee,
            propos,
            attente_session_accueil,
            role_be,
            cdm,
            siren
        ]);
        if (result.rowCount > 0) {
            if (result.command === 'INSERT') {
                inserted++;
            } else if (result.command === 'UPDATE') {
                updated++;
            }
        }
    }
    return { inserted, updated };
}

// === fetch ===
async function fetchBaserow(tableId) {
    const baseUrl = `${BASEROW_HOST}/api/database/rows/table/${tableId}/?user_field_names=true`;
    let allResults = [];
    let nextUrl = baseUrl;

    while (nextUrl) {
        const resp = await fetch(nextUrl, {
            method: 'GET',
            headers: {
                Authorization: `Token ${BASEROW_API_KEY}`
            }
        });
        if (!resp.ok)
            throw new Error(`Baserow ${resp.status}: ${await resp.text()}`);
        const data = await resp.json();
        allResults = allResults.concat(data.results);
        nextUrl = data.next ? data.next.replace(/^http:/, 'https:') : null;
    }

    return allResults;
}

// === Main ===
(async () => {
    // Configuration des requêtes ETL avec leurs paramètres
    const etlQueries = [
        {
            name: 'evenements',
            tableId: BASEROW_TABLE_ID_EVENEMENTS,
            table: 'baserow_evenements',
            insertFunction: insertEvenements,
            description: 'Événements'
        },
        {
            name: 'territoires',
            tableId: BASEROW_TABLE_ID_TERRITOIRES,
            table: 'baserow_territoires',
            insertFunction: insertTerritoires,
            description: 'Territoires'
        }
    ];

    console.log(`[ETL] Début du processus avec ${etlQueries.length} requêtes`);

    for (const queryConfig of etlQueries) {
        console.log(
            `\n[ETL] Traitement de ${queryConfig.name} (${queryConfig.description})...`
        );

        try {
            const results = await fetchBaserow(queryConfig.tableId);
            console.log(
                `[${queryConfig.name}] Données récupérées : ${results.length} lignes`
            );

            // Insérer en base
            const result = await withPg(async (client) =>
                queryConfig.insertFunction(client, results)
            );

            console.log(
                `[${queryConfig.name}] Terminé : ${result.inserted} inséré(s), ${result.updated} mis à jour(s).`
            );
        } catch (error) {
            console.error(`[${queryConfig.name}] Erreur :`, error);
            // On continue avec les autres requêtes même si une échoue
        }
    }

    console.log('\n[ETL] Processus terminé pour toutes les requêtes.');
})().catch((e) => {
    console.error('[ETL] Erreur fatale :', e);
    process.exit(1);
});
