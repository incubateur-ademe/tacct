import Collection6Img from '@/assets/images/collection6_x2.png';
import { BoutonPrimaireClassic } from "@/design-system/base/Boutons";
import { Body, H2 } from "@/design-system/base/Textes";
import Image from "next/image";
import styles from '../impacts.module.scss';

export const AssocierLesActeurs = () => {
  return (
    <div id="section2" className={styles.associerLesActeursContainer}>
      <div className={styles.texte}>
        <H2
          style={{
            color: "var(--principales-vert)",
            fontSize: 22,
            margin: 0,
            lineHeight: "28px",
          }}
        >
          Associer les acteurs du territoire au diagnostic de vulnérabilité
        </H2>
        <Body>
          Passez de ces données au dialogue pour découvrir les impacts réels du changement climatique sur le territoire. Nous avons rassemblé des outils et ressources pour vous accompagner dans la mobilisation des parties prenantes.
        </Body>
        <BoutonPrimaireClassic
          size='sm'
          text='Découvrir les ressources  →'
          link='/ressources/associer-parties-prenantes'
          style={{
            marginTop: 16
          }}
        />
      </div>
      <Image
        src={Collection6Img}
        alt=""
        width={240}
        height={0}
        style={{ height: 'auto', maxWidth: '30%', alignSelf: 'center' }}
      />

    </div>
  )
};
