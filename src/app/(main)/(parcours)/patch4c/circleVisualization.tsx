"use client";
import { ReplaceDisplayEpci } from '@/components/searchbar/fonctions';
import { HtmlTooltip } from '@/components/utils/Tooltips';
import { TagsSimples } from '@/design-system/base/Tags';
import { Body } from '@/design-system/base/Textes';
import { Patch4 } from "@/lib/postgres/models";
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { getBackgroundColor, getItemPosition, patch4Indices } from './components/fonctions';
import styles from './patch4c.module.scss';

const CircleVisualization = ({
  patch4,
  selectedAleaKey,
  onSelectAlea
}: {
  patch4: Patch4;
  selectedAleaKey?: string;
  onSelectAlea: (key: string, shouldScroll?: boolean) => void;
}) => {
  const searchParams = useSearchParams();
  const libelle = searchParams.get('libelle')!;
  const type = searchParams.get('type')!;
  const indices = patch4Indices(patch4);
  const activeItems = patch4.niveaux_marins === null
    ? indices.filter(item => item.key !== 'niveaux_marins')
    : indices;
  const handleClick = (item: string) => {
    onSelectAlea(item, true);
  };
  const [focusedKey, setFocusedKey] = useState<string | null>(null);

  return (
    <>
      <div className={styles.CircleVisualizationTerritory}>
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
      <div className={styles.CircleVisualizationContainer}>
        <div className={styles.CircleVisualizationWrapper}>
          <div className={styles.extCircle}>
            {activeItems.map((item, index) => {
              const position = getItemPosition(index, activeItems.length);
              return (
                <button
                  type="button"
                  key={item.key}
                  className={styles.CircleItem}
                  style={{
                    left: position.x - 35,
                    top: position.y - 30,
                  }}
                  onClick={() => handleClick(item.key)}
                  onFocus={() => setFocusedKey(item.key)}
                  onBlur={() => setFocusedKey(null)}
                  aria-pressed={selectedAleaKey === item.key}
                  aria-label={item.value ? `${item.label} — ${item.value}` : item.label}
                >
                  {/* Circle with icon */}
                  <HtmlTooltip
                    title={item.value ?? "Pas d'évolution"}
                    placement="top"
                    open={focusedKey === item.key}
                    disableFocusListener
                    disableHoverListener
                    disableTouchListener
                  >
                  <div
                    className={styles.CircleIcon}
                    style={{
                      backgroundColor: getBackgroundColor(item.value),
                      border: selectedAleaKey === item.key ? '1px solid black' : '1px solid var(--gris-medium)',
                    }}
                  >
                    <Image
                      src={item.icon}
                      alt=""
                      width={34}
                      height={34}
                    />
                  </div>
                  </HtmlTooltip>
                  {/* Label */}
                  <Body
                    htmlTag="span"
                    size='xs'
                    style={{
                      maxWidth: '88px',
                      lineHeight: '1.2'
                    }}>
                    {item.label}
                  </Body>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

export default CircleVisualization;
