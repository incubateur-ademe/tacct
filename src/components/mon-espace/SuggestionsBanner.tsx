'use client';

import styles from '@/app/(main)/mon-espace/monEspace.module.scss';
import enveloppeIcon from '@/assets/icons/enveloppe_icon_white.svg';
import { BoutonPrimaireClassic } from '@/design-system/base/Boutons';
import { Body, H3 } from '@/design-system/base/Textes';

const LIEN_COMMENTAIRE = 'https://tally.so/r/mJGELz';

export const SuggestionsBanner = () => (
  <div className={styles.suggestions}>
    <div className={styles.suggestionsTexte}>
      <H3
        color="#3d3d3d"
        style={{
          fontSize: '1.25rem',
          lineHeight: '1.75rem',
          letterSpacing: 0,
          margin: 0
        }}
      >
        Une question ou une suggestion sur le service TACCT ?
      </H3>
      <Body color="#3d3d3d">
        TACCT est un service en construction, vos retours sont précieux et
        contribuent à sa qualité.
      </Body>
    </div>
    <BoutonPrimaireClassic
      size="md"
      link={LIEN_COMMENTAIRE}
      rel="noopener noreferrer"
      text="Contacter l'équipe"
      icone={enveloppeIcon}
    />
  </div>
);
