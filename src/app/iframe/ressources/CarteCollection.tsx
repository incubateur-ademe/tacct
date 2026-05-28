"use client";

import { toutesLesRessources } from "@/lib/ressources/toutesRessources";
import Image, { StaticImageData } from "next/image";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const onClick = () => {
    router.push(lien);
  };
  const nombreressources = toutesLesRessources.filter(ressource => ressource.collections.includes(texte)).length;
  return (
    <div className={styles.carteCollectionWrapper} role="link" tabIndex={0} onClick={onClick}>
      <div className={styles.content} >
        <Image src={image} alt={`icone carte ${texte}`} className={styles.carteCollectionImage} />
        <p>{texte}</p>
      </div>
      <p className={styles.texteCache}>{nombreressources} ressources</p>
    </div >
  );
};
