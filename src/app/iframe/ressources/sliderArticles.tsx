"use client";

import { TuileVerticale } from "@/components/Tuile";
import { TagsIcone } from "@/design-system/base/Tags";
import { FiltresOptions, ToutesRessources } from "@/lib/ressources/toutesRessources";
import { usePathname } from "next/navigation";
import styles from "./ressources.module.scss";

export const SliderArticles = ({
  listeArticles,
  sliderRef
}: {
  listeArticles: ToutesRessources[],
  sliderRef: React.RefObject<HTMLDivElement | null>;
}) => {
  const pathname = usePathname();
  const collectionSlug = pathname.split('/')[2];
  const territoireOptions = FiltresOptions.find(f => f.titre === 'Territoire')?.options || [];
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
        listeArticles && listeArticles.length > 2 &&
        <button className={styles.flecheGauche} aria-label="Précédent" onClick={scrollLeft}>
          <span className="fr-icon-arrow-left-line" aria-hidden="true" style={{ color: "var(--boutons-primaire-3)" }}></span>
        </button>
      }
      <div className={styles.sliderInnerWrapper}>
        <div className={styles.sliderWrapper} ref={sliderRef}>
          {
            listeArticles?.map((article, index) => {
              const isExternalLink = article.lien.startsWith('https://');
              const lien = isExternalLink
                ? article.lien
                : `/iframe/ressources/${collectionSlug}/${article.slug}`;
              return (
                <TuileVerticale
                  key={index}
                  titre={article.titre}
                  description={article.description}
                  tags={article.filtres?.filter(filtre => !territoireOptions.includes(filtre)).map((filtre, index) => (
                    <TagsIcone
                      key={index}
                      texte={filtre}
                      filtre={filtre as "Article" | "Retour d'expérience" | "M'inspirer" | "Me former" | "Agir"}
                      taille="small"
                    />
                  ))}
                  image={article.image}
                  lien={lien}
                  lienExterne={isExternalLink}
                  tempsLecture={article.tempsLecture}
                />
              )
            })
          }
        </div>
      </div>
      {
        listeArticles && listeArticles.length > 2 &&
        <button className={styles.flecheDroite} aria-label="Suivant" onClick={scrollRight}>
          <span className="fr-icon-arrow-right-line" aria-hidden="true" style={{ color: "var(--boutons-primaire-3)" }}></span>
        </button>
      }
    </div>
  );
}
