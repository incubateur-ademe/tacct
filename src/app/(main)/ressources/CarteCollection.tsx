import { toutesLesRessources } from "@/lib/ressources/toutesRessources";
import Image, { StaticImageData } from "next/image";
import styles from "./ressources.module.scss";

export const CarteCollection = ({
  texte,
  image,
  lien,
}: {
  texte: string;
  image: StaticImageData;
  lien: string;
}) => {
  const nombreressources = toutesLesRessources.filter(ressource => ressource.collections.includes(texte)).length;
  return (
    <a href={lien} className={styles.carteCollectionWrapper}>
      <div className={styles.content}>
        <Image src={image} alt="" className={styles.carteCollectionImage} />
        <p>{texte}</p>
      </div>
      <p className={styles.texteCache}>{nombreressources} ressources</p>
    </a>
  );
};
