'use client';

import { StaticImageData } from 'next/image';
import { KeyboardEvent, ReactNode, useId, useRef } from 'react';
import styles from './Onglets.module.scss';
import { Body } from './Textes';

export type Onglet = {
  libelle: string;
  icone?: StaticImageData;
};

export const Onglets = ({
  onglets,
  ongletActif,
  onChange,
  variante,
  ariaLabel,
  children
}: {
  onglets: Onglet[];
  ongletActif: string;
  onChange: (libelle: string) => void;
  variante: 'souligne' | 'classeur';
  ariaLabel: string;
  children: ReactNode;
}) => {
  const idBase = useId();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const indexActif = Math.max(
    0,
    onglets.findIndex((o) => o.libelle === ongletActif)
  );
  const idOnglet = (index: number) => `${idBase}-onglet-${index}`;
  const idPanneau = `${idBase}-panneau`;

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const dernier = onglets.length - 1;
    const cible =
      e.key === 'ArrowRight'
        ? index === dernier ? 0 : index + 1
        : e.key === 'ArrowLeft'
          ? index === 0 ? dernier : index - 1
          : e.key === 'Home'
            ? 0
            : e.key === 'End'
              ? dernier
              : null;
    if (cible === null) return;
    e.preventDefault();
    onChange(onglets[cible].libelle);
    refs.current[cible]?.focus();
  };

  return (
    <>
      <div
        role="tablist"
        aria-label={ariaLabel}
        className={`${styles.listeOnglets} ${styles[variante]}`}
      >
        {onglets.map((onglet, index) => {
          const actif = index === indexActif;
          return (
            <button
              key={onglet.libelle}
              ref={(el) => {
                refs.current[index] = el;
              }}
              type="button"
              role="tab"
              id={idOnglet(index)}
              aria-selected={actif}
              aria-controls={idPanneau}
              tabIndex={actif ? 0 : -1}
              className={styles.onglet}
              onClick={() => onChange(onglet.libelle)}
              onKeyDown={(e) => handleKeyDown(e, index)}
            >
              {onglet.icone && (
                <span
                  aria-hidden="true"
                  className={styles.icone}
                  style={{
                    maskImage: `url(${onglet.icone.src})`,
                    WebkitMaskImage: `url(${onglet.icone.src})`
                  }}
                />
              )}
              <span className={styles.libelle} data-libelle={onglet.libelle}>
                <Body
                  htmlTag="span"
                  color="inherit"
                  weight={actif ? 'bold' : 'medium'}
                >
                  {onglet.libelle}
                </Body>
              </span>
            </button>
          );
        })}
      </div>
      <div
        role="tabpanel"
        id={idPanneau}
        aria-labelledby={idOnglet(indexActif)}
        tabIndex={0}
      >
        {children}
      </div>
    </>
  );
};
