"use client";

import patch4Formula from '@/assets/images/patch4_formula.svg';
import { ChevronDownIcon } from "@/design-system/base/BaseIcons";
import { Body } from "@/design-system/base/Textes";
import Image, { StaticImageData } from "next/image";
import { useState } from "react";
import styles from '../patch4c.module.scss';
import { getBackgroundColor } from "./fonctions";

type Item = {
  value: string | null;
  icon: StaticImageData;
  label: string;
  definition: string;
  linkedThemes: string[];
  themesSansAggravation: string[] | null;
  themesSansAggravationEpciCommunes: string[] | null;
  actions: ({
    title: string;
    link: string;
    image: StaticImageData;
  } | {
    title: string;
    link: string;
    image: null;
  }
  )[]
};

export const AleaExplications = ({
  item,
  isMap
}: {
  item: Item,
  isMap: boolean
}) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <div
        className={`${styles.aleaExplicationsContainer} ${isOpen ? styles.aleaExplicationsContainerOpen : ''}`}
      >
        <div className={styles.aleaAggravationWrapper}>
          {/* Circle with icon */}
          <div
            className={styles.CircleItem}
            style={{
              backgroundColor: isMap ? "#E7E5E5" : getBackgroundColor(item.value),
            }}
          >
            <Image
              src={item.icon}
              alt={item.label}
              width={36}
              height={36}
            />
          </div>
          {/* Labels */}
          <div className={styles.aleaAggravationTexte}>
            <Body
              weight='bold'
              style={{
                fontSize: "22px"
              }}
            >
              {item.label}
            </Body>
            <Body>
              {!isMap ? item.value : 'Niveau d\'aggravation de l\'aléa par commune'}
            </Body>
          </div>
        </div>
        <div
          className={styles.aleaExplicationsToggle}
          onClick={() => setIsOpen(!isOpen)}
        >
          <Body
            style={{
              color: "var(--principales-vert)",
              fontWeight: 500
            }}
          >
            {isOpen ? 'Masquer les explications' : 'Afficher plus d\'explications'}
          </Body>
          <ChevronDownIcon
            transform={isOpen ? 'rotate(180deg)' : 'rotate(0deg)'}
            transition='transform 0.3s ease'
          />
        </div>
      </div>
      <div className={`${styles.aleaExplicationsContentWrapper} ${isOpen ? styles.aleaExplicationsContentWrapperOpen : ''}`}>
        <div className={styles.aleaExplicationsContent}>
          <Body weight="bold" style={{ marginBottom: '0.5rem' }}>
            Calcul de l'indice
          </Body>
          <Body>
            {item.definition}
          </Body>
          {/* {
            !isMap && (
              <>
                <Body weight="bold" style={{ margin: '2rem 0 0.5rem' }}>
                  Niveau d’aggravation
                </Body>
                <Body>
                  {agravationItems.find(agr => agr.label === item.value)?.hover}
                </Body>
              </>
            )
          } */}
          <Body weight="bold" style={{ margin: '2rem 0 0.5rem' }}>
            D'où vient cette donnée ?
          </Body>
          <Body>
            Ces indices représentent chacun l’aggravation de l’évolution d’un phénomène
            climatique précis, en 2100 par rapport à 2050. <br />À partir des données de la TRACC,
            le calcul de l’indice d’aggravation est effectué sur la valeur médiane de certains
            indicateurs de Climadiag Commune, aux 3 échéances : 2030, 2050 et 2100. Le cas
            échéant, les indicateurs saisonniers ont été cumulés pour en faire des indicateurs
            annuels. Lorsque plusieurs indicateurs sont disponibles pour un même aléa, le
            niveau d’évolution considéré est la valeur maximale de l’indicateur.
          </Body>
          <Image src={patch4Formula} alt="" height={80} style={{ margin: "0.5rem 0" }} />
          <Body>
            Retrouvez vos indicateurs climatiques détaillés sur le portail{' '}
            <a
              href="https://meteofrance.com/climadiag-commune"
              target="_blank"
              rel="noopener noreferrer"
            >
              Climadiag Communes
            </a>
            {" "}de Météo France.
          </Body>
        </div>
      </div>
    </>
  );
}
