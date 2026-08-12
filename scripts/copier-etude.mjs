// Usage : node scripts/copier-etude.mjs <studyId> <emailCible> [--head] [--apply]
//
// Duplique UNE etude et toute son arborescence, puis rattache la copie au compte
// cible. Les etudes deja rattachees a la cible ne sont pas touchees : on ajoute.
// L'etude source et son proprietaire ne sont jamais modifies.
// Le compte cible n'est pas modifie non plus (ni commune_id, ni study_office_id,
// ni validated) — seul un lien user_study est cree.
//
//   --head   marque la copie comme head_study (defaut : false)
//   --apply  commit ; sans ce flag la transaction est annulee (dry-run)
//
// Tables copiees (15) : study, impact_theme, observed_exposure, future_exposure,
// observed_exposure_impact, natural_disaster_search, natural_disaster_search_commune,
// impact_level, impact_strategy, impact, impact_climate_hazard, impact_competence,
// impact_review_criteria, impact_action, impact_action_review, impact_trajectory,
// impact_trajectory_impact_action (+ user_study).
// Les referentiels partages (thematic, climate_hazard, skill_territory, commune)
// sont references, pas dupliques.

import 'dotenv/config';
import { createDecipheriv, createHmac, hkdfSync, randomUUID } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { Pool } from 'pg';

const studyId = process.argv[2];
const targetEmail = process.argv[3];
const APPLY = process.argv.includes('--apply');
const HEAD = process.argv.includes('--head');

if (!studyId || !targetEmail) {
    console.error(
        'Usage : node scripts/copier-etude.mjs <studyId> <emailCible> [--head] [--apply]'
    );
    process.exit(1);
}
if (!process.env.USER_ENCRYPTION_KEY || !process.env.SCALINGO_POSTGRESQL_URL) {
    console.error('USER_ENCRYPTION_KEY ou SCALINGO_POSTGRESQL_URL manquant.');
    process.exit(1);
}

const ikm = Buffer.from(process.env.USER_ENCRYPTION_KEY, 'base64');
const salt = Buffer.from('tacct-user-crypto');
const encKey = Buffer.from(hkdfSync('sha256', ikm, salt, 'tacct-user-enc', 32));
const hmacKey = Buffer.from(hkdfSync('sha256', ikm, salt, 'tacct-user-bidx', 32));
const bidx = (v) => createHmac('sha256', hmacKey).update(v).digest('base64');

const decrypt = (v) => {
    if (typeof v !== 'string' || !v.startsWith('enc:v1:')) return v;
    const b = Buffer.from(v.slice(7), 'base64');
    const d = createDecipheriv('aes-256-gcm', encKey, b.subarray(0, 12));
    d.setAuthTag(b.subarray(12, 28));
    return Buffer.concat([d.update(b.subarray(28)), d.final()]).toString('utf8');
};

const ssl = existsSync('ca.pem')
    ? { ca: readFileSync('ca.pem', 'utf8'), rejectUnauthorized: false }
    : true;
const pool = new Pool({
    connectionString: process.env.SCALINGO_POSTGRESQL_URL.split('?')[0],
    ssl
});

const q = (t) => `tacct."${t}"`;
const total = {};

const client = await pool.connect();

function prepIdMap(rows) {
    const m = new Map();
    for (const r of rows) m.set(r.id, randomUUID());
    return m;
}

