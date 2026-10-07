import productLaunch from '@/assets/images/product-launch.png';
import { SparklingIcon } from '@/assets/svg/home/homeIcones';
import { BoutonPrimaireClassic } from '@/design-system/base/Boutons';
import { TagsSimples } from '@/design-system/base/Tags';
import { Body, H3 } from '@/design-system/base/Textes';
import { NewContainer } from '@/design-system/layout';
import Image from 'next/image';
import styles from './home.module.scss';

const ArrowRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z"
      fill="currentColor"
    />
  </svg>
);

export const TacctoscopeBloc = () => (
  <div className={styles.tacctoscopeBloc}>
    <NewContainer size="xl" style={{ paddingTop: 0, paddingBottom: 0 }}>
      <div className={styles.diagnosticCard}>
        <div className={styles.diagnosticCardContent}>
          <div className={styles.diagnosticCardText}>
            <TagsSimples
              texte="NOUVEAU"
              couleur="#E3FAF9"
              couleurTexte="var(--boutons-primaire-3)"
              taille="small"
              icone={<SparklingIcon />}
            />
            <H3
              color="#038278"
              style={{
                fontSize: '2rem',
                lineHeight: '2.5rem',
                letterSpacing: 0,
                margin: 0
              }}
            >
              Vous révisez un diagnostic de vulnérabilité ?
              <br />
              Ne repartez pas de zéro !
            </H3>
            <Body size="md" color="#3d3d3d">
              Le TACCToscope, notre outil interactif, vous guide pour un
              retravail ciblé et méthodique.
            </Body>
            <BoutonPrimaireClassic
              size="md"
              link="/tacctoscope"
              text="Commencer l’auto-évaluation du diagnostic"
              iconeFin={<ArrowRightIcon />}
              style={{ marginTop: '0.75rem', maxWidth: '100%' }}
            />
          </div>
          <div className={styles.diagnosticCardIllustration}>
            <Image src={productLaunch} alt="" />
          </div>
        </div>
      </div>
    </NewContainer>
  </div>
);
