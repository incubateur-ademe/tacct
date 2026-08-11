// Backfill du chiffrement de tacct."user" sur la base de PREP (jetable).
// Mêmes règles que le backfill réel, mais pointe le Postgres local du compose
// et utilise une clé JETABLE par défaut (le but est de valider le pipeline).
//
//   node backfill-user-crypto.mjs            # DRY-RUN (compte, n'écrit rien)
//   node backfill-user-crypto.mjs --apply    # applique
//
// Surcharge possible : PREP_DATABASE_URL, USER_ENCRYPTION_KEY.

import {
  createCipheriv,
  createHmac,
  hkdfSync,
  randomBytes,
} from 'node:crypto';
import { Pool } from 'pg';

const PREP_DATABASE_URL =
  process.env.PREP_DATABASE_URL ??
  'postgres://postgres:prep@localhost:55432/tacct_prep';

// Clé JETABLE pour le prep (32 octets). Surchargeable par USER_ENCRYPTION_KEY.
const usingDefaultKey = !process.env.USER_ENCRYPTION_KEY;
const RAW_KEY =
  process.env.USER_ENCRYPTION_KEY ??
  Buffer.from('prep-only-throwaway-key-32bytes!').toString('base64');

// --- Crypto (copie canonique de src/lib/crypto/user-crypto.ts) ---------------
const ENC_PREFIX = 'enc:v1:';
const HKDF_SALT = Buffer.from('tacct-user-crypto');
const IV_LENGTH = 12;

function deriveKeys(rawBase64) {
  const ikm = Buffer.from(rawBase64, 'base64');
  return {
    enc: Buffer.from(hkdfSync('sha256', ikm, HKDF_SALT, 'tacct-user-enc', 32)),
    hmac: Buffer.from(hkdfSync('sha256', ikm, HKDF_SALT, 'tacct-user-bidx', 32)),
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

// Self-check : verrouille l'algo sur le vecteur d'interop figé.
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

async function main() {
  const apply = process.argv.includes('--apply');
  assertCryptoInterop();
  const keys = deriveKeys(RAW_KEY);

  if (usingDefaultKey) {
    console.warn('[backfill] clé JETABLE par défaut (prep). Override: USER_ENCRYPTION_KEY');
  }
  console.log(`[backfill] mode=${apply ? 'APPLY' : 'DRY-RUN'}`);

  const pool = new Pool({ connectionString: PREP_DATABASE_URL });
  const client = await pool.connect();

  let encrypted = 0;
  let skipped = 0;
  try {
    const { rows } = await client.query(
      `SELECT id, email, username, firstname, lastname, authenticated_id
         FROM tacct."user"
        WHERE encryption_version = 0`,
    );
    console.log(`[backfill] lignes à traiter (version 0) : ${rows.length}`);

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
            row.id,
          ],
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

  const verb = apply ? 'chiffrées' : 'à chiffrer';
  console.log(`[backfill] ${verb} : ${encrypted} | ignorées : ${skipped}`);
  if (!apply) console.log('[backfill] DRY-RUN : relancer avec --apply pour appliquer.');
}

main().catch((err) => {
  console.error('[backfill] échec :', err);
  process.exit(1);
});
