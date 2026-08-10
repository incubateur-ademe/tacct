'use client';

import styles from '@/app/(main)/mon-espace/monEspace.module.scss';
import sparklingIcon from '@/assets/icons/sparkling_icon_green.svg';
import productLaunch from '@/assets/images/product-launch.png';
import { TagsSimples } from '@/design-system/base/Tags';
import { Body, H3 } from '@/design-system/base/Textes';
import Image from 'next/image';

interface Props {
  hasAnswers: boolean;
  completed: number;
  started: number;
  total: number;
}

export const TacctoscopeCard = ({
  hasAnswers,
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
            {/* TODO MIGRATION */}
            {/* {!hasAnswers && (
              <TagsSimples
                texte="NOUVEAU"
                couleur="#E3FAF9"
                couleurTexte="var(--boutons-primaire-3)"
                taille="small"
                icone={
                  <Image src={sparklingIcon} alt="" width={12} height={12} />
                }
              />
            )} */}
            <TagsSimples
              texte="BIENTÔT DISPONIBLE "
              couleur="#E3FAF9"
              couleurTexte="var(--boutons-primaire-3)"
              taille="small"
              icone={
                <Image src={sparklingIcon} alt="" width={12} height={12} />
              }
            />

            <H3
              color="#038278"
              style={{
                fontSize: '1.25rem',
                lineHeight: '1.75rem',
                letterSpacing: 0,
                margin: 0
              }}
            >
              Le TACCToscope : analysez votre diagnostic de vulnérabilité
            </H3>
            <Body color="#3d3d3d">
              Vous révisez un diagnostic de vulnérabilité ? Ne repartez pas de zéro ! Notre outil interactif vous guide pour un retravail ciblé et méthodique.
            </Body>
          </div>
          {/* TODO MIGRATION */}

          {/* {hasAnswers && (
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
          )} */}
          {/* <div className={styles.boutonsGroupe}>
            <BoutonPrimaireClassic
              size="md"
              link="/tacctoscope"
              text={
                hasAnswers ? 'Continuer l’analyse  →' : 'Commencer l’analyse  →'
              }
            />
            {hasAnswers && (
              <BoutonSecondaireClassic
                size="md"
                link="/tacctoscope/feuille-de-route"
                text="Voir ma feuille de route  →"
              />
            )}
          </div> */}
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
