"use client";

import { StaticImageData } from "next/image";
import { useEffect, useState } from "react";
import { CarteCollection } from "./CarteCollection";
import styles from "./ressources.module.scss";

export const SliderCollections = ({
  collectionsCartes,
  sliderRef
}: {
  collectionsCartes: {
    texte: string;
    image: StaticImageData;
    lien: string;
  }[],
  sliderRef: React.RefObject<HTMLDivElement | null>;
}) => {
  const [sliderScrollLeft, setSliderScrollLeft] = useState(0);
  const [isScrollEnd, setIsScrollEnd] = useState(false);

  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;
    const onScroll = () => {
      setSliderScrollLeft(el.scrollLeft);
      setIsScrollEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth);
    };
    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, [sliderRef]);

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
    <div className={styles.sliderContainer}>
      {
        sliderScrollLeft ? (
          <button className={styles.flecheGauche} aria-label="Précédent" onClick={scrollLeft}>
            <span className="fr-icon-arrow-left-line" aria-hidden="true" style={{ color: "var(--boutons-primaire-3)" }}></span>
          </button>
        ) : null
      }

      <div className={styles.sliderInnerWrapper}>
        <div className={styles.sliderWrapper} ref={sliderRef}>
          {
            collectionsCartes?.map((carte, index) => (
              <CarteCollection
                key={index}
                texte={carte.texte}
                image={carte.image}
                lien={carte.lien}
              />
            ))
          }
        </div>
      </div>
      {
        !isScrollEnd ? (
          <button className={styles.flecheDroite} aria-label="Suivant" onClick={scrollRight}>
            <span className="fr-icon-arrow-right-line" aria-hidden="true" style={{ color: "var(--boutons-primaire-3)" }}></span>
          </button>
        ) : null
      }
    </div>
  );
}
