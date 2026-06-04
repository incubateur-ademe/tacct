import EnveloppeIcone from "@/assets/icons/enveloppe_icon_green.svg";
import FiltresNonTrouvesImage from "@/assets/images/filtres_non_trouves.png";
import { BoutonPrimaireClassic, BoutonSecondaireClassic } from '@/design-system/base/Boutons';
import { Body } from '@/design-system/base/Textes';
import Image from "next/image";
import styles from '../ressources.module.scss';

export const FiltresNonTrouves = () => {
  return (
    <div className={styles.filtresNonTrouvesContainer}>
      <Body size='xl' weight='bold' style={{ color: "#666666", marginBottom: "4px"}}>Oups !</Body>
      <Body style={{ color: "#666666"}}>Aucune ressource trouvée. Comment pouvons-nous vous aider ?</Body>
      <div className={styles.boutons}>
        <BoutonPrimaireClassic
          text='Explorer par collection  →'
          size='md'
          onClick={() => window.scrollTo({ top: 0 })}
        />
        <BoutonSecondaireClassic 
          text="Contactez l'équipe"
          size='md'
          link="https://tally.so/r/mJGELz"
          rel='noopener noreferrer'
          icone={EnveloppeIcone}
          style={{ minWidth: "223px"}}
        />
      </div>
      <Image
        src={FiltresNonTrouvesImage}
        alt="Illustration personne cherchant des ressources"
        style={{ marginTop: "4rem" }}
      />
    </div>
  );
};
