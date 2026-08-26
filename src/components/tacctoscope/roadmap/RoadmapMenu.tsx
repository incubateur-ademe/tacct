'use client';

import styles from '@/app/(espace-connecte)/(avec-navigation)/tacctoscope/feuille-de-route/roadmap.module.scss';
import cadenas from '@/assets/svg/custom/cadenas.svg';
import { CriterionSlug } from '@/lib/tacctoscope/types';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { UnlockModal } from '../shared/Modales';
import { CRITERION_ICONS } from '../shared/criterionIcons';

export interface RoadmapMenuItem {
  slug: CriterionSlug;
  title: string;
  locked: boolean;
}

interface Props {
  items: RoadmapMenuItem[];
}

export const RoadmapMenu = ({ items }: Props) => {
  const [activeSlug, setActiveSlug] = useState<string>('');
  const [unlockOpen, setUnlockOpen] = useState(false);
  const anchors = items.filter((item) => !item.locked).map((item) => item.slug);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;
      let current = '';
      for (let i = anchors.length - 1; i >= 0; i--) {
        const element = document.getElementById(anchors[i]);
        if (element && scrollPosition >= element.offsetTop) {
          current = anchors[i];
          break;
        }
      }
      if (current && current !== activeSlug) setActiveSlug(current);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [anchors, activeSlug]);

  const scrollTo = (slug: string) => {
    document
      .getElementById(slug)
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      <nav className={styles.menu}>
        <p className={styles.menuTitle}>Critères</p>
        <ul className={styles.menuList}>
          {items.map((item) => {
            const isActive = !item.locked && activeSlug === item.slug;
            return (
              <li key={item.slug}>
                <button
                  type="button"
                  onClick={() =>
                    item.locked ? setUnlockOpen(true) : scrollTo(item.slug)
                  }
                  className={`${styles.menuItem} ${isActive ? styles.menuItemActive : ''} ${item.locked ? styles.menuItemLocked : ''}`}
                >
                  <Image
                    src={CRITERION_ICONS[item.slug]}
                    alt=""
                    width={48}
                    height={48}
                    className={styles.menuItemIcon}
                  />
                  <span className={styles.menuItemLabelWrapper}>
                    <span className={styles.menuItemLabel}>{item.title}</span>
                    {item.locked && (
                      <span className={styles.menuItemLock}>
                        <Image src={cadenas} alt="" width={16} height={16} />
                        Connexion requise
                      </span>
                    )}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <UnlockModal
        isOpen={unlockOpen}
        onClose={() => setUnlockOpen(false)}
        onConfirm={() => {
          const returnTo = encodeURIComponent(window.location.pathname);
          window.location.href = `/api/proconnect/login?returnTo=${returnTo}`;
        }}
      />
    </>
  );
};
