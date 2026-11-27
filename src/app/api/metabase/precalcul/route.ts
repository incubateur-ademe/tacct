import { precalculer } from '@/lib/queries/metabase/resultats';
import { timingSafeEqual } from 'crypto';
import { after, NextResponse, type NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

const estAutorise = (req: NextRequest): boolean => {
  const secret = process.env.METABASE_PRECALCUL_SECRET;
  if (!secret) return false;
  const recu = Buffer.from(req.headers.get('authorization') ?? '');
  const attendu = Buffer.from(`Bearer ${secret}`);
  return recu.length === attendu.length && timingSafeEqual(recu, attendu);
};

export const POST = async (req: NextRequest) => {
  if (!estAutorise(req)) {
    return NextResponse.json({ erreur: 'Non autorisé' }, { status: 401 });
  }
  // Le calcul dure plusieurs minutes : on répond tout de suite et il se poursuit en arrière-plan.
  after(async () => {
    try {
      console.log('[metabase] précalcul terminé :', await precalculer());
    } catch (erreur) {
      console.error('[metabase] précalcul :', erreur);
    }
  });
  return NextResponse.json({ statut: 'lancé' }, { status: 202 });
};
