import TopImage from '@/assets/images/home_page1.png';
import { BoutonSecondaireClassic } from "@/design-system/base/Boutons";
import { Body, H1 } from "@/design-system/base/Textes";
import { NewContainer } from "@/design-system/layout";
import Image from "next/image";
import styles from './home.module.scss';

export const PremierBloc = () => {
  return (
    <div className={styles.homePageTopContainer}>
      <NewContainer size="xl">
        <div className={styles.homePageTopWrapper}>
          <div className={styles.titles}>
            <H1 style={{ color: "white" }}>
              Le climat change. Et vous ?
            </H1>
            <Body size='lg' style={{ color: "white", margin: "2.5rem 0 2rem" }}>
              Avec Facili-TACCT, identifiez les vulnérabilités de votre territoire aux impacts du changement climatique.
            </Body>
            <BoutonSecondaireClassic
              size='lg'
              link="/iframe/recherche-territoire"
              text='Explorer les données de mon territoire'
            />
          </div>
          <div className={styles.topImage}>
            <Image
              alt=""
              src={TopImage}
              width={0}
              height={0}
              style={{
                width: '100%',
                height: 'auto',
                objectFit: 'contain',
              }}
            />
          </div>
        </div>
      </NewContainer>
    </div>
  )
};
