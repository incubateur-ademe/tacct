/**
 * Étape B3 — Chiffre `tacct."user"` sur la base de PRÉPARATION.
 *
 *   node backfill-user-crypto.mjs                 # DRY-RUN, n'écrit rien
 *   node backfill-user-crypto.mjs --apply         # applique
 *
 * Variables d'environnement :
 *   PREP_DATABASE_URL    cible (défaut : Postgres du docker-compose local)
 *   USER_ENCRYPTION_KEY  OBLIGATOIRE — doit être la clé de PRODUCTION
 *
 * Différence avec scripts/legacy-dump-to-postgres/backfill-user-crypto.mjs :
 * ce script REFUSE de démarrer sans clé explicite. La variante « prep » se
 * rabat sur une clé jetable, ce qui est exactement ce qu'il ne faut pas ici —
 * le chiffré produit doit être déchiffrable par l'application en production.
 */

import 'dotenv/config';
import { createCipheriv, createHmac, hkdfSync, randomBytes } from 'node:crypto';
import { Pool } from 'pg';

const PREP_DATABASE_URL =
  process.env.PREP_DATABASE_URL ??
  'postgres://postgres:prep@localhost:55432/tacct_prep';

const RAW_KEY = process.env.USER_ENCRYPTION_KEY;
if (!RAW_KEY) {
  console.error(
    'USER_ENCRYPTION_KEY manquant.\n' +
      'Ce backfill doit utiliser la clé de PRODUCTION, sans quoi l’application\n' +
      'ne pourra pas déchiffrer les comptes après la bascule.'
  );
  process.exit(1);
}

// --- Crypto : copie canonique de src/lib/crypto/user-crypto.ts --------------

const ENC_PREFIX = 'enc:v1:';
const HKDF_SALT = Buffer.from('tacct-user-crypto');
const IV_LENGTH = 12;

function deriveKeys(rawBase64) {
  const ikm = Buffer.from(rawBase64, 'base64');
  return {
    enc: Buffer.from(hkdfSync('sha256', ikm, HKDF_SALT, 'tacct-user-enc', 32)),
    hmac: Buffer.from(hkdfSync('sha256', ikm, HKDF_SALT, 'tacct-user-bidx', 32))
  };
}

function encryptField(keys, plaintext) {
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv('aes-256-gcm', keys.enc, iv);
  const ct = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return ENC_PREFIX + Buffer.concat([iv, tag, ct]).toString('base64');
}

function blindIndex(keys, value) {
  return createHmac('sha256', keys.hmac).update(value).digest('base64');
}

/** Verrouille l'algo sur le vecteur d'interop figé (même que la variante prep). */
function assertCryptoInterop() {
  const TEST = deriveKeys('AQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQE=');
  const expected = 'j+1LEjatCCf1WdA/faPk5Q5dVDtOmSkT+Q909kiyt7Q=';
  if (blindIndex(TEST, 'sub-test-vector') !== expected) {
    throw new Error('Self-check crypto KO : algorithme divergent, arrêt.');
  }
}

const isEncrypted = (v) => typeof v === 'string' && v.startsWith(ENC_PREFIX);
const encNullable = (keys, v) => (v == null ? null : encryptField(keys, v));
const bidxNullable = (keys, v) => (v == null ? null : blindIndex(keys, v));

// --- Programme -------------------------------------------------------------

async function main() {
  const apply = process.argv.includes('--apply');
  assertCryptoInterop();
  const keys = deriveKeys(RAW_KEY);

  console.log(`[backfill] cible = ${PREP_DATABASE_URL.replace(/:[^:@/]*@/, ':***@')}`);
  console.log(`[backfill] mode  = ${apply ? 'APPLY' : 'DRY-RUN'}`);

  const pool = new Pool({ connectionString: PREP_DATABASE_URL });
  const client = await pool.connect();

  let encrypted = 0;
  let skipped = 0;
  const collisions = new Map();

  try {
    const { rows } = await client.query(
      `SELECT id, email, username, firstname, lastname, authenticated_id
         FROM tacct."user"
        WHERE encryption_version = 0`
    );
    console.log(`[backfill] lignes à traiter (version 0) : ${rows.length}`);

    // Détection préalable des doublons d'index aveugle : l'unicité posée en
    // 02 échouerait sinon, après avoir déjà tout chiffré.
    for (const row of rows) {
      if (row.email == null) continue;
      const bidx = blindIndex(keys, row.email);
      collisions.set(bidx, (collisions.get(bidx) ?? 0) + 1);
    }
    const doublons = [...collisions.values()].filter((n) => n > 1).length;
    if (doublons > 0) {
      console.error(
        `[backfill] ${doublons} adresse(s) en double dans le dump : ` +
          'l’index unique de 02-unicite-bidx.sql échouera. Arbitrer avant de continuer.'
      );
      if (apply) throw new Error('Doublons d’e-mail, arrêt avant écriture.');
    }

    for (const row of rows) {
      if (isEncrypted(row.email) || isEncrypted(row.authenticated_id)) {
        skipped++;
        console.warn(`[backfill] SKIP ${row.id} : déjà chiffré (version 0 incohérente)`);
        continue;
      }
      if (!apply) {
        encrypted++;
        continue;
      }
      await client.query('BEGIN');
      try {
        await client.query(
          `UPDATE tacct."user"
              SET email = $1, username = $2, firstname = $3, lastname = $4,
                  authenticated_id = $5, email_bidx = $6,
                  authenticated_id_bidx = $7, encryption_version = 1
            WHERE id = $8 AND encryption_version = 0`,
          [
            encryptField(keys, row.email),
            encryptField(keys, row.username),
            encryptField(keys, row.firstname),
            encryptField(keys, row.lastname),
            encNullable(keys, row.authenticated_id),
            blindIndex(keys, row.email),
            bidxNullable(keys, row.authenticated_id),
            row.id
          ]
        );
        await client.query('COMMIT');
        encrypted++;
      } catch (err) {
        await client.query('ROLLBACK');
        throw err;
      }
    }
  } finally {
    client.release();
    await pool.end();
  }

  const verbe = apply ? 'chiffrées' : 'à chiffrer';
  console.log(`[backfill] ${verbe} : ${encrypted} | ignorées : ${skipped}`);
  if (!apply) console.log('[backfill] DRY-RUN : relancer avec --apply pour appliquer.');
}

main().catch((err) => {
  console.error('[backfill] échec :', err);
  process.exit(1);
});
