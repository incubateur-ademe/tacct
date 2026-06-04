"use client";

import { BoutonSecondaireClassic } from "@/design-system/base/Boutons";
import { Body, H2 } from "@/design-system/base/Textes";
import { NewContainer } from "@/design-system/layout";
import { StaticImageData } from "next/image";
import { useRef } from "react";
import styles from '../ressources.module.scss';
import { SliderCollections } from "../sliderCollections";
import { modaleToutesCollections } from './ModaleToutesCollections';

export const BlocCollections = ({
  collectionsCartes,
}: {
  collectionsCartes: {
    texte: string;
    image: StaticImageData;
    lien: string;
  }[],
}) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  return (
    <div className={styles.ressourcesCollectionContainer}>
      <NewContainer size="xl">
        <div className={styles.ressourcesCollectionWrapper}>
          <div className={styles.titles}>
            <H2 style={{ color: "#2B4B49", marginBottom: "0.5rem" }}>
              Explorez nos collections
            </H2>
            <Body style={{ color: "#3D3D3D" }}>Une sélection de ressources pour chaque situation</Body>
            <BoutonSecondaireClassic
              text="Voir tout  →"
              size="md"
              style={{
                marginTop: "2rem"
              }}
              onClick={() => modaleToutesCollections.open()}
            />
          </div>
          <SliderCollections collectionsCartes={collectionsCartes} sliderRef={sliderRef} />
        </div>
      </NewContainer>
    </div>
  )
};

export const BlocCollectionsResponsive = ({
  collectionsCartes,
}: {
  collectionsCartes: {
    texte: string;
    image: StaticImageData;
    lien: string;
  }[],
}) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const smoothScroll = (distance: number) => {
    if (!sliderRef.current) return;
    const start = sliderRef.current.scrollLeft;
    const duration = 800;
    const startTime = performance.now();
    const scroll = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = progress * (2 - progress);
      if (sliderRef.current) {
        sliderRef.current.scrollLeft = start + distance * easeProgress;
      }
      if (progress < 1) {
        requestAnimationFrame(scroll);
      }
    };
    requestAnimationFrame(scroll);
  };
  const scrollLeft = () => {
    smoothScroll(-344);
  };
  const scrollRight = () => {
    smoothScroll(344);
  };
  return (
    <div className={styles.ressourcesCollectionContainer}>
      <div className={styles.ressourcesCollectionWrapper}>
        <div className={styles.titreEtBoutons}>
          <H2 style={{ color: "#2B4B49", marginBottom: "0" }}>
            Explorez nos collections
          </H2>
          <div className={styles.boutonsWrapper}>
            <button className={styles.flecheGaucheMobile} aria-label="Précédent" onClick={scrollLeft}>
              <span className="fr-icon-arrow-left-line" aria-hidden="true" style={{ color: "var(--boutons-primaire-3)" }}></span>
            </button>
            <button className={styles.flecheDroiteMobile} aria-label="Suivant" onClick={scrollRight}>
              <span className="fr-icon-arrow-right-line" aria-hidden="true" style={{ color: "var(--boutons-primaire-3)" }}></span>
            </button>

          </div>
        </div>
        <SliderCollections collectionsCartes={collectionsCartes} sliderRef={sliderRef} />
        <BoutonSecondaireClassic
          text="Voir tout  →"
          size="md"
          style={{
            width: "100%",
          }}
          onClick={() => modaleToutesCollections.open()}
        />
      </div>
    </div>
  )
};
