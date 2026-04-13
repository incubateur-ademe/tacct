"use client";

import { TuileHorizontaleCollection } from "@/components/Tuile";
import { createModal } from "@codegouvfr/react-dsfr/Modal";
import { StaticImageData } from "next/image";
import { useStyles } from 'tss-react/dsfr';
import { CollectionsData } from "../[collectionId]/collectionsData";
import styles from "./modaleToutesCollections.module.scss";

export const modaleToutesCollections = createModal({
  id: "toutes-collections-modal",
  isOpenedByDefault: false
});

export const ModaleToutesCollections = ({
  collectionsCartes
}: {
  collectionsCartes: {
    texte: string;
    image: StaticImageData;
    lien: string;
  }[]
}) => {
  const { css } = useStyles();

  return (
    <modaleToutesCollections.Component
      title="Toutes les collections"
      className={css({
        ".fr-col-lg-8": {
          flex: "0 0 100%",
          width: "100%",
          maxWidth: "100%",
        },
        ".fr-modal__header": {
          position: "absolute",
          top: 0,
          right: 0,
          zIndex: 10,
        },
        ".fr-modal__content": {
          marginBottom: "2rem",
        },
        ".fr-modal__title": {
          color: "#2B4B49",
        },
        ".fr-modal__body": {
          backgroundColor: "var(--boutons-primaire-5)",
          borderRadius: "1rem",
          paddingTop: "2rem",
          scrollbarWidth: "none",
          "&:focus": {
            backgroundColor: "var(--boutons-primaire-5)",
          },
        },
        ".fr-btn--close": {
          color: "#2B4B49",
          fontSize: "0",
          "&::after": {
            fontSize: "1rem",
            content: '"×"',
          },
          "&:hover": {
            backgroundColor: "var(--boutons-primaire-5) !important",
          },
        },
      })}
      size="large"
    >
      <div className={styles.contenu}>
        {collectionsCartes.map((carte, index) => {
          const collection = CollectionsData.find(c => c.titre === carte.texte);
          const tempsLecture = collection?.articles.reduce((total, article) => total + article.tempsLecture, 0) || 0;
          return (
            <TuileHorizontaleCollection
              key={index}
              titre={carte.texte}
              image={carte.image}
              lien={carte.lien}
              nombreArticles={collection?.articles.length || 0}
              tempsLecture={collection?.titre === "Démarrer le diagnostic de vulnérabilité" ? 47 : tempsLecture}
            />
          )
        })}
      </div>
    </modaleToutesCollections.Component>
  );
};
