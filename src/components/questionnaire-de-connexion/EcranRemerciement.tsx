'use client';

import { BoutonPrimaireClassic } from '@/design-system/base/Boutons';
import { H2 } from '@/design-system/base/Textes';
import { RefObject } from 'react';
import styles from './questionnaire.module.scss';
import { STYLE_TITRE_QUESTION } from './stylesTitres';

const IconeCoche = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"
      fill="currentColor"
    />
  </svg>
);

interface Props {
  titreRef: RefObject<HTMLHeadingElement | null>;
}

export const EcranRemerciement = ({ titreRef }: Props) => (
  <>
    <span className={styles.pastilleConfirmation} aria-hidden="true">
      <IconeCoche />
    </span>
    <H2
      ref={titreRef}
      tabIndex={-1}
      style={{ ...STYLE_TITRE_QUESTION, margin: 0 }}
    >
      Merci, vos réponses sont enregistrées
    </H2>
    <div className={styles.actions}>
      <BoutonPrimaireClassic
        size="md"
        text="Accéder à mon compte  →"
        link="/mon-espace?questionnaire=success"
      />
    </div>
  </>
);
