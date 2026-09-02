'use client';

import eluFormation from '@/assets/images/elu_formation.png';
import { CarteLienUtile } from './BlocsBureauEtudes';

const LIEN_FORMATION_ELUS =
  'https://academie.ademe.fr/formations/changement-climatique/adaptation-au-changement-climatique/comment-adapter-mon-territoire-et-ses-activites-au-changement-climatique/s5395';

export const EluFormation = () => (
  <CarteLienUtile
    fond="#ecfffd"
    couleurTitre="#2B4B49"
    titre="Notre formation courte à l’adaptation au changement climatique, pour les élu·es (ADEME)"
    texte={
      <>
        L’Académie de l’ADEME propose une formation de 2h{' '}
        <b>destinée aux élu·es</b> des collectivités:{' '}
        <b>
          “Comment adapter mon territoire et ses activités au changement
          climatique?”
        </b>
        .
        <br />
        Accessible sur inscription, elle permet de se familiariser avec les{' '}
        <b>enjeux et méthodes spécifiques à l’adaptation</b> dans l’action
        publique territoriale.
      </>
    }
    lien={LIEN_FORMATION_ELUS}
    libelleBouton="Découvrir la formation (2h)"
    illustration={eluFormation}
    largeurImage="256px"
  />
);
