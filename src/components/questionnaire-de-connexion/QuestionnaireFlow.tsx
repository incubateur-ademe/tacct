'use client';

import {
  BoutonPrimaireClassic,
  BoutonSecondaireClassic
} from '@/design-system/base/Boutons';
import { Body } from '@/design-system/base/Textes';
import {
  enregistrerBesoins,
  enregistrerBeta,
  enregistrerProfil,
  enregistrerTerritoire
} from '@/lib/queries/questionnaire-de-connexion/questionnaire';
import {
  Besoin,
  besoinsComplets,
  EtapeQuestionnaire,
  EtatQuestionnaire,
  NOMBRE_BESOINS,
  Profil,
  profilComplet,
  PROFILS,
  rechercheDuType,
  sequenceQuestions,
  territoireComplet,
  typesTerritoirePourProfil,
  TypeTerritoire,
  typeTerritoireAutorise
} from '@/lib/questionnaire-de-connexion/types';
import { useEffect, useRef, useState } from 'react';
import { BarreDeProgression } from './BarreDeProgression';
import { EcranRemerciement } from './EcranRemerciement';
import { ModaleQuitter } from './ModaleQuitter';
import { QuestionBesoins } from './QuestionBesoins';
import { QuestionBeta } from './QuestionBeta';
import { QuestionProfil } from './QuestionProfil';
import { QuestionTerritoire } from './QuestionTerritoire';
import { COULEURS } from './couleurs';
import styles from './questionnaire.module.scss';

type Ecran = EtapeQuestionnaire | 'remerciement';

type ChampEnErreur =
  | 'profilAutre'
  | 'territoire'
  | 'territoireAutre'
  | 'besoinsMin'
  | 'besoinsMax'
  | 'besoinAutre'
  | 'email'
  | 'enregistrement'
  | null;

/** Tant que le profil n'est pas choisi, la séquence n'est pas connue : on cale la
 * barre sur la plus longue pour ne pas surestimer l'avancée. */
const ETAPES_MAX = Math.max(
  ...PROFILS.map((option) => sequenceQuestions(option.value).length)
);
const DELAI_AVANCE_PROFIL = 0;
const DELAI_AVANCE_TERRITOIRE = 50;

const TITRES: Record<EtapeQuestionnaire, string> = {
  profil: 'Vous êtes',
  territoire: 'À quel territoire êtes-vous rattaché·e',
  besoins: 'Quels sont vos besoins prioritaires',
  beta: 'Souhaitez-vous tester nos nouveautés en avant-première'
};

interface Props {
  etatInitial: EtatQuestionnaire;
  etapeInitiale: EtapeQuestionnaire;
}

