'use client';

import { Body, H2 } from '@/design-system/base/Textes';
import { NewContainer } from '@/design-system/layout';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRef } from 'react';
import { SliderArticles } from '../../sliderArticles';
import { CollectionsData } from '../collectionsData';
import styles from './articles.module.scss';

export const ArticlesMemeCollection = () => {
  const pathname = usePathname();
  const collectionSlug = pathname.split('/')[2];
  const collection = CollectionsData.find(
    (c) => c.slug === collectionSlug
  )?.titre;
  const articleSlug = pathname.split('/')[3];
  const sliderRef = useRef<HTMLDivElement>(null);
  const articles = CollectionsData.find(
    (c) => c.slug === collectionSlug
  )?.articles;
  const listeArticlesFiltres = articles?.filter(
    (c) => !c.lien.includes(articleSlug)
  );

  return (
    <>
      {listeArticlesFiltres && (
        <div className={styles.articlesMemeCollectionContainer}>
          <NewContainer size="xl" style={{ paddingTop: '32px' }}>
            <div className={styles.articlesMemeCollectionWrapper}>
              <div className={styles.titles}>
                <H2 style={{ color: '#2B4B49', marginBottom: '0.5rem' }}>
                  Dans la même collection
                </H2>
                <Body style={{ color: '#3D3D3D' }}>
                  Les autres ressources de la collection "
                  <Link
                    href={`/ressources/${collectionSlug}`}
                    onClick={() =>
                      window.scrollTo({ top: 0, behavior: 'instant' })
                    }
                  >
                    {collection}
                  </Link>
                  "
                </Body>
              </div>
              <SliderArticles
                listeArticles={listeArticlesFiltres}
                sliderRef={sliderRef}
              />
            </div>
          </NewContainer>
        </div>
      )}
    </>
  );
};

export const ArticlesMemeCollectionResponsive = () => {
  const pathname = usePathname();
  const collectionSlug = pathname.split('/')[2];
  const articleSlug = pathname.split('/')[3];
  const sliderRef = useRef<HTMLDivElement>(null);
  const articles = CollectionsData.find(
    (c) => c.slug === collectionSlug
  )?.articles;
  const listeArticlesFiltres = articles?.filter(
    (c) => !c.lien.includes(articleSlug)
  );

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
    <>
      {listeArticlesFiltres && (
        <div className={styles.articlesMemeCollectionContainer}>
          <div className={styles.articlesMemeCollectionWrapper}>
            <div className={styles.titreEtBoutons}>
              <H2 style={{ color: '#2B4B49', marginBottom: '0' }}>
                Dans la même collection
              </H2>
              <div className={styles.boutonsWrapper}>
                <button
                  className={styles.flecheGaucheMobile}
                  aria-label="Précédent"
                  onClick={scrollLeft}
                >
                  <span
                    className="fr-icon-arrow-left-line"
                    aria-hidden="true"
                    style={{ color: 'var(--boutons-primaire-3)' }}
                  ></span>
                </button>
                <button
                  className={styles.flecheDroiteMobile}
                  aria-label="Suivant"
                  onClick={scrollRight}
                >
                  <span
                    className="fr-icon-arrow-right-line"
                    aria-hidden="true"
                    style={{ color: 'var(--boutons-primaire-3)' }}
                  ></span>
                </button>
              </div>
            </div>
            <SliderArticles
              listeArticles={listeArticlesFiltres}
              sliderRef={sliderRef}
            />
          </div>
        </div>
      )}
    </>
  );
};