async function copyStudy(studyId, targetUserId, headStudy) {
    const maps = {};

    const fetchBy = async (table, where, params) =>
        (await client.query(`SELECT * FROM ${q(table)} WHERE ${where}`, params)).rows;
    const anyText = '= ANY($1::text[])';

    const study = await fetchBy('study', 'id = $1', [studyId]);
    const themes = await fetchBy('impact_theme', 'study_id = $1', [studyId]);
    const themeIds = themes.map((r) => r.id);
    const oes = await fetchBy('observed_exposure', 'study_id = $1', [studyId]);
    const oeIds = oes.map((r) => r.id);
    const nds = await fetchBy('natural_disaster_search', 'study_id = $1', [studyId]);
    const ndsIds = nds.map((r) => r.id);

    const impacts = themeIds.length
        ? await fetchBy('impact', `impact_theme_id ${anyText}`, [themeIds])
        : [];
    const impactIds = impacts.map((r) => r.id);
    const strategies = themeIds.length
        ? await fetchBy('impact_strategy', `impact_theme_id ${anyText}`, [themeIds])
        : [];
    const strategyIds = strategies.map((r) => r.id);

    const levelIds = [
        ...new Set(
            [
                ...impacts.map((r) => r.impact_level_id),
                ...strategies.map((r) => r.impact_level_id)
            ].filter(Boolean)
        )
    ];
    const levels = levelIds.length
        ? await fetchBy('impact_level', `id ${anyText}`, [levelIds])
        : [];

    const orImpactStrategy = `impact_id = ANY($1::text[]) OR impact_strategy_id = ANY($2::text[])`;
    const hazards = impactIds.length
        ? await fetchBy('impact_climate_hazard', `impact_id ${anyText}`, [impactIds])
        : [];
    const competences = impactIds.length
        ? await fetchBy('impact_competence', `impact_id ${anyText}`, [impactIds])
        : [];
    const criteria =
        impactIds.length || strategyIds.length
            ? await client
                  .query(
                      `SELECT * FROM ${q('impact_review_criteria')} WHERE ${orImpactStrategy}`,
                      [impactIds, strategyIds]
                  )
                  .then((r) => r.rows)
            : [];
    const actions =
        impactIds.length || strategyIds.length
            ? await client
                  .query(`SELECT * FROM ${q('impact_action')} WHERE ${orImpactStrategy}`, [
                      impactIds,
                      strategyIds
                  ])
                  .then((r) => r.rows)
            : [];
    const actionIds = actions.map((r) => r.id);
    const actionReviews = actionIds.length
        ? await fetchBy('impact_action_review', `impact_action_id ${anyText}`, [actionIds])
        : [];
    const trajectories =
        impactIds.length || strategyIds.length
            ? await client
                  .query(`SELECT * FROM ${q('impact_trajectory')} WHERE ${orImpactStrategy}`, [
                      impactIds,
                      strategyIds
                  ])
                  .then((r) => r.rows)
            : [];
    const trajIds = trajectories.map((r) => r.id);
    const trajActions = trajIds.length
        ? await fetchBy('impact_trajectory_impact_action', `trajectory_id ${anyText}`, [trajIds])
        : [];
    const oeImpacts = oeIds.length
        ? await fetchBy('observed_exposure_impact', `observed_exposure_id ${anyText}`, [oeIds])
        : [];
    const futureExp = oeIds.length
        ? await fetchBy('future_exposure', `observed_exposure_id ${anyText}`, [oeIds])
        : [];
    const ndsCommunes = ndsIds.length
        ? await fetchBy('natural_disaster_search_commune', `natural_disaster_search_id ${anyText}`, [
              ndsIds
          ])
        : [];

    maps.impact_level = prepIdMap(levels);
    maps.study = prepIdMap(study);
    maps.impact_theme = prepIdMap(themes);
    maps.observed_exposure = prepIdMap(oes);
    maps.natural_disaster_search = prepIdMap(nds);
    maps.impact_strategy = prepIdMap(strategies);
    maps.impact = prepIdMap(impacts);
    maps.impact_action = prepIdMap(actions);
    maps.impact_trajectory = prepIdMap(trajectories);

    async function ins(table, rows, { hasId = true, fkRemap = {}, idMap } = {}) {
        for (const row of rows) {
            const cols = Object.keys(row);
            const vals = cols.map((c) => {
                if (hasId && c === 'id') return idMap.get(row.id);
                if (fkRemap[c]) {
                    const o = row[c];
                    return o == null ? null : maps[fkRemap[c]].get(o) ?? o;
                }
                return row[c];
            });
            const colSql = cols.map((c) => `"${c}"`).join(',');
            const ph = cols.map((_, i) => `$${i + 1}`).join(',');
            await client.query(`INSERT INTO ${q(table)} (${colSql}) VALUES (${ph})`, vals);
            total[table] = (total[table] || 0) + 1;
        }
    }

    await ins('impact_level', levels, { idMap: maps.impact_level });
    await ins('study', study, { idMap: maps.study });
    await ins('impact_theme', themes, {
        idMap: maps.impact_theme,
        fkRemap: { study_id: 'study' }
    });
    await ins('observed_exposure', oes, {
        idMap: maps.observed_exposure,
        fkRemap: { study_id: 'study' }
    });
    await ins('natural_disaster_search', nds, {
        idMap: maps.natural_disaster_search,
        fkRemap: { study_id: 'study' }
    });
    await ins('impact_strategy', strategies, {
        idMap: maps.impact_strategy,
        fkRemap: { impact_theme_id: 'impact_theme', impact_level_id: 'impact_level' }
    });
    await ins('impact', impacts, {
        idMap: maps.impact,
        fkRemap: {
            impact_theme_id: 'impact_theme',
            primary_exposure_id: 'observed_exposure',
            impact_level_id: 'impact_level'
        }
    });
    await ins('future_exposure', futureExp, {
        idMap: prepIdMap(futureExp),
        fkRemap: { observed_exposure_id: 'observed_exposure' }
    });
    await ins('observed_exposure_impact', oeImpacts, {
        hasId: false,
        fkRemap: { impact_id: 'impact', observed_exposure_id: 'observed_exposure' }
    });
    await ins('impact_climate_hazard', hazards, {
        idMap: prepIdMap(hazards),
        fkRemap: { impact_id: 'impact' }
    });
    await ins('impact_competence', competences, {
        idMap: prepIdMap(competences),
        fkRemap: { impact_id: 'impact' }
    });
    await ins('impact_review_criteria', criteria, {
        idMap: prepIdMap(criteria),
        fkRemap: { impact_id: 'impact', impact_strategy_id: 'impact_strategy' }
    });
    await ins('impact_action', actions, {
        idMap: maps.impact_action,
        fkRemap: { impact_id: 'impact', impact_strategy_id: 'impact_strategy' }
    });
    await ins('impact_action_review', actionReviews, {
        idMap: prepIdMap(actionReviews),
        fkRemap: { impact_action_id: 'impact_action' }
    });
    await ins('impact_trajectory', trajectories, {
        idMap: maps.impact_trajectory,
        fkRemap: { impact_id: 'impact', impact_strategy_id: 'impact_strategy' }
    });
    await ins('impact_trajectory_impact_action', trajActions, {
        idMap: prepIdMap(trajActions),
        fkRemap: { trajectory_id: 'impact_trajectory', action_id: 'impact_action' }
    });
    await ins('natural_disaster_search_commune', ndsCommunes, {
        hasId: false,
        fkRemap: { natural_disaster_search_id: 'natural_disaster_search' }
    });

    const newStudyId = maps.study.get(studyId);
    await client.query(
        `INSERT INTO ${q('user_study')} (id, user_id, study_id, head_study, created_at, updated_at)
         VALUES ($1, $2, $3, $4, now(), now())`,
        [randomUUID(), targetUserId, newStudyId, headStudy]
    );
    total.user_study = (total.user_study || 0) + 1;

    return newStudyId;
}

