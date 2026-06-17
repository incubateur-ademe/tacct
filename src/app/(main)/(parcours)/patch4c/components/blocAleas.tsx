'use client';

import { ReplaceDisplayEpci } from "@/components/searchbar/fonctions";
import { TagsSimples } from "@/design-system/base/Tags";
import { Body } from "@/design-system/base/Textes";
import { Patch4 } from "@/lib/postgres/models";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import styles from '../patch4c.module.scss';
import { AleaExplications } from "./aleaExplications";
import { AnalyseSensibilite } from "./analyseSensibilite";
import { ConseilsAggravation } from "./blocConseils";
import { patch4Indices } from "./fonctions";
import { Patch4Maps } from "./Patch4Maps";

export const BlocAleas = ({
  coordonneesCommunes,
  patch4,
  selectedAleaKey,
  onSelectAlea
}: {
  coordonneesCommunes: {
    codes: string[];
    bbox: { minLng: number; minLat: number; maxLng: number; maxLat: number };
  } | null;
  patch4: Patch4[];
  selectedAleaKey?: string;
  onSelectAlea: (key: string, shouldScroll?: boolean) => void;
}) => {
  const searchParams = useSearchParams();
  const libelle = searchParams.get('libelle')!;
  const type = searchParams.get('type')!;

  const activeItems = patch4Indices(patch4[0]).filter(item => {
    if (item.key === 'niveaux_marins') return patch4.some(p => p.niveaux_marins !== null);
    if (item.key === 'feux_foret') return patch4.some(p => p.feux_foret !== null);
    return true;
  });
  const getInitialIndex = () => {
    if (selectedAleaKey) {
      const index = activeItems.findIndex(item => item.key === selectedAleaKey);
      if (index >= 0) return index;
    }
    if (typeof window === 'undefined') return 0;
    const hash = window.location.hash.slice(1);
    const index = activeItems.findIndex(item => item.key === hash);
    return index >= 0 ? index : 0;
  };
  const [selectedIndex, setSelectedIndex] = useState(getInitialIndex);

  useEffect(() => {
    if (selectedAleaKey) {
      const index = activeItems.findIndex(item => item.key === selectedAleaKey);
      if (index >= 0) {
        setSelectedIndex(index);
      } else {
        setSelectedIndex(0);
        onSelectAlea(activeItems[0].key, false);
      }
    }
  }, [selectedAleaKey, activeItems]);

  useEffect(() => {
    if (selectedIndex >= activeItems.length) {
      setSelectedIndex(0);
      onSelectAlea(activeItems[0].key, false);
    }
  }, [patch4]);

  const handleTabChange = (index: number) => {
    setSelectedIndex(index);
    onSelectAlea(activeItems[index].key, false);
  };

  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const handleTabKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    let newIndex = index;
    if (e.key === 'ArrowRight') {
      newIndex = (index + 1) % activeItems.length;
    } else if (e.key === 'ArrowLeft') {
      newIndex = (index - 1 + activeItems.length) % activeItems.length;
    } else if (e.key === 'Home') {
      newIndex = 0;
    } else if (e.key === 'End') {
      newIndex = activeItems.length - 1;
    } else {
      return;
    }
    e.preventDefault();
    handleTabChange(newIndex);
    tabRefs.current[newIndex]?.focus();
  };

  const safeSelectedIndex = selectedIndex < activeItems.length ? selectedIndex : 0;
  const selectedKey = activeItems[safeSelectedIndex].key;
  const filteredPatch4 = patch4.map(item => {
    return {
      code_geographique: item.code_geographique,
      [selectedKey]: (item as never)[selectedKey],
      libelle_geographique: item.libelle_geographique,
    };
  });

  return (
    <>
      {
        patch4.length > 1 &&
        <div className={styles.CircleVisualizationTerritory} style={{ marginTop: '1.5rem' }}>
          <Body
            size='lg'
            weight='bold'
            style={{ fontSize: "22px" }}
          >
            {ReplaceDisplayEpci(libelle)}
          </Body>
          <TagsSimples
            texte={
              (type === "epci" || type === "petr" || type === "ept" || type === "pnr")
                ? type.toUpperCase()
                : type === "departement"
                  ? "Département"
                  : type === "commune"
                    ? "Commune"
                    : type
            }
            couleur="#E3FAF9"
            couleurTexte="var(--bouton-primaire-3)"
            taille="small"
          />
        </div>
      }
      <div className={styles.aleasTabsContainer} id={selectedKey}>
        <div role="tablist" aria-label="Aléas climatiques" className={styles.aleasTabButtons}>
          {activeItems.map((alea, index) => (
            <button
              key={alea.key}
              ref={(el) => { tabRefs.current[index] = el; }}
              type="button"
              role="tab"
              id={`alea-tab-${alea.key}`}
              aria-selected={safeSelectedIndex === index}
              aria-controls={`alea-panel-${alea.key}`}
              tabIndex={safeSelectedIndex === index ? 0 : -1}
              className={`${styles.aleasTabButton} ${safeSelectedIndex === index ? styles.aleasTabButtonActive : ''}`}
              onClick={() => handleTabChange(index)}
              onKeyDown={(e) => handleTabKeyDown(e, index)}
            >
              {safeSelectedIndex === index ? (
                <div
                  className={styles.iconMask}
                  style={{
                    width: '24px',
                    height: '24px',
                    maskImage: `url(${alea.icon.src})`,
                    WebkitMaskImage: `url(${alea.icon.src})`
                  }}
                />
              ) : (
                <Image src={alea.icon} alt="" width={24} height={24} />
              )}
              <span>{alea.label}</span>
            </button>
          ))}
        </div>
        <div
          role="tabpanel"
          id={`alea-panel-${selectedKey}`}
          aria-labelledby={`alea-tab-${selectedKey}`}
          tabIndex={0}
          className={styles.aleasTabContent}
        >
          {activeItems[safeSelectedIndex] && (() => {
            const { key, ...itemProps } = activeItems[safeSelectedIndex];

            return (
              <>
                <AleaExplications key={`alea-${key}`} item={itemProps} isMap={patch4.length > 1 ? true : false} />
                {(patch4.length > 1) ? <Patch4Maps coordonneesCommunes={coordonneesCommunes} patch4={filteredPatch4} selectedAnchor={key} /> : null}
                <AnalyseSensibilite key={`sensibilite-${key}`} item={itemProps} isMap={patch4.length > 1 ? true : false} />
                {
                  (patch4.length > 1 || itemProps.value === "Aggravation forte" || itemProps.value === "Aggravation très forte") &&
                  <ConseilsAggravation />
                }
              </>
            );
          })()}
        </div>
      </div>
    </>
  )
};
