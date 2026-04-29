import { collectionsCartes } from '@/lib/ressources/cartes';
import { Metadata } from 'next';
import { BlocAutresOutils } from './blocs/blocAutresOutils';
import { BlocCollections, BlocCollectionsResponsive } from './blocs/blocCollections';
import { BlocTitre } from './blocs/blocTitre';
import { BlocToutesRessources } from './blocs/blocToutesRessources';
import { ModaleToutesCollections } from './blocs/ModaleToutesCollections';
import styles from './ressources.module.scss';

export const metadata: Metadata = {
  title: 'Ressources',
  description: 'Catalogue de ressources TACCT à destination des collectivités',
};

const Ressources = () => {
  return (
    <>
      <BlocTitre />
      <div className={styles.desktopOnly}>
        <BlocCollections collectionsCartes={collectionsCartes} />
      </div>
      <div className={styles.mobileOnly}>
        <BlocCollectionsResponsive collectionsCartes={collectionsCartes} />
      </div>
      <BlocAutresOutils />
      <BlocToutesRessources />
      <ModaleToutesCollections collectionsCartes={collectionsCartes} />
    </>
  );
};

export default Ressources;