async function etudesDe(userId) {
    return (
        await client.query(
            `SELECT s.id, s.territory_name, s.year, us.head_study
             FROM ${q('user_study')} us
             JOIN ${q('study')} s ON s.id = us.study_id
             WHERE us.user_id = $1
             ORDER BY s.created_at`,
            [userId]
        )
    ).rows.map((r) => ({ ...r, year: Number(r.year) }));
}

try {
    const { rows: studies } = await client.query(
        `SELECT id, territory_name, year, commune_id FROM ${q('study')} WHERE id = $1`,
        [studyId]
    );
    if (!studies.length) throw new Error(`Etude introuvable : ${studyId}`);
    const study = studies[0];

    const { rows: tgts } = await client.query(
        `SELECT id, email FROM ${q('user')} WHERE email_bidx = $1`,
        [bidx(targetEmail)]
    );
    if (!tgts.length) throw new Error(`Cible introuvable : ${targetEmail}`);
    const tgt = tgts[0];

    // Proprietaires actuels de l'etude, pour verifier qu'on copie bien la bonne.
    const { rows: owners } = await client.query(
        `SELECT u.id, u.email FROM ${q('user_study')} us
         JOIN ${q('user')} u ON u.id = us.user_id
         WHERE us.study_id = $1`,
        [studyId]
    );

    if (owners.some((o) => o.id === tgt.id))
        throw new Error(
            'La cible est deja rattachee a cette etude — copier la dupliquerait pour elle.'
        );

    console.log(
        `Etude source : ${study.id}  «${study.territory_name}» ${Number(study.year)} (commune ${study.commune_id})`
    );
    console.log(
        `Proprietaire(s) : ${owners.map((o) => decrypt(o.email)).join(', ') || 'aucun'}`
    );
    console.log(`Cible : ${decrypt(tgt.email)}  (${tgt.id})`);
    console.log(`head_study de la copie : ${HEAD}`);

    const avant = await etudesDe(tgt.id);
    console.log(`\nEtudes de la cible AVANT (${avant.length}) :`);
    for (const e of avant) console.log(' ', e);

    await client.query('BEGIN');

    const newStudyId = await copyStudy(studyId, tgt.id, HEAD);
    console.log(`\nCopie : ${studyId} -> ${newStudyId}`);

    const apres = await etudesDe(tgt.id);
    console.log(`\nEtudes de la cible APRES (${apres.length}) :`);
    for (const e of apres) console.log(' ', e);

    console.log('\nLignes copiees par table :', total);

    if (APPLY) {
        await client.query('COMMIT');
        console.log('\n=== COMMIT (donnees ecrites) ===');
    } else {
        await client.query('ROLLBACK');
        console.log('\n=== DRY-RUN (rollback, rien ecrit) — relance avec --apply ===');
    }
} catch (err) {
    await client.query('ROLLBACK').catch(() => {});
    console.error('Erreur, transaction annulee :', err.message);
    process.exitCode = 1;
} finally {
    client.release();
    await pool.end();
}
