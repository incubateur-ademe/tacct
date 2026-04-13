"use client";
import { ReplaceDisplayEpci } from '@/components/searchbar/fonctions';
import { TagsSimples } from '@/design-system/base/Tags';
import { Body } from '@/design-system/base/Textes';
import { NewContainer } from '@/design-system/layout';
import { Patch4 } from "@/lib/postgres/models";
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
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
                <div
                  key={item.key}
                  className={styles.CircleItem}
                  style={{
                    left: position.x - 35,
                    top: position.y - 30,
                  }}
                  onClick={() => handleClick(item.key)}
                >
                  {/* Circle with icon */}
                  <div
                    className={styles.CircleIcon}
                    style={{
                      backgroundColor: getBackgroundColor(item.value),
                      border: selectedAleaKey === item.key ? '1px solid black' : '1px solid var(--gris-medium)',
                    }}
                  >
                    <Image
                      src={item.icon}
                      alt={item.label}
                      width={34}
                      height={34}
                    />
                  </div>
                  {/* Label */}
                  <Body
                    size='xs'
                    style={{
                      maxWidth: '88px',
                      lineHeight: '1.2'
                    }}>
                    {item.label}
                  </Body>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

export default CircleVisualization;
