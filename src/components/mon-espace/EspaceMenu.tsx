'use client';

import styles from '@/app/(main)/mon-espace/monEspace.module.scss';
import { Body } from '@/design-system/base/Textes';
import { useEffect, useState } from 'react';

export interface EspaceMenuItem {
  anchor: string;
  label: string;
}

interface Props {
  items: EspaceMenuItem[];
}

export const EspaceMenu = ({ items }: Props) => {
  const [activeAnchor, setActiveAnchor] = useState<string>('');

  useEffect(() => {
    const handleScroll = () => {
      const scrollBottom = window.scrollY + window.innerHeight;
      const atBottom =
        scrollBottom >= document.documentElement.scrollHeight - 2;

      let current = items[0]?.anchor ?? '';
      if (atBottom) {
        current = items[items.length - 1]?.anchor ?? current;
      } else {
        const trigger = window.scrollY + window.innerHeight * 0.35;
        for (let i = items.length - 1; i >= 0; i--) {
          const element = document.getElementById(items[i].anchor);
          if (element && trigger >= element.offsetTop) {
            current = items[i].anchor;
            break;
          }
        }
      }
      setActiveAnchor((previous) => (previous === current ? previous : current));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [items]);

  const scrollTo = (anchor: string) => {
    document
      .getElementById(anchor)
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <nav className={styles.menu} aria-label="Sections de mon espace">
      <ul className={styles.menuList}>
        {items.map((item) => {
          const isActive = activeAnchor === item.anchor;
          return (
            <li key={item.anchor}>
              <button
                type="button"
                onClick={() => scrollTo(item.anchor)}
                aria-current={isActive ? 'true' : undefined}
                className={`${styles.menuItem} ${isActive ? styles.menuItemActive : ''}`}
              >
                <Body
                  htmlTag="span"
                  weight="bold"
                  color={isActive ? '#038278' : '#3d3d3d'}
                >
                  {item.label}
                </Body>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
