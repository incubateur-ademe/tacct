'use client';

import { Body, H2 } from '@/design-system/base/Textes';
import {
  rechercheDuType,
  TypeTerritoire,
  TYPES_TERRITOIRE
} from '@/lib/questionnaire-de-connexion/types';
import { Fragment, KeyboardEvent, RefObject } from 'react';
import { ChampTexte } from './ChampTexte';
import { COULEURS } from './couleurs';
import styles from './questionnaire.module.scss';
import { STYLE_TITRE_QUESTION } from './stylesTitres';
import { BarreDeRechercheTerritoire } from './recherche/BarreDeRechercheTerritoire';
import { LIBELLE_TERRITOIRE_ABSENT } from './recherche/fonctions';

interface Props {
  titreRef: RefObject<HTMLHeadingElement | null>;
  typeTerritoire: TypeTerritoire | null;
  territoireLibelle: string;
  territoireCode: string;
  territoireAutre: string;
  territoireAbsent: boolean;
  erreurRecherche: boolean;
  erreurTexte?: string;
  onChangementType: (type: TypeTerritoire) => void;
  onSelectionTerritoire: (territoire: { code: string; libelle: string }) => void;
  onReinitialisationRecherche: () => void;
  onTerritoireAbsent: () => void;
  onChangementTerritoireAutre: (valeur: string) => void;
}

export const QuestionTerritoire = ({
  titreRef,
  typeTerritoire,
  territoireLibelle,
  territoireCode,
  territoireAutre,
  territoireAbsent,
  erreurRecherche,
  erreurTexte,
  onChangementType,
  onSelectionTerritoire,
  onReinitialisationRecherche,
  onTerritoireAbsent,
  onChangementTerritoireAutre
}: Props) => {
  const typeRecherche = rechercheDuType(typeTerritoire);

  const onNavigationClavier = (event: KeyboardEvent<HTMLDivElement>) => {
    const touches = ['ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft'];
    if (!touches.includes(event.key)) return;
    event.preventDefault();
    const valeurs = TYPES_TERRITOIRE.map((option) => option.value);
    const indexCourant = typeTerritoire ? valeurs.indexOf(typeTerritoire) : 0;
    const sens =
      event.key === 'ArrowDown' || event.key === 'ArrowRight' ? 1 : -1;
    const suivant =
      valeurs[(indexCourant + sens + valeurs.length) % valeurs.length];
    onChangementType(suivant);
    event.currentTarget
      .querySelector<HTMLButtonElement>(`[data-type="${suivant}"]`)
      ?.focus();
  };

  return (
    <>
      <H2
        ref={titreRef}
        tabIndex={-1}
        style={STYLE_TITRE_QUESTION}
      >
        À quel territoire êtes-vous rattaché·e&nbsp;?
      </H2>

      <div className={styles.blocTerritoire}>
        <div>
          <div
            role="radiogroup"
            aria-label="Type de territoire"
            className={styles.pills}
            onKeyDown={onNavigationClavier}
          >
            {TYPES_TERRITOIRE.map((option, index) => (
              <Fragment key={option.value}>
                <button
                  type="button"
                  role="radio"
                  aria-checked={typeTerritoire === option.value}
                  data-type={option.value}
                  tabIndex={
                    typeTerritoire === option.value ||
                    (!typeTerritoire && index === 0)
                      ? 0
                      : -1
                  }
                  className={`${styles.pill} ${
                    typeTerritoire === option.value
                      ? styles.pillSelectionnee
                      : ''
                  }`}
                  onClick={() => onChangementType(option.value)}
                >
                  <Body
                    htmlTag="span"
                    size="sm"
                    color={
                      typeTerritoire === option.value
                        ? COULEURS.texteTitre
                        : COULEURS.texteCorps
                    }
                    weight={
                      typeTerritoire === option.value ? 'medium' : 'regular'
                    }
                  >
                    {option.label}
                  </Body>
                </button>
                {'sautDeLigne' in option && option.sautDeLigne && (
                  <div className={styles.sautDeLigne} />
                )}
              </Fragment>
            ))}
          </div>
        </div>

        {typeTerritoire && (
          <div aria-live="polite">
            {typeRecherche ? (
              <div className={styles.champ}>
                <Body weight="medium" color={COULEURS.texteTitre}>
                  Précisez votre territoire
                </Body>
                <BarreDeRechercheTerritoire
                  key={typeRecherche}
                  typeRecherche={typeRecherche}
                  libelleInitial={
                    territoireAbsent
                      ? LIBELLE_TERRITOIRE_ABSENT
                      : territoireLibelle
                  }
                  codeInitial={territoireAbsent ? '' : territoireCode}
                  enErreur={erreurRecherche}
                  onSelection={onSelectionTerritoire}
                  onReinitialisation={onReinitialisationRecherche}
                  onTerritoireAbsent={onTerritoireAbsent}
                />
                {erreurRecherche && (
                  <div role="alert">
                    <Body size="sm" color={COULEURS.texteErreur}>
                      Veuillez sélectionner votre territoire, ou indiquer qu’il
                      n’apparaît pas.
                    </Body>
                  </div>
                )}
                {territoireAbsent && (
                  <div style={{ marginTop: '0.875rem' }}>
                    <ChampTexte
                      label="Nom de votre territoire"
                      placeholder="Précisez le nom de votre territoire"
                      value={territoireAutre}
                      onChange={onChangementTerritoireAutre}
                      erreur={erreurTexte}
                      autoFocus
                    />
                  </div>
                )}
              </div>
            ) : (
              <ChampTexte
                label="Précisez votre territoire"
                placeholder="Précisez le nom de votre territoire"
                value={territoireAutre}
                onChange={onChangementTerritoireAutre}
                erreur={erreurTexte}
                autoFocus
              />
            )}
          </div>
        )}
      </div>
    </>
  );
};
