'use client';

import styles from '@/app/(espace-connecte)/(avec-navigation)/tacctoscope/feuille-de-route/roadmap.module.scss';
import cadenas from '@/assets/svg/custom/cadenas.svg';
import drawerStyles from '@/components/components.module.scss';
import { Body } from '@/design-system/base/Textes';
import { CriterionSlug } from '@/lib/tacctoscope/types';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
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

export const RetourSommaire = () => (
  <Link href="/tacctoscope" className={styles.menuBackLink}>
    <Body htmlTag="span" weight="medium" color="#038278" aria-hidden="true">
      ←
    </Body>
    <Body htmlTag="span" weight="medium" color="#038278">
      Retour au sommaire
    </Body>
  </Link>
);

interface MenuItemsProps {
  items: RoadmapMenuItem[];
  activeSlug: string;
  onSelect: (item: RoadmapMenuItem) => void;
}

const MenuItems = ({ items, activeSlug, onSelect }: MenuItemsProps) => (
  <ul className={styles.menuList}>
    {items.map((item) => {
      const isActive = !item.locked && activeSlug === item.slug;
      return (
        <li key={item.slug}>
          <button
            type="button"
            onClick={() => onSelect(item)}
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
);

export const RoadmapMenu = ({ items }: Props) => {
  const [activeSlug, setActiveSlug] = useState<string>('');
  const [unlockOpen, setUnlockOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const fabRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
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

  // Ouverture : le focus entre dans le tiroir. Échap ferme et rend le focus au
  // déclencheur (RGAA 7.3 / 12.9 — le tiroir se déclare `aria-modal`).
  useEffect(() => {
    if (!drawerOpen) return;
    closeButtonRef.current?.focus();
    document.body.style.overflow = 'hidden';
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setDrawerOpen(false);
      fabRef.current?.focus();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [drawerOpen]);

  const handleSelect = (item: RoadmapMenuItem) => {
    if (item.locked) {
      setUnlockOpen(true);
      return;
    }
    document
      .getElementById(item.slug)
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      <nav className={styles.menu}>
        <p className={styles.menuTitle}>Catégories</p>
        <MenuItems items={items} activeSlug={activeSlug} onSelect={handleSelect} />
        <div className={styles.menuFooter}>
          <RetourSommaire />
        </div>
      </nav>

      <div className={styles.menuMobile}>
        <button
          type="button"
          ref={fabRef}
          onClick={() => setDrawerOpen(true)}
          className={drawerStyles.menuMobileFab}
          aria-expanded={drawerOpen}
          aria-label="Ouvrir la navigation"
        >
          <span aria-hidden="true">☰</span>
          Navigation
        </button>

        {drawerOpen && (
          <div
            className={drawerStyles.menuMobileBackdrop}
            onClick={() => setDrawerOpen(false)}
            aria-hidden="true"
          />
        )}

        <div
          className={`${drawerStyles.menuMobileDrawer} ${drawerOpen ? drawerStyles.menuMobileDrawerOpen : ''}`}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation dans la page"
        >
          <div className={drawerStyles.menuMobileDrawerHeader}>
            <div className="flex items-center justify-between">
              <RetourSommaire />
              <button
                type="button"
                ref={closeButtonRef}
                onClick={() => {
                  setDrawerOpen(false);
                  fabRef.current?.focus();
                }}
                className={drawerStyles.menuMobileClose}
                aria-label="Fermer la navigation"
              >
                ✕
              </button>
            </div>
            <Body
              size="sm"
              weight="bold"
              color="#038278"
              margin="12px 0 0"
              style={{ lineHeight: '1.5rem', textTransform: 'uppercase' }}
            >
              Catégories
            </Body>
          </div>
          <div className={drawerStyles.menuMobileDrawerContent}>
            <MenuItems
              items={items}
              activeSlug={activeSlug}
              onSelect={(item) => {
                setDrawerOpen(false);
                handleSelect(item);
              }}
            />
          </div>
        </div>
      </div>

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
