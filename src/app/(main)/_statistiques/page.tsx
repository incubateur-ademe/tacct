import { Body, H1 } from '@/design-system/base/Textes';
import { NewContainer } from '@/design-system/server';
import { Metadata } from 'next';
import UniqueUsers from './metrics/uniqueUsers';

export const metadata: Metadata = {
  title: 'Statistiques',
  description: 'Statistiques de l’utilisation de TACCT',
};

const Page = async () => {
  return (
    <NewContainer size="xl">
      <H1>Statistiques</H1>
      <Body>
        <i>
          Cette page présente les statistiques d’utilisation du site TACCT.
          Veuillez noter qu’il s’agit d’une page en cours de construction, de
          nouvelles données viendront progressivement l’enrichir.
        </i>
      </Body>
      <UniqueUsers />
      {/* <EpciCount /> */}
      {/* <ThematiquesTypes />
      <RessourcesClicked /> */}
    </NewContainer>
  );
};

export default Page;
