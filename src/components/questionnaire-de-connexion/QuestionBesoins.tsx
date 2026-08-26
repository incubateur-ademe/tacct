'use client';

import { Body, H2 } from '@/design-system/base/Textes';
import {
  Besoin,
  BESOINS,
  NOMBRE_BESOINS
} from '@/lib/questionnaire-de-connexion/types';
import { RefObject } from 'react';
import { CarteReponse } from './CarteReponse';
import { ChampTexte } from './ChampTexte';
import { COULEURS } from './couleurs';
import styles from './questionnaire.module.scss';
import { STYLE_TITRE_QUESTION } from './stylesTitres';

interface Props {
  titreRef: RefObject<HTMLHeadingElement | null>;
  besoins: Besoin[];
  besoinAutre: string;
  messageAlerte?: string;
  erreurBesoinAutre?: string;
  onBascule: (besoin: Besoin) => void;
  onChangementBesoinAutre: (valeur: string) => void;
}

export const QuestionBesoins = ({
  titreRef,
  besoins,
  besoinAutre,
  messageAlerte,
  erreurBesoinAutre,
  onBascule,
  onChangementBesoinAutre
}: Props) => (
  <>
    <H2
      id="titre-besoins"
      ref={titreRef}
      tabIndex={-1}
      style={STYLE_TITRE_QUESTION}
    >
      Quels sont vos besoins prioritaires&nbsp;?
    </H2>

    <Body weight="medium" color={COULEURS.texteTitre} margin="0 0 1rem">
      Cliquez sur {NOMBRE_BESOINS} réponses, dans votre ordre de priorité.
    </Body>

    {messageAlerte && (
      <div role="alert" className={styles.alerte}>
        <Body size="sm" color={COULEURS.texteErreur}>
          {messageAlerte}
        </Body>
      </div>
    )}

    <div
      role="group"
      aria-labelledby="titre-besoins"
      className={styles.listeBesoins}
    >
      {BESOINS.map((option) => {
        const rang = besoins.indexOf(option.value);
        const cochee = rang >= 0;
        return (
          <CarteReponse
            key={option.value}
            role="checkbox"
            label={option.label}
            valeur={option.value}
            selectionnee={cochee}
            desactivee={!cochee && besoins.length >= NOMBRE_BESOINS}
            rang={cochee ? rang + 1 : undefined}
            onActivation={() => onBascule(option.value)}
          />
        );
      })}
    </div>

    {besoins.includes('autre') && (
      <div style={{ marginTop: '0.875rem' }}>
        <ChampTexte
          label="Précisez votre besoin"
          placeholder="Précisez votre besoin"
          value={besoinAutre}
          onChange={onChangementBesoinAutre}
          erreur={erreurBesoinAutre}
        />
      </div>
    )}
  </>
);
