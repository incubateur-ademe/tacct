import { lireTableau } from '@/lib/queries/metabase/resultats';
import { NextResponse, type NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export const GET = async (
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const id = Number((await params).id);
  try {
    const resultats = Number.isInteger(id) ? await lireTableau(id) : null;
    if (!resultats) {
      return NextResponse.json({ erreur: 'Tableau de bord inconnu' }, { status: 404 });
    }
    return NextResponse.json(resultats);
  } catch (erreur) {
    console.error(`[metabase] tableau ${id} :`, erreur);
    return NextResponse.json({ erreur: 'Erreur lors de la lecture des résultats' }, { status: 500 });
  }
};
