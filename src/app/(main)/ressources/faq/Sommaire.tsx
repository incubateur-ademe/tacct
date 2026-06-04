'use client';
import { useEffect, useState } from 'react';
import styles from '../[collectionId]/[slug]/articles.module.scss';

interface SommaireClientProps {
  headings: string[];
}

export const SommaireFAQ = ({ headings }: SommaireClientProps) => {
  const [activeAnchor, setActiveAnchor] = useState<string>('');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;
      let currentActive = '';

      for (let i = headings.length - 1; i >= 0; i--) {
        const titre = headings[i];
        const element = document.getElementById(titre);
        if (element) {
          const elementTop = element.offsetTop;
          if (scrollPosition >= elementTop) {
            currentActive = titre;
            break;
          }
        }
      }

      if (currentActive && currentActive !== activeAnchor) {
        setActiveAnchor(currentActive);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [headings, activeAnchor]);

  const scrollToAnchor = (anchor: string) => {
    const element = document.getElementById(anchor);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <nav className={styles.sommaireSticky} style={{ padding: "0"}}>
      <ul className={styles.sommaireList}>
        {headings.map((titre) => (
          <li key={titre}>
            <button
              onClick={() => scrollToAnchor(titre)}
              className={`${styles.sommaireItem} ${activeAnchor === titre ? styles.itemActive : ''}`}
            >
              {titre}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};
