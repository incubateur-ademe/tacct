import RessourcesImg from '@/assets/images/ressources_home.png';
import { BoutonPrimaireClassic } from '@/design-system/base/Boutons';
import { Body, H2 } from "@/design-system/base/Textes";
import { NewContainer } from "@/design-system/layout";
import Image from 'next/image';
import styles from './home.module.scss';

export const RessourcesBloc = () => {
  return (
    <div className={styles.ressourcesContainer}>
      <NewContainer size="xl">
        <div className={styles.ressourcesWrapper}>
          <div className={styles.ressourcesText}>
            <H2>Boîte à outils de l’adaptation</H2>
            <Body>
              Bénéficiez d'articles et de retours d'expériences pour vous
              accompagner dans la mise en place de votre démarche d’adaptation
              au changement climatique.
            </Body>
            <BoutonPrimaireClassic
              size='lg'
              link="/ressources"
              text="Découvrir la boîte à outils"
              style={{ marginTop: '2rem' }}
              posthogEventName='bouton_decouvrir_ressources_home'
            />
          </div>
          <Image
            alt=""
            src={RessourcesImg}
            className={styles.ressourcesImage}
          />
        </div>
      </NewContainer>
    </div>
  )
};
