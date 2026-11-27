import { PrismaClient } from '@/generated/client/client';
import { creerPool } from '@/lib/queries/db';
import { PrismaPg } from '@prisma/adapter-pg';

// Pool séparé : les requêtes des tableaux de bord attendent leur tour ici
// sans occuper les connexions du reste de l'application.
const pool = creerPool({ max: 2, connectionTimeoutMillis: 120000 });

export const prismaMetabase = new PrismaClient({ adapter: new PrismaPg(pool) });
