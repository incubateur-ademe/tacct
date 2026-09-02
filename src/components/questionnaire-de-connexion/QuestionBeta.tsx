'use client';

import { Body, H2 } from '@/design-system/base/Textes';
import Link from 'next/link';
import { RefObject } from 'react';
import { ChampTexte } from './ChampTexte';
import { COULEURS } from './couleurs';
import styles from './questionnaire.module.scss';
import { STYLE_TITRE_QUESTION } from './stylesTitres';

const IconeCoche = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"
      fill="currentColor"
    />
  </svg>
);

const IconeEnveloppe = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M3 5h18a1 1 0 011 1v12a1 1 0 01-1 1H3a1 1 0 01-1-1V6a1 1 0 011-1zm9 7.5L4.5 7v10h15V7L12 12.5z"
      fill="currentColor"
    />
  </svg>
);

interface Props {
  titreRef: RefObject<HTMLHeadingElement | null>;
  optInBeta: boolean;
  emailRecontact: string;
  erreurEmail?: string;
  onBasculeOptIn: () => void;
  onChangementEmail: (valeur: string) => void;
}

export const QuestionBeta = ({
  titreRef,
  optInBeta,
  emailRecontact,
  erreurEmail,
  onBasculeOptIn,
  onChangementEmail
}: Props) => (
  <>
    <H2
      ref={titreRef}
      tabIndex={-1}
      style={{ ...STYLE_TITRE_QUESTION, margin: '0 0 0.25rem' }}
    >
      Souhaitez-vous tester les futures évolutions du site avant leur sortie ? <i>(facultatif)</i>    </H2>

    <Body weight="medium" color={COULEURS.texteSubtil} margin="0.5rem 0 1.75rem">
      Nous vous recontacterons occasionnellement dans les prochains mois.
    </Body>

    <div className={styles.blocBeta}>
      <div className={styles.encadreBeta}>
        <button
          type="button"
          role="checkbox"
          aria-checked={optInBeta}
          className={styles.optIn}
          onClick={onBasculeOptIn}
        >
          <span
            className={`${styles.puceCase} ${optInBeta ? styles.puceCaseCochee : ''}`}
            aria-hidden="true"
          >
            {optInBeta && <IconeCoche />}
          </span>
          <Body
            htmlTag="span"
            color={COULEURS.texteCorps}
            style={{ lineHeight: '1.5rem' }}
          >
            J’accepte d’être recontacté·e pour participer à des tests
          </Body>
        </button>
        <Body
          size="sm"
          color={COULEURS.texteSubtil}
          margin="0.5rem 0 0"
          style={{ lineHeight: '1.25rem' }}
        >
          Votre adresse sera utilisée uniquement pour vous inviter à tester de futures évolutions du site. 
          Vous pouvez retirer votre accord à tout moment.{' '}
          <Link
            href="/politique-de-confidentialite"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.lienBeta}
          >
            Politique de confidentialité
          </Link>
        </Body>
      </div>

      {optInBeta && (
        <ChampTexte
          label="Email de contact"
          type="email"
          value={emailRecontact}
          onChange={onChangementEmail}
          erreur={erreurEmail}
          icone={<IconeEnveloppe />}
        />
      )}
    </div>
  </>
);
