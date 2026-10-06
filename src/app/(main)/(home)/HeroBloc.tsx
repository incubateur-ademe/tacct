import TopImage from '@/assets/images/logo-homepage.png';
import TopLogo from '@/assets/images/logo2-homepage.png';
import { BoutonSecondaireClassic } from '@/design-system/base/Boutons';
import { Body, H1 } from '@/design-system/base/Textes';
import { NewContainer } from '@/design-system/layout';
import Image from 'next/image';
import styles from './home.module.scss';

export const HeroBloc = () => {
  return (
    <div className={styles.heroBlocOuter}>
      <NewContainer size="xl">
        <div className={styles.heroBlocInner}>
          <div className={styles.heroBlocText}>
            <H1 color="white">
              Réussir la démarche d'adaptation de votre territoire
            </H1>
            <Body size="lg" color="white" margin="0.5rem 0 2rem">
              Avec TACCT, identifiez les vulnérabilités de votre territoire aux impacts du
              changement climatique.
            </Body>
            <BoutonSecondaireClassic
              size="lg"
              link="/recherche-territoire"
              text="Explorer les données de mon territoire"
            />
          </div>
          <div className={styles.heroBlocImageWrapper}>
            <Image
              alt=""
              src={TopImage}
              width={0}
              height={0}
              className={styles.heroBlocImg}
            />
            <Image
              alt=""
              src={TopLogo}
              width={0}
              height={0}
              className={styles.heroBlocLogo}
            />
          </div>
        </div>
      </NewContainer>
    </div>
  );
};
