'use client';

import { Body } from '@/design-system/base/Textes';
import { ReactNode, useId } from 'react';
import { COULEURS } from './couleurs';
import styles from './questionnaire.module.scss';

interface Props {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (valeur: string) => void;
  type?: 'text' | 'email';
  erreur?: string;
  icone?: ReactNode;
  autoFocus?: boolean;
}

export const ChampTexte = ({
  label,
  placeholder,
  value,
  onChange,
  type = 'text',
  erreur,
  icone,
  autoFocus = false
}: Props) => {
  const id = useId();
  const idErreur = `${id}-erreur`;

  return (
    <div className={styles.champ}>
      <label htmlFor={id}>
        <Body htmlTag="span" weight="medium" color={COULEURS.texteTitre}>
          {label}
        </Body>
      </label>
      <div className={styles.champWrapper}>
        {icone && (
          <span className={styles.champIcone} aria-hidden="true">
            {icone}
          </span>
        )}
        <input
          id={id}
          type={type}
          className={`${styles.champSaisie} ${icone ? styles.champSaisieAvecIcone : ''} ${
            erreur ? styles.champSaisieErreur : ''
          }`}
          placeholder={placeholder}
          value={value}
          autoFocus={autoFocus}
          aria-invalid={!!erreur}
          aria-describedby={erreur ? idErreur : undefined}
          onChange={(event) => onChange(event.target.value)}
        />
      </div>
      {erreur && (
        <div id={idErreur} role="alert">
          <Body size="sm" color={COULEURS.texteErreur}>
            {erreur}
          </Body>
        </div>
      )}
    </div>
  );
};
