'use client';

import { ScrollToTop } from '@/components/interactions/ScrollToTop';
import { NewContainer } from '@/design-system/layout';
import { Suspense, useEffect, useRef, useState } from 'react';
import PanneauLateral from './components/panneauLateral';
import RoueSystemique from './components/roue';
import styles from './roue.module.scss';

const RouePage = () => {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const panneauRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedItem && window.innerWidth < 1050 && panneauRef.current) {
      const top = panneauRef.current.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }, [selectedItem]);

  return (
    <Suspense>
      <ScrollToTop />
      <NewContainer style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
        <style jsx global>
          {`
            html, body {
              scrollbar-width: none; /* Firefox */
              -ms-overflow-style: none; /* Internet Explorer 10+ */
            }
            html::-webkit-scrollbar, body::-webkit-scrollbar {
              display: none; /* WebKit */
            }
          `}
        </style>
        <div className={styles.responsiveThematiquesLayout}>
          <div
            className={`${styles.roueContainer} ${selectedItem ? styles.selected : styles.unselected}`}
          >
            <RoueSystemique
              onItemSelect={setSelectedItem}
              selectedItem={selectedItem}
            />
          </div>
          <div ref={panneauRef} className={styles.panneauLateralContainer}>
            <PanneauLateral
              setSelectedItem={setSelectedItem}
              selectedItem={selectedItem}
            />
          </div>
        </div>
      </NewContainer>
    </Suspense>
  );
};

export default RouePage;

{/* Style global pour cacher la scrollbar */ }
// <style jsx global>
//   {`html, body {
//     scrollbar-width: none; /* Firefox */
//     -ms-overflow-style: none; /* Internet Explorer 10+ */
//   }
//   html::-webkit-scrollbar, body::-webkit-scrollbar {
//     display: none; /* WebKit */
//   }`}
// </style>
