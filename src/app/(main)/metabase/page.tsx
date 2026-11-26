import { Body, H1 } from '@/design-system/base/Textes';
import { NewContainer } from '@/design-system/layout';
import { type Metadata } from 'next';
import { TableauxDeBord } from './TableauxDeBord';

export const metadata: Metadata = {
  title: 'Tableaux de bord Metabase',
  robots: { index: false, follow: false }
};

const Page = () => (
  <NewContainer size="xl" style={{ padding: '2.5rem 1rem 4rem' }}>
    <H1 style={{ marginBottom: '0.5rem' }}>Tableaux de bord Metabase</H1>
    <Body style={{ marginBottom: '2rem' }}>
      Reproduction des tableaux de bord Metabase à partir des mêmes requêtes SQL, exécutées sur la base de
      l’application.
    </Body>
    <TableauxDeBord />
  </NewContainer>
);

export default Page;
