import { Metadata } from 'next';
import { BlocAutresOutils } from './blocs/blocAutresOutils';
import { BlocCollections, BlocCollectionsResponsive } from './blocs/blocCollections';
import { BlocTitre } from './blocs/blocTitre';
import { BlocToutesRessources } from './blocs/blocToutesRessources';
import { ModaleToutesCollections } from './blocs/ModaleToutesCollections';
import styles from './ressources.module.scss';
import { collectionsIframeCartes } from './cartes';

export const metadata: Metadata = {
  title: 'Ressources',
  description: 'Catalogue de ressources TACCT à destination des collectivités',
};

const Ressources = () => {
  return (
    <>
      <BlocTitre />
      <div className={styles.desktopOnly}>
        <BlocCollections collectionsCartes={collectionsIframeCartes} />
      </div>
      <div className={styles.mobileOnly}>
        <BlocCollectionsResponsive collectionsCartes={collectionsIframeCartes} />
      </div>
      <BlocAutresOutils />
      <BlocToutesRessources />
      <ModaleToutesCollections collectionsCartes={collectionsIframeCartes} />
    </>
  );
};

export default Ressources;