export const QuestionnaireFlow = ({ etatInitial, etapeInitiale }: Props) => {
  const [etat, setEtat] = useState<EtatQuestionnaire>(etatInitial);
  const [ecran, setEcran] = useState<Ecran>(etapeInitiale);
  const [champEnErreur, setChampEnErreur] = useState<ChampEnErreur>(null);
  const [enCours, setEnCours] = useState(false);
  const [modaleOuverte, setModaleOuverte] = useState(false);
  const [deconnexionEnCours, setDeconnexionEnCours] = useState(false);
  const [annonce, setAnnonce] = useState('');
  const [territoireAbsent, setTerritoireAbsent] = useState(
    !!rechercheDuType(etatInitial.typeTerritoire) &&
      !etatInitial.territoireLibelle &&
      !!etatInitial.territoireAutre
  );

  const [avanceEnAttente, setAvanceEnAttente] = useState(false);

  const minuteur = useRef<ReturnType<typeof setTimeout> | null>(null);
  const titreRef = useRef<HTMLHeadingElement | null>(null);

  const annulerMinuteur = () => {
    if (minuteur.current) clearTimeout(minuteur.current);
    minuteur.current = null;
    setAvanceEnAttente(false);
  };

  // L'avance reste « en attente » pendant l'enregistrement : `allerA` la lève au
  // changement d'écran, sinon le CTA clignote le temps de l'aller-retour serveur.
  const armerAvance = (action: () => void, delai: number) => {
    setAvanceEnAttente(true);
    minuteur.current = setTimeout(() => {
      minuteur.current = null;
      action();
    }, delai);
  };

  useEffect(() => annulerMinuteur, []);

  const sequence = sequenceQuestions(etat.profil);
  const indexEcran =
    ecran === 'remerciement' ? sequence.length : sequence.indexOf(ecran);
  const nombreEtapes = etat.profil ? sequence.length : ETAPES_MAX;
  const pourcentage =
    ecran === 'remerciement'
      ? 100
      : Math.round(((indexEcran + 1) / nombreEtapes) * 100);
  const texteProgression =
    ecran === 'remerciement'
      ? 'Questionnaire terminé'
      : etat.profil
        ? `Question ${indexEcran + 1} sur ${sequence.length}`
        : `Question ${indexEcran + 1}`;

  useEffect(() => {
    titreRef.current?.focus();
  }, [ecran]);

  const allerA = (prochain: Ecran, sequenceCourante: EtapeQuestionnaire[]) => {
    annulerMinuteur();
    setChampEnErreur(null);
    setEcran(prochain);
    setAnnonce(
      prochain === 'remerciement'
        ? 'Vos réponses sont enregistrées.'
        : `Question ${sequenceCourante.indexOf(prochain) + 1} sur ${sequenceCourante.length} : ${TITRES[prochain]}`
    );
  };

  const apresEnregistrement = (
    resultat: { ok: boolean; termine: boolean },
    etapeCourante: EtapeQuestionnaire,
    sequenceCourante: EtapeQuestionnaire[]
  ) => {
    if (!resultat.ok) {
      annulerMinuteur();
      setChampEnErreur('enregistrement');
      return;
    }
    if (resultat.termine) {
      allerA('remerciement', sequenceCourante);
      return;
    }
    const index = sequenceCourante.indexOf(etapeCourante);
    allerA(sequenceCourante[index + 1] ?? 'remerciement', sequenceCourante);
  };

  // ---- Q1 ----

  const majProfil = (profil: Profil) => {
    const nouvelleSequence = sequenceQuestions(profil);
    const territoireConserve =
      nouvelleSequence.includes('territoire') &&
      (!etat.typeTerritoire ||
        typeTerritoireAutorise(profil, etat.typeTerritoire));
    setEtat((precedent) => ({
      ...precedent,
      profil,
      profilAutre: profil === 'autre' ? precedent.profilAutre : '',
      ...(territoireConserve
        ? {}
        : {
            typeTerritoire: null,
            territoireCode: '',
            territoireLibelle: '',
            territoireAutre: ''
          }),
      ...(nouvelleSequence.includes('beta')
        ? {}
        : { optInBeta: false, emailRecontact: precedent.emailRecontact })
    }));
    if (!territoireConserve) setTerritoireAbsent(false);
    setChampEnErreur(null);
  };

  const validerProfil = async (profil: Profil, profilAutre: string) => {
    setEnCours(true);
    const resultat = await enregistrerProfil(profil, profilAutre);
    setEnCours(false);
    apresEnregistrement(resultat, 'profil', sequenceQuestions(profil));
  };

  // Les flèches parcourent la liste sans déclencher l'enchaînement : sinon on ne
  // peut pas atteindre les dernières cartes au clavier.
  const deplacerProfil = (profil: Profil) => {
    annulerMinuteur();
    majProfil(profil);
  };

  const selectionnerProfil = (profil: Profil) => {
    annulerMinuteur();
    majProfil(profil);
    if (profil === 'autre') return;
    armerAvance(() => void validerProfil(profil, ''), DELAI_AVANCE_PROFIL);
  };

  // ---- Q2 ----

  const changerTypeTerritoire = (type: TypeTerritoire) => {
    annulerMinuteur();
    setTerritoireAbsent(false);
    setChampEnErreur(null);
    setEtat((precedent) => ({
      ...precedent,
      typeTerritoire: type,
      territoireCode: '',
      territoireLibelle: '',
      territoireAutre: ''
    }));
  };

  const validerTerritoire = async (etatTerritoire: {
    typeTerritoire: TypeTerritoire;
    territoireCode: string;
    territoireLibelle: string;
    territoireAutre: string;
  }) => {
    setEnCours(true);
    const resultat = await enregistrerTerritoire(etatTerritoire);
    setEnCours(false);
    apresEnregistrement(resultat, 'territoire', sequence);
  };

  const selectionnerTerritoire = (territoire: {
    code: string;
    libelle: string;
  }) => {
    if (!etat.typeTerritoire) return;
    annulerMinuteur();
    setTerritoireAbsent(false);
    setChampEnErreur(null);
    setEtat((precedent) => ({
      ...precedent,
      territoireCode: territoire.code,
      territoireLibelle: territoire.libelle,
      territoireAutre: ''
    }));
    const typeTerritoire = etat.typeTerritoire;
    armerAvance(
      () =>
        void validerTerritoire({
          typeTerritoire,
          territoireCode: territoire.code,
          territoireLibelle: territoire.libelle,
          territoireAutre: ''
        }),
      DELAI_AVANCE_TERRITOIRE
    );
  };

  // Retaper dans le champ de recherche annule la déclaration « territoire absent ».
  const reinitialiserRecherche = () => {
    annulerMinuteur();
    setTerritoireAbsent(false);
    setEtat((precedent) => ({
      ...precedent,
      territoireCode: '',
      territoireLibelle: ''
    }));
  };

  const marquerTerritoireAbsent = () => {
    annulerMinuteur();
    setTerritoireAbsent(true);
    setChampEnErreur(null);
    setEtat((precedent) => ({
      ...precedent,
      territoireCode: '',
      territoireLibelle: ''
    }));
  };

  // ---- Q3 ----

  const basculerBesoin = (besoin: Besoin) => {
    const dejaChoisi = etat.besoins.includes(besoin);
    if (!dejaChoisi && etat.besoins.length >= NOMBRE_BESOINS) {
      setChampEnErreur('besoinsMax');
      return;
    }
    setChampEnErreur(null);
    setEtat((precedent) => ({
      ...precedent,
      besoins: dejaChoisi
        ? precedent.besoins.filter((valeur) => valeur !== besoin)
        : [...precedent.besoins, besoin]
    }));
  };

  // ---- Navigation ----

  const revenir = () => {
    annulerMinuteur();
    const index = sequence.indexOf(ecran as EtapeQuestionnaire);
    if (index > 0) allerA(sequence[index - 1], sequence);
  };

  const continuer = async () => {
    annulerMinuteur();
    if (ecran === 'profil') {
      if (!etat.profil) return;
      if (etat.profil === 'autre' && !etat.profilAutre.trim()) {
        setChampEnErreur('profilAutre');
        return;
      }
      await validerProfil(etat.profil, etat.profilAutre);
      return;
    }

    if (ecran === 'territoire') {
      if (!etat.typeTerritoire) return;
      const recherchable = rechercheDuType(etat.typeTerritoire);
      if (recherchable && !etat.territoireLibelle && !territoireAbsent) {
        setChampEnErreur('territoire');
        return;
      }
      if (!etat.territoireLibelle && !etat.territoireAutre.trim()) {
        setChampEnErreur('territoireAutre');
        return;
      }
      await validerTerritoire({
        typeTerritoire: etat.typeTerritoire,
        territoireCode: etat.territoireCode,
        territoireLibelle: etat.territoireLibelle,
        territoireAutre: etat.territoireAutre
      });
      return;
    }

    if (ecran === 'besoins') {
      if (etat.besoins.length < NOMBRE_BESOINS) {
        setChampEnErreur('besoinsMin');
        return;
      }
      if (etat.besoins.includes('autre') && !etat.besoinAutre.trim()) {
        setChampEnErreur('besoinAutre');
        return;
      }
      setEnCours(true);
      const resultat = await enregistrerBesoins(etat.besoins, etat.besoinAutre);
      setEnCours(false);
      apresEnregistrement(resultat, 'besoins', sequence);
      return;
    }

    if (ecran === 'beta') {
      if (
        etat.optInBeta &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(etat.emailRecontact.trim())
      ) {
        setChampEnErreur('email');
        return;
      }
      setEnCours(true);
      const resultat = await enregistrerBeta(
        etat.optInBeta,
        etat.emailRecontact
      );
      setEnCours(false);
      apresEnregistrement(resultat, 'beta', sequence);
    }
  };

  const quitter = () => {
    setDeconnexionEnCours(true);
    window.location.assign('/api/proconnect/logout');
  };

  // ---- Rendu ----

  // Le CTA n'apparaît que là où il doit être cliqué : les questions dont un clic
  // sur la réponse enchaîne tout seul s'en passent.
  const ctaVisible =
    ecran === 'besoins' ||
    ecran === 'beta' ||
    (ecran === 'profil' && etat.profil === 'autre') ||
    (ecran === 'territoire' &&
      !!etat.typeTerritoire &&
      (!rechercheDuType(etat.typeTerritoire) ||
        territoireAbsent ||
        (!avanceEnAttente && territoireComplet(etat))));

  const ctaDesactive =
    enCours ||
    (ecran === 'profil' && !profilComplet(etat)) ||
    (ecran === 'territoire' && !territoireComplet(etat)) ||
    (ecran === 'besoins' && !besoinsComplets(etat));

  return (
    <>
      {ecran !== 'remerciement' && (
        <BarreDeProgression
          pourcentage={pourcentage}
          texte={texteProgression}
        />
      )}

      <div className={styles.page}>
        <div aria-live="polite" className={styles.invisible}>
          <Body>{annonce}</Body>
        </div>

        {ecran !== 'remerciement' && (
          <div className={styles.quitter}>
            <BoutonSecondaireClassic
              size="md"
              sansBordure
              text="✕  Annuler et quitter"
              onClick={() => setModaleOuverte(true)}
              style={{ color: COULEURS.texteVert }}
            />
          </div>
        )}

        <div className={styles.contenu}>
          {ecran === 'profil' && (
            <QuestionProfil
              titreRef={titreRef}
              profil={etat.profil}
              profilAutre={etat.profilAutre}
              erreurProfilAutre={
                champEnErreur === 'profilAutre'
                  ? 'Veuillez préciser votre profil.'
                  : undefined
              }
              onSelection={selectionnerProfil}
              onDeplacementClavier={deplacerProfil}
              onChangementProfilAutre={(valeur) => {
                setChampEnErreur(null);
                setEtat((precedent) => ({ ...precedent, profilAutre: valeur }));
              }}
            />
          )}

          {ecran === 'territoire' && (
            <QuestionTerritoire
              titreRef={titreRef}
              typesDisponibles={typesTerritoirePourProfil(etat.profil)}
              typeTerritoire={etat.typeTerritoire}
              territoireLibelle={etat.territoireLibelle}
              territoireCode={etat.territoireCode}
              territoireAutre={etat.territoireAutre}
              territoireAbsent={territoireAbsent}
              erreurRecherche={champEnErreur === 'territoire'}
              erreurTexte={
                champEnErreur === 'territoireAutre'
                  ? 'Veuillez renseigner votre territoire.'
                  : undefined
              }
              onChangementType={changerTypeTerritoire}
              onSelectionTerritoire={selectionnerTerritoire}
              onReinitialisationRecherche={reinitialiserRecherche}
              onTerritoireAbsent={marquerTerritoireAbsent}
              onChangementTerritoireAutre={(valeur) => {
                setChampEnErreur(null);
                setEtat((precedent) => ({
                  ...precedent,
                  territoireAutre: valeur
                }));
              }}
            />
          )}

          {ecran === 'besoins' && (
            <QuestionBesoins
              titreRef={titreRef}
              besoins={etat.besoins}
              besoinAutre={etat.besoinAutre}
              messageAlerte={
                champEnErreur === 'besoinsMax'
                  ? `Vous ne pouvez sélectionner que ${NOMBRE_BESOINS} réponses. Décochez-en une pour en choisir une autre.`
                  : champEnErreur === 'besoinsMin'
                    ? `Veuillez sélectionner ${NOMBRE_BESOINS} réponses pour continuer.`
                    : undefined
              }
              erreurBesoinAutre={
                champEnErreur === 'besoinAutre'
                  ? 'Veuillez préciser votre besoin.'
                  : undefined
              }
              onBascule={basculerBesoin}
              onChangementBesoinAutre={(valeur) => {
                setChampEnErreur(null);
                setEtat((precedent) => ({ ...precedent, besoinAutre: valeur }));
              }}
            />
          )}

          {ecran === 'beta' && (
            <QuestionBeta
              titreRef={titreRef}
              optInBeta={etat.optInBeta}
              emailRecontact={etat.emailRecontact}
              erreurEmail={
                champEnErreur === 'email'
                  ? 'Veuillez renseigner une adresse email valide.'
                  : undefined
              }
              onBasculeOptIn={() =>
                setEtat((precedent) => ({
                  ...precedent,
                  optInBeta: !precedent.optInBeta
                }))
              }
              onChangementEmail={(valeur) => {
                setChampEnErreur(null);
                setEtat((precedent) => ({
                  ...precedent,
                  emailRecontact: valeur
                }));
              }}
            />
          )}

          {ecran === 'remerciement' && (
            <EcranRemerciement titreRef={titreRef} />
          )}

          {champEnErreur === 'enregistrement' && (
            <div role="alert" className={styles.alerte}>
              <Body size="sm" color={COULEURS.texteErreur}>
                L’enregistrement a échoué. Veuillez réessayer.
              </Body>
            </div>
          )}

          {ecran !== 'remerciement' && (indexEcran > 0 || ctaVisible) && (
            <div className={styles.actions}>
              {indexEcran > 0 && (
                <BoutonSecondaireClassic
                  size="md"
                  text="←  Retour"
                  onClick={revenir}
                  disabled={enCours}
                />
              )}
              {ctaVisible && (
                <BoutonPrimaireClassic
                  size="md"
                  text="Continuer  →"
                  disabled={ctaDesactive}
                  onClick={() => void continuer()}
                />
              )}
            </div>
          )}
        </div>
      </div>

      <ModaleQuitter
        isOpen={modaleOuverte}
        pending={deconnexionEnCours}
        onClose={() => setModaleOuverte(false)}
        onConfirm={quitter}
      />
    </>
  );
};
