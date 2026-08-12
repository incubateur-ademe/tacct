// Usage : node scripts/detail-etude.mjs <studyId> [--schema tacct] [--long]
//
// Lecture seule. Sort les valeurs reelles des champs que l'utilisateur remplit :
// notation et justification de chaque exposition, exposition future, sensibilite
// de chaque impact. Termine par un taux de remplissage par colonne.
// --long affiche les textes en entier au lieu d'un extrait.

import 'dotenv/config';
import { existsSync, readFileSync } from 'node:fs';
import { Pool } from 'pg';

const argv = process.argv;
const opt = (nom, def) => {
    const i = argv.indexOf(nom);
    return i === -1 ? def : argv[i + 1];
};

const studyId = argv[2];
const schema = opt('--schema', 'tacct');
const LONG = argv.includes('--long');

if (!studyId) {
    console.error('Usage : node scripts/detail-etude.mjs <studyId> [--schema tacct] [--long]');
    process.exit(1);
}
if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(schema)) {
    console.error(`Nom de schema invalide : ${schema}`);
    process.exit(1);
}
if (!process.env.SCALINGO_POSTGRESQL_URL) {
    console.error('SCALINGO_POSTGRESQL_URL manquant.');
    process.exit(1);
}

const ssl = existsSync('ca.pem')
    ? { ca: readFileSync('ca.pem', 'utf8'), rejectUnauthorized: false }
    : true;
const pool = new Pool({
    connectionString: process.env.SCALINGO_POSTGRESQL_URL.split('?')[0],
    ssl
});

const q = (t) => `${schema}."${t}"`;
const vide = (v) => v === null || v === undefined || String(v).trim() === '';
const extrait = (v) => {
    if (vide(v)) return '(vide)';
    const s = String(v).replace(/\s+/g, ' ').trim();
    return LONG || s.length <= 80 ? s : `${s.slice(0, 80)}… [${s.length} car.]`;
};

try {
    const { rows: studies } = await pool.query(
        `SELECT id, territory_name, year, commune_id, observed_exposure_valid,
                sensibility_valid, exposition_future_valid, strategy_construction_valid, updated_at
         FROM ${q('study')} WHERE id = $1`,
        [studyId]
    );
    if (!studies.length) throw new Error(`Etude introuvable dans ${schema} : ${studyId}`);
    const s = studies[0];
    console.log(
        `${schema}.${s.id}  «${s.territory_name}» ${Number(s.year)} (commune ${s.commune_id})`
    );
    console.log(
        `  observed_exposure_valid=${s.observed_exposure_valid}  sensibility_valid=${s.sensibility_valid}` +
            `  exposition_future_valid=${s.exposition_future_valid}  strategy=${s.strategy_construction_valid}\n`
    );

    const { rows: expos } = await pool.query(
        `SELECT o.id, o.exposure, o.justification, o.trends, o.sources, o.climate_features,
                o.climate_hazard_custom, ch.name AS alea,
                f.exposure AS futur_exposure, f.trends AS futur_trends,
                f.justification AS futur_justification
         FROM ${q('observed_exposure')} o
         LEFT JOIN ${q('climate_hazard')} ch ON ch.id = o.climate_hazard_id
         LEFT JOIN ${q('future_exposure')} f ON f.observed_exposure_id = o.id
         WHERE o.study_id = $1
         ORDER BY ch.name NULLS LAST, o.created_at`,
        [studyId]
    );

    console.log(`=== EXPOSITIONS (${expos.length}) ===`);
    for (const e of expos) {
        console.log(`\n• ${e.alea ?? e.climate_hazard_custom ?? '(aléa inconnu)'}`);
        console.log(`  notation actuelle : ${vide(e.exposure) ? '(vide)' : Number(e.exposure)}`);
        console.log(`  justification     : ${extrait(e.justification)}`);
        console.log(`  tendances         : ${extrait(e.trends)}`);
        console.log(`  sources           : ${extrait(e.sources)}`);
        console.log(`  caract. clim.     : ${extrait(e.climate_features)}`);
        console.log(
            `  exposition future : ${vide(e.futur_exposure) ? '(vide)' : Number(e.futur_exposure)}` +
                `  tendance=${e.futur_trends ?? '(vide)'}  justif=${extrait(e.futur_justification)}`
        );
    }

    const { rows: impacts } = await pool.query(
        `SELECT i.id, i.description, i.sensitivity, i.justification, i.observed_impact,
                i.action_plan, i.revoked_diagnostic, t.name AS theme
         FROM ${q('impact')} i
         JOIN ${q('impact_theme')} t ON t.id = i.impact_theme_id
         WHERE t.study_id = $1
         ORDER BY t.name NULLS LAST, i.created_at`,
        [studyId]
    );

    console.log(`\n\n=== IMPACTS / SENSIBILITE (${impacts.length}) ===`);
    for (const i of impacts) {
        console.log(`\n• ${extrait(i.description)}`);
        console.log(`  sensibilite     : ${vide(i.sensitivity) ? '(vide)' : Number(i.sensitivity)}`);
        console.log(`  justification   : ${extrait(i.justification)}`);
        console.log(`  impact observe  : ${extrait(i.observed_impact)}`);
        console.log(`  plan d'action   : ${extrait(i.action_plan)}`);
        if (i.revoked_diagnostic) console.log('  (diagnostic revoque)');
    }

    const taux = (rows, col) => {
        const n = rows.filter((r) => !vide(r[col])).length;
        return `${n}/${rows.length}`;
    };

    console.log('\n\n=== TAUX DE REMPLISSAGE ===');
    console.table([
        { champ: 'observed_exposure.exposure', rempli: taux(expos, 'exposure') },
        { champ: 'observed_exposure.justification', rempli: taux(expos, 'justification') },
        { champ: 'observed_exposure.trends', rempli: taux(expos, 'trends') },
        { champ: 'observed_exposure.sources', rempli: taux(expos, 'sources') },
        { champ: 'observed_exposure.climate_features', rempli: taux(expos, 'climate_features') },
        { champ: 'future_exposure.exposure', rempli: taux(expos, 'futur_exposure') },
        { champ: 'impact.sensitivity', rempli: taux(impacts, 'sensitivity') },
        { champ: 'impact.justification', rempli: taux(impacts, 'justification') },
        { champ: 'impact.observed_impact', rempli: taux(impacts, 'observed_impact') }
    ]);
} catch (err) {
    console.error('Erreur :', err.message);
    process.exitCode = 1;
} finally {
    await pool.end();
}
