import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { Pool } from 'pg';
import {
  blindIndex,
  decryptField,
  encryptField,
  isEncrypted
} from '@/lib/crypto/user-crypto';
import { PrismaClient } from '../../generated/client/client';

const USER_ENCRYPTED_FIELDS = [
  'email',
  'username',
  'firstname',
  'lastname',
  'authenticated_id',
  'recontact_email'
] as const;

const USER_BLIND_INDEX_FIELDS: Partial<
  Record<(typeof USER_ENCRYPTED_FIELDS)[number], string>
> = {
  email: 'email_bidx',
  authenticated_id: 'authenticated_id_bidx'
};

function decryptUserRow(row: Record<string, unknown>): void {
  for (const field of USER_ENCRYPTED_FIELDS) {
    const value = row[field];
    if (typeof value === 'string') row[field] = decryptField(value);
  }
}

const valeurEnClair = (value: unknown): string | null => {
  if (typeof value === 'string') return value;
  if (value && typeof value === 'object' && 'set' in value) {
    const { set } = value as { set: unknown };
    if (typeof set === 'string') return set;
  }
  return null;
};

// Filet de sécurité à l'écriture : un champ sensible fourni en clair est chiffré
// et son blind index calculé, même si l'appelant a oublié encryptField.
function encryptUserData(data: Record<string, unknown>): void {
  for (const field of USER_ENCRYPTED_FIELDS) {
    const plaintext = valeurEnClair(data[field]);
    if (plaintext === null || isEncrypted(plaintext)) continue;
    data[field] = encryptField(plaintext);
    const bidxField = USER_BLIND_INDEX_FIELDS[field];
    if (bidxField && data[bidxField] === undefined) {
      data[bidxField] = blindIndex(plaintext);
    }
  }
}

// Couvre create/update/updateMany (data), createMany (data[]) et upsert (create/update).
function encryptUserArgs(args: Record<string, unknown>): void {
  for (const cle of ['data', 'create', 'update'] as const) {
    const bloc = args[cle];
    if (Array.isArray(bloc)) {
      for (const ligne of bloc) {
        if (ligne && typeof ligne === 'object') {
          encryptUserData(ligne as Record<string, unknown>);
        }
      }
    } else if (bloc && typeof bloc === 'object') {
      encryptUserData(bloc as Record<string, unknown>);
    }
  }
}

const connectionString = process.env.SCALINGO_POSTGRESQL_URL;

// Nettoyer l'URL : retirer les paramètres après ?
const cleanConnectionString = connectionString?.split('?')[0];

let sslConfig;
const caPath = join(process.cwd(), 'ca.pem');

// En production, Scalingo injecte le certificat dans le système
// En dev local, on utilise le fichier ca.pem
if (existsSync(caPath)) {
  const ca = readFileSync(caPath, 'utf8');
  sslConfig = {
    ca: ca,
    rejectUnauthorized: false
  };
} else {
  // En production sur Scalingo, ssl: true suffit (certificats système)
  sslConfig = true;
}

const pool = new Pool({
  connectionString: cleanConnectionString,
  ssl: sslConfig,
  max: 5,
  idleTimeoutMillis: 20000
});

const adapter = new PrismaPg(pool);

export const prisma = new PrismaClient({ adapter }).$extends({
  query: {
    user: {
      async $allOperations({ args, query }) {
        encryptUserArgs(args as unknown as Record<string, unknown>);
        const result = await query(args);
        if (Array.isArray(result)) {
          for (const row of result) {
            if (row && typeof row === 'object') {
              decryptUserRow(row as Record<string, unknown>);
            }
          }
        } else if (result && typeof result === 'object') {
          decryptUserRow(result as Record<string, unknown>);
        }
        return result;
      }
    }
  }
});
