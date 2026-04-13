import Patch4Img from '@/assets/images/patch4_home.png';
import { BoutonPrimaireClassic } from "@/design-system/base/Boutons";
import { Body, H2 } from "@/design-system/base/Textes";
import { NewContainer } from "@/design-system/layout";
import Image from "next/image";
import styles from './home.module.scss';

export const Patch4Bloc = () => {
  return (
    <div className={styles.patch4Container}>
      <NewContainer size="xl">
        <div className={styles.patch4Wrapper}>
          <div className={styles.patch4img}>
            <Image
              alt=""
              src={Patch4Img}
            />
          </div>
          <div className={styles.patch4Text}>
            <H2>
              Avec le patch 4°C : intégrez la trajectoire de réchauffement de référence dans votre diagnostic existant
            </H2>
            <Body>
              Le “patch 4°C” est une action du 3ème Plan national d’adaptation au changement
              climatique (2025). Il s’adresse en priorité aux communes ou EPCI qui
              viennent d’achever leurs études de vulnérabilité sur la base d’hypothèses de
              réchauffement différentes de celles de la TRACC.
            </Body>
            <BoutonPrimaireClassic
              size='lg'
              link="/iframe/recherche-territoire-patch4"
              text='Accéder au patch 4°C'
            />
          </div>
        </div>
      </NewContainer>
    </div>
  )
};
