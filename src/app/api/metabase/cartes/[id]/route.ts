import { carteExiste, executerCarte } from '@/lib/queries/metabase/executer';
import { lireGranularite, lirePeriode } from '@/lib/queries/metabase/periode';
import { NextResponse, type NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const id = Number((await params).id);
  if (!Number.isInteger(id) || !carteExiste(id)) {
    return NextResponse.json({ erreur: 'Carte inconnue' }, { status: 404 });
  }

  const recherche = req.nextUrl.searchParams;
  const periode = lirePeriode(recherche.get('periode'));
  const periodeEtape2 = lirePeriode(recherche.get('periodeEtape2'));
  const granularite = lireGranularite(recherche.get('granularite'));
  if (!periode || !periodeEtape2 || !granularite) {
    return NextResponse.json({ erreur: 'Paramètres invalides' }, { status: 400 });
  }

  try {
    return NextResponse.json(await executerCarte(id, { periode, periodeEtape2, granularite }));
  } catch (erreur) {
    console.error(`[metabase] carte ${id} :`, erreur);
    if (erreur instanceof Error && erreur.message.includes('57014')) {
      return NextResponse.json({ erreur: 'Délai de la requête dépassé' }, { status: 504 });
    }
    return NextResponse.json({ erreur: 'Erreur lors de l’exécution de la requête' }, { status: 500 });
  }
};
