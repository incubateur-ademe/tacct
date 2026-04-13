"use client";

import ChatChercheur from '@/assets/images/chat_sherlock.png';
import { BoutonPrimaireClassic } from '@/design-system/base/Boutons';
import { Body, H3 } from "@/design-system/base/Textes";
import { handleRedirection } from '@/hooks/Redirections';
import Image, { StaticImageData } from "next/image";
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import styles from '../patch4c.module.scss';

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

export const AnalyseSensibilite = ({
  item,
  isMap,
}: {
  item: Item,
  isMap: boolean,
}) => {
  const searchParams = useSearchParams();
  const code = searchParams.get('code')!;
  const libelle = searchParams.get('libelle')!;
  const type = searchParams.get('type')!;
  const aggravationLevel = item.value;

  const redirectionExplorerMesDonnees = () => {
    const url = handleRedirection({
      searchCode: code,
      searchLibelle: libelle,
      typeTerritoire: type as 'epci' | 'commune' | 'petr' | 'pnr' | 'departement' | 'ept',
      page: 'thematiques',
    });
    window.open(url, '_blank');
  };

  return (
    <div className={styles.analyseSensibiliteContainer}>
      {
        (isMap || aggravationLevel === "Aggravation forte" || aggravationLevel === "Aggravation très forte") && (
          <div className={styles.titreWrapper}>
            <div className={styles.left}>
              <H3 style={{ fontSize: 22 }}>
                Analyse de la sensibilité : les thématiques à traiter impérativement
              </H3>
              <div className={styles.separator} />
              <Body style={{ marginTop: '1rem' }}>
                Voici quelques pistes de thématiques à aborder lors de l’analyse de la sensibilité,
                mais celle-ci reste à effectuer en fonction de vos dynamiques territoriales, des
                actions déjà entreprises et de vos capacités d’adaptation.
              </Body>
            </div>
            <Image
              src={ChatChercheur}
              alt="illustration chat chercheur"
              style={{ height: 'auto', width: 'auto', maxHeight: 104 }}
            />
          </div>
        )
      }
      {/* Différents conseils selon le type de territoire */}
      {
        isMap ? (
          <div className={styles.themesListeMap}>
            <div className={styles.themesListe}>
              <div className={styles.titre}>
                <div
                  className={styles.circleIndicator}
                  style={{ backgroundColor: '#FF1C64' }}
                />
                <div
                  className={styles.circleIndicator}
                  style={{
                    backgroundColor: '#FFB181',
                  }}
                />
                <Body weight="bold">
                  Aggravation très forte ou forte
                </Body>
              </div>
              <div className={styles.linkedThemes} style={{ lineHeight: "1.5rem" }}>
                <ul>
                  {item.linkedThemes.map((theme, index) => (
                    <li key={index}>
                      <Body>
                        {theme}
                      </Body>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            {
              item.themesSansAggravation && (
                <div className={styles.themesListe}>
                  <div className={styles.titre}>
                    <div
                      className={styles.circleIndicator}
                      style={{ backgroundColor: '#FFEBB6' }}
                    />
                    <div
                      className={styles.circleIndicator}
                      style={{
                        backgroundColor: '#FFF',
                        border: '1px solid black'
                      }}
                    />
                    <Body weight="bold">
                      Aggravation modérée ou pas d'évolution
                    </Body>
                  </div>
                  <div className={styles.linkedThemes} style={{ lineHeight: "1.5rem" }}>
                    <ul >
                      {
                        item.themesSansAggravation.map((theme, index) => (
                          <li key={index}>
                            <Body>
                              {theme}
                            </Body>
                          </li>
                        ))
                      }
                    </ul>
                  </div>
                </div>
              )
            }
          </div>
        ) : (
          <div className={styles.themesListe}>
            <div className={styles.titre}>
              <div
                className={styles.circleIndicator}
                style={{ backgroundColor: aggravationLevel?.includes('fort') ? '#FF1C64' : '#FFEBB6' }}
              />
              <div
                className={styles.circleIndicator}
                style={{
                  backgroundColor: aggravationLevel?.includes('fort') ? '#FFB181' : '#FFF',
                  border: aggravationLevel?.includes('fort') ? 'none' : '1px solid black'
                }}
              />
              <Body weight="bold">
                Aggravation {
                  aggravationLevel === "Aggravation forte" || aggravationLevel === "Aggravation très forte"
                    ? "très forte ou forte"
                    : 'modérée ou pas d\'évolution'
                }
              </Body>
            </div>
            <div className={styles.linkedThemes}>
              <ul >
                {(aggravationLevel === "Aggravation forte" || aggravationLevel === "Aggravation très forte")
                  && item.linkedThemes.map((theme, index) => (
                    <li key={index}>
                      <Body>
                        {theme}
                      </Body>
                    </li>
                  ))}
              </ul>
              {(aggravationLevel === "Aggravation modérée" || aggravationLevel === "Pas d'évolution")
                && item.themesSansAggravationEpciCommunes
                && item.themesSansAggravationEpciCommunes.map((theme, index) => (
                  <Body key={index} style={{ lineHeight: 1.6 }}>
                    {theme}
                  </Body>
                ))}
            </div>
          </div>
        )
      }

      <div style={{ alignSelf: "flex-end" }}>
        <BoutonPrimaireClassic
          text='Explorer les facteurs de sensibilité du territoire →'
          size='md'
          onClick={redirectionExplorerMesDonnees}
        />
      </div>
      {
        (aggravationLevel === "Aggravation forte" || aggravationLevel === "Aggravation très forte")
        && (
          <div className={styles.actionsListeWrapper}>
            <Body weight="bold" style={{ marginBottom: '0.5rem' }}>
              Pistes d’actions
            </Body>
            {item.actions.map((action, index) => (
              <div key={index} style={{ lineHeight: "2rem" }}>
                <Link href={action.link} target="_blank" className={styles.actionLink}>
                  {action.title}
                </Link>
              </div>
            ))}
          </div>
        )
      }


    </div>
  );
}
