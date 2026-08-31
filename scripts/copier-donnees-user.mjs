// Usage : node scripts/copier-donnees-user.mjs <emailSource> <emailCible> [--apply]
// Duplique toutes les donnees rattachees a l'utilisateur source vers l'utilisateur cible.
// La source n'est jamais modifiee. Sans --apply, la transaction est annulee (dry-run).

import 'dotenv/config';
import { createHmac, hkdfSync, randomUUID } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { Pool } from 'pg';

const sourceEmail = process.argv[2];
const targetEmail = process.argv[3];
const APPLY = process.argv.includes('--apply');

if (!sourceEmail || !targetEmail) {
    console.error(
        'Usage : node scripts/copier-donnees-user.mjs <emailSource> <emailCible> [--apply]'
    );
    process.exit(1);
}
if (!process.env.USER_ENCRYPTION_KEY || !process.env.SCALINGO_POSTGRESQL_URL) {
    console.error('USER_ENCRYPTION_KEY ou SCALINGO_POSTGRESQL_URL manquant.');
    process.exit(1);
}

const ikm = Buffer.from(process.env.USER_ENCRYPTION_KEY, 'base64');
const salt = Buffer.from('tacct-user-crypto');
const hmacKey = Buffer.from(hkdfSync('sha256', ikm, salt, 'tacct-user-bidx', 32));
const bidx = (v) => createHmac('sha256', hmacKey).update(v).digest('base64');

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

async function findUser(email) {
    const { rows } = await client.query(
        `SELECT id, commune_id, study_office_id FROM ${q('user')} WHERE email_bidx = $1`,
        [bidx(email)]
    );
    return rows[0] ?? null;
}

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

    maps.impact_level = prepIdMap(levels);
    maps.study = prepIdMap(study);
    maps.impact_theme = prepIdMap(themes);
    maps.observed_exposure = prepIdMap(oes);
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

    const newStudyId = maps.study.get(studyId);
    await client.query(
        `INSERT INTO ${q('user_study')} (id, user_id, study_id, head_study, created_at, updated_at)
         VALUES ($1, $2, $3, $4, now(), now())`,
        [randomUUID(), targetUserId, newStudyId, headStudy]
    );
    total.user_study = (total.user_study || 0) + 1;

    return newStudyId;
}

try {
    const src = await findUser(sourceEmail);
    const tgt = await findUser(targetEmail);
    if (!src) throw new Error(`Source introuvable : ${sourceEmail}`);
    if (!tgt) throw new Error(`Cible introuvable : ${targetEmail}`);
    if (src.id === tgt.id) throw new Error('Source et cible sont le meme utilisateur.');

    const links = (
        await client.query(
            `SELECT study_id, head_study FROM ${q('user_study')} WHERE user_id = $1 AND study_id IS NOT NULL`,
            [src.id]
        )
    ).rows;

    console.log(`Source : ${src.id}  (${links.length} study liee(s))`);
    console.log(`Cible  : ${tgt.id}`);

    await client.query('BEGIN');

    await client.query(
        `UPDATE ${q('user')} SET commune_id = $1, study_office_id = $2, validated = true, updated_at = now() WHERE id = $3`,
        [src.commune_id, src.study_office_id, tgt.id]
    );

    for (const l of links) {
        const newStudyId = await copyStudy(l.study_id, tgt.id, l.head_study);
        console.log(`  study ${l.study_id} -> ${newStudyId}`);
    }

    if (APPLY) {
        await client.query('COMMIT');
        console.log('\n=== COMMIT (donnees ecrites) ===');
    } else {
        await client.query('ROLLBACK');
        console.log('\n=== DRY-RUN (rollback, rien ecrit) — relance avec --apply ===');
    }
    console.log('Lignes copiees par table :', total);
} catch (err) {
    await client.query('ROLLBACK').catch(() => {});
    console.error('Erreur, transaction annulee :', err.message);
    process.exitCode = 1;
} finally {
    client.release();
    await pool.end();
}
