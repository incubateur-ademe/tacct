import 'server-only';
import {
  createCipheriv,
  createDecipheriv,
  createHmac,
  hkdfSync,
  randomBytes,
} from 'node:crypto';

const ENC_PREFIX = 'enc:v1:';
const HKDF_SALT = Buffer.from('tacct-user-crypto');
const IV_LENGTH = 12;
const TAG_LENGTH = 16;

let derived: { enc: Buffer; hmac: Buffer } | null = null;

function keys(): { enc: Buffer; hmac: Buffer } {
  if (derived) return derived;
  const raw = process.env.USER_ENCRYPTION_KEY;
  if (!raw) throw new Error('USER_ENCRYPTION_KEY manquant');
  const ikm = Buffer.from(raw, 'base64');
  derived = {
    enc: Buffer.from(hkdfSync('sha256', ikm, HKDF_SALT, 'tacct-user-enc', 32)),
    hmac: Buffer.from(hkdfSync('sha256', ikm, HKDF_SALT, 'tacct-user-bidx', 32)),
  };
  return derived;
}

export function encryptField(plaintext: string): string {
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv('aes-256-gcm', keys().enc, iv);
  const ciphertext = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return ENC_PREFIX + Buffer.concat([iv, tag, ciphertext]).toString('base64');
}

export function decryptField(value: string): string {
  if (!value.startsWith(ENC_PREFIX)) return value;
  const blob = Buffer.from(value.slice(ENC_PREFIX.length), 'base64');
  const iv = blob.subarray(0, IV_LENGTH);
  const tag = blob.subarray(IV_LENGTH, IV_LENGTH + TAG_LENGTH);
  const ciphertext = blob.subarray(IV_LENGTH + TAG_LENGTH);
  const decipher = createDecipheriv('aes-256-gcm', keys().enc, iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString('utf8');
}

export function blindIndex(value: string): string {
  return createHmac('sha256', keys().hmac).update(value).digest('base64');
}
