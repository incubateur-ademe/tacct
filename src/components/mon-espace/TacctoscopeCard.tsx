'use client';

import styles from '@/app/(espace-connecte)/(avec-navigation)/mon-espace/monEspace.module.scss';
import sparklingIcon from '@/assets/icons/sparkling_icon_green.svg';
import productLaunch from '@/assets/images/product-launch.png';
import { BoutonPrimaireClassic, BoutonSecondaireClassic } from '@/design-system/base/Boutons';
import { TagsSimples } from '@/design-system/base/Tags';
import { Body, H3 } from '@/design-system/base/Textes';
import Image from 'next/image';

interface Props {
  hasAnswers: boolean;
  isComplete: boolean;
  recommendationCount: number;
  completed: number;
  started: number;
  total: number;
}

const CheckIcon = () => (
  <svg width="9" height="6" viewBox="0 0 9 6" fill="none" aria-hidden="true">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M3.182 4.5965L7.778 0L8.4855 0.707L3.182 6.0105L0 2.8285L0.707 2.1215L3.182 4.5965Z"
      fill="#095D55"
    />
  </svg>
);

const DraftIcon = () => (
  <svg width="21" height="20" viewBox="0 0 21 20" fill="none" aria-hidden="true">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M17 0C17.552 0 18 0.448 18 1V4.757L16 6.757V2H2V18H16V15.242L18 13.242V19C18 19.552 17.552 20 17 20H1C0.448 20 0 19.552 0 19V1C0 0.448 0.448 0 1 0H17ZM18.778 6.808L20.192 8.222L12.414 16L10.998 15.998L11 14.586L18.778 6.808ZM10 10V12H5V10H10ZM13 6V8H5V6H13Z"
      fill="#038278"
    />
  </svg>
);

export const TacctoscopeCard = ({
  hasAnswers,
  isComplete,
  recommendationCount,
  completed,
  started,
  total
}: Props) => {
  const valeur = completed > 0 ? completed : started;
  const pourcentage = total > 0 ? Math.round((valeur / total) * 100) : 0;
  const libelle =
    completed > 0
      ? `Vous avez complété ${completed}/${total} critères`
      : `Vous avez commencé ${started} critères`;

  return (
    <div className={styles.tacctoscope}>
      <span className={styles.tacctoscopeCircle} aria-hidden="true" />
      <div className={styles.tacctoscopeContenu}>
        <div className={styles.tacctoscopeTexte}>
          <div className={styles.blocTitre}>
            {!hasAnswers && (
              <TagsSimples
                texte="NOUVEAU"
                couleur="#E3FAF9"
                couleurTexte="var(--boutons-primaire-3)"
                taille="small"
                icone={
                  <Image src={sparklingIcon} alt="" width={12} height={12} />
                }
              />
            )}

            {isComplete && (
              <TagsSimples
                texte="Analyse Complète"
                couleur="#E3FAF9"
                couleurTexte="var(--boutons-primaire-3)"
                taille="small"
                icone={<CheckIcon />}
              />
            )}

            <H3
              color="#038278"
              style={{
                fontSize: '1.25rem',
                lineHeight: '1.75rem',
                letterSpacing: 0,
                margin: 0
              }}
            >
              Analysez votre diagnostic de vulnérabilité avec le TACCToscope
            </H3>
            {!hasAnswers && (
              <Body color="#3d3d3d" style={{ lineHeight: "24px" }}>
                Vous révisez un diagnostic de vulnérabilité ? Ne repartez pas de zéro ! Notre outil interactif vous guide pour un retravail ciblé et méthodique.
              </Body>
            )}
            {isComplete && (
              <div className={styles.pistesLigne}>
                <DraftIcon />
                <Body weight='medium' color="#038278">
                  {recommendationCount} piste
                  {recommendationCount > 1 ? 's' : ''} d’amélioration identifiée
                  {recommendationCount > 1 ? 's' : ''}
                </Body>
              </div>
            )}
          </div>
          {/* TODO MIGRATION */}

          {hasAnswers && !isComplete && (
            <div className={styles.progression}>
              <Body weight="medium" color="#038278">
                {libelle}
              </Body>
              <div
                className={styles.progressionBarre}
                role="progressbar"
                aria-valuenow={valeur}
                aria-valuemin={0}
                aria-valuemax={total}
                aria-label={libelle}
              >
                <div
                  className={styles.progressionJauge}
                  style={{ width: `${pourcentage}%` }}
                />
              </div>
            </div>
          )}
          <div className={styles.boutonsGroupe}>
            {!isComplete && (
              <BoutonPrimaireClassic
                size="md"
                link="/tacctoscope"
                text={
                  hasAnswers
                    ? 'Continuer l’analyse  →'
                    : 'Commencer l’analyse du diagnostic  →'
                }
              />
            )}
            {hasAnswers && (
              <BoutonSecondaireClassic
                size="md"
                link="/tacctoscope/feuille-de-route"
                text="Voir ma feuille de route  →"
              />
            )}
          </div>
        </div>

        <Image
          src={productLaunch}
          alt=""
          className={styles.tacctoscopeIllustration}
        />
      </div>
    </div>
  );
};
