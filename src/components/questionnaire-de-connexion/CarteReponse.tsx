'use client';

import { Body } from '@/design-system/base/Textes';
import { COULEURS } from './couleurs';
import styles from './questionnaire.module.scss';

const IconeCoche = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"
      fill="currentColor"
    />
  </svg>
);

interface Props {
  role: 'radio' | 'checkbox';
  label: string;
  valeur: string;
  selectionnee: boolean;
  desactivee?: boolean;
  rang?: number;
  tabIndex?: number;
  onActivation: () => void;
}

export const CarteReponse = ({
  role,
  label,
  valeur,
  selectionnee,
  desactivee = false,
  rang,
  tabIndex,
  onActivation
}: Props) => (
  <button
    type="button"
    role={role}
    aria-checked={selectionnee}
    aria-disabled={desactivee || undefined}
    data-valeur={valeur}
    tabIndex={tabIndex}
    className={`${styles.carte} ${selectionnee ? styles.carteSelectionnee : ''} ${
      desactivee ? styles.carteDesactivee : ''
    }`}
    onClick={onActivation}
  >
    {role === 'radio' ? (
      <span className={styles.puceRadio} aria-hidden="true">
        {selectionnee && <span className={styles.puceRadioInterne} />}
      </span>
    ) : (
      <span
        className={`${styles.puceCase} ${selectionnee ? styles.puceCaseCochee : ''} ${
          desactivee ? styles.puceCaseDesactivee : ''
        }`}
        aria-hidden="true"
      >
        {selectionnee && <IconeCoche />}
      </span>
    )}
    <Body
      htmlTag="span"
      color={desactivee ? COULEURS.texteSubtil : COULEURS.texteCorps}
      style={{ flex: 1, minWidth: 0 }}
    >
      {label}
    </Body>
    {rang !== undefined && (
      <span className={styles.pastilleRang}>
        <Body htmlTag="span" weight="bold" size="sm" color={COULEURS.blanc}>
          Besoin n°{rang}
        </Body>
      </span>
    )}
  </button>
);
