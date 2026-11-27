import { Body, H1 } from '@/design-system/base/Textes';
import { NewContainer } from '@/design-system/layout';
import { lireTableau } from '@/lib/queries/metabase/resultats';
import { type Metadata } from 'next';
import { TABLEAUX_DE_BORD } from './configuration';
import { TableauxDeBord } from './TableauxDeBord';

export const metadata: Metadata = {
  title: 'Tableaux de bord Metabase',
  robots: { index: false, follow: false }
};

export const dynamic = 'force-dynamic';

const Page = async () => {
  const initiaux = await lireTableau(TABLEAUX_DE_BORD[0].id).catch((erreur: unknown) => {
    console.error('[metabase] lecture des résultats :', erreur);
    return null;
  });

  return (
    <NewContainer size="xl" style={{ padding: '2.5rem 1rem 4rem' }}>
      <H1 style={{ marginBottom: '0.5rem' }}>Tableaux de bord Metabase</H1>
      <Body style={{ marginBottom: '2rem' }}>
        Reproduction des tableaux de bord Metabase à partir des mêmes requêtes SQL, exécutées sur la base de
        l’application.
      </Body>
      <TableauxDeBord initiaux={initiaux ?? {}} />
    </NewContainer>
  );
};

export default Page;
