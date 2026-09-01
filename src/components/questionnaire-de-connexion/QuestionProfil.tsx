'use client';

import { Body, H1, H2 } from '@/design-system/base/Textes';
import { Profil, PROFILS } from '@/lib/questionnaire-de-connexion/types';
import { KeyboardEvent, RefObject } from 'react';
import { CarteReponse } from './CarteReponse';
import { ChampTexte } from './ChampTexte';
import { COULEURS } from './couleurs';
import styles from './questionnaire.module.scss';
import { STYLE_TITRE_QUESTION } from './stylesTitres';

interface Props {
  titreRef: RefObject<HTMLHeadingElement | null>;
  profil: Profil | null;
  profilAutre: string;
  erreurProfilAutre?: string;
  /** Clic, Entrée ou Espace : valide la réponse et enchaîne. */
  onSelection: (profil: Profil) => void;
  /** Flèches : déplace la sélection sans valider. */
  onDeplacementClavier: (profil: Profil) => void;
  onChangementProfilAutre: (valeur: string) => void;
}

export const QuestionProfil = ({
  titreRef,
  profil,
  profilAutre,
  erreurProfilAutre,
  onSelection,
  onDeplacementClavier,
  onChangementProfilAutre
}: Props) => {
  const onNavigationClavier = (event: KeyboardEvent<HTMLDivElement>) => {
    const touches = ['ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft'];
    if (!touches.includes(event.key)) return;
    event.preventDefault();
    const valeurs = PROFILS.map((option) => option.value);
    const indexCourant = profil ? valeurs.indexOf(profil) : 0;
    const sens =
      event.key === 'ArrowDown' || event.key === 'ArrowRight' ? 1 : -1;
    const suivant =
      valeurs[(indexCourant + sens + valeurs.length) % valeurs.length];
    onDeplacementClavier(suivant);
    event.currentTarget
      .querySelector<HTMLButtonElement>(`[data-valeur="${suivant}"]`)
      ?.focus();
  };

  return (
    <>
      <H1
        color={COULEURS.texteTitre}
        style={{ fontSize: '2.5rem', lineHeight: '3rem', margin: 0 }}
      >
        Bienvenue sur TACCT&nbsp;!
      </H1>
      <Body
        size="lg"
        color={COULEURS.texteCorps}
        style={{ maxWidth: '520px' }}
        margin="1rem 0 0"
      >
        Voici un rapide questionnaire pour vous proposer des contenus adaptés à votre profil (environ 2 minutes).
      </Body>

      <hr className={styles.separateur} />

      <H2
        id="titre-profil"
        ref={titreRef}
        tabIndex={-1}
        style={{ ...STYLE_TITRE_QUESTION, margin: '0 0 1.25rem' }}
      >
        Vous êtes…
      </H2>

      <div
        role="radiogroup"
        aria-labelledby="titre-profil"
        className={styles.grilleProfils}
        onKeyDown={onNavigationClavier}
      >
        {PROFILS.map((option, index) => (
          <CarteReponse
            key={option.value}
            role="radio"
            label={option.label}
            valeur={option.value}
            selectionnee={profil === option.value}
            tabIndex={
              profil === option.value || (!profil && index === 0) ? 0 : -1
            }
            onActivation={() => onSelection(option.value)}
          />
        ))}
      </div>

      {profil === 'autre' && (
        <div style={{ marginTop: '0.875rem' }}>
          <ChampTexte
            label="Précisez votre profil"
            placeholder="Ex. : particulier, association, agence d’urbanisme, université, etc."
            value={profilAutre}
            onChange={onChangementProfilAutre}
            erreur={erreurProfilAutre}
          />
        </div>
      )}
    </>
  );
};
