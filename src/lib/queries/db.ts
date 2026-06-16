import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { Pool } from 'pg';
import { decryptField } from '@/lib/crypto/user-crypto';
import { PrismaClient } from '../../generated/client/client';

const USER_ENCRYPTED_FIELDS = [
  'email',
  'username',
  'firstname',
  'lastname',
  'authenticated_id'
] as const;

function decryptUserRow(row: Record<string, unknown>): void {
  for (const field of USER_ENCRYPTED_FIELDS) {
    const value = row[field];
    if (typeof value === 'string') row[field] = decryptField(value);
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
