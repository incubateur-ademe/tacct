'use client';

import { ecrirePeriode, libellePeriode, lirePeriode, type Periode } from '@/lib/queries/metabase/periode';
import { useEffect, useId, useRef, useState } from 'react';
import styles from './metabase.module.scss';

const MOIS_PROPOSES = [3, 6, 12];

type Mode = 'tout' | 'mois' | 'relative' | 'dates';

const modeDe = (periode: Periode): Mode => {
  if (periode.type === 'relative') return periode.mois === 0 ? 'mois' : 'relative';
  return periode.type;
};

export const FiltrePeriode = ({
  valeur,
  onChange
}: {
  valeur: string;
  onChange: (valeur: string) => void;
}) => {
  const periode = lirePeriode(valeur) ?? { type: 'tout' };
  const [ouvert, setOuvert] = useState(false);
  const [mode, setMode] = useState<Mode>(modeDe(periode));
  const [debut, setDebut] = useState(periode.type === 'dates' ? (periode.debut ?? '') : '');
  const [fin, setFin] = useState(periode.type === 'dates' ? (periode.fin ?? '') : '');
  const conteneur = useRef<HTMLDivElement>(null);
  const id = useId();

  useEffect(() => {
    if (!ouvert) return;
    const clicExterieur = (e: MouseEvent) => {
      if (e.target instanceof Node && !conteneur.current?.contains(e.target)) setOuvert(false);
    };
    const echap = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOuvert(false);
    };
    document.addEventListener('mousedown', clicExterieur);
    document.addEventListener('keydown', echap);
    return () => {
      document.removeEventListener('mousedown', clicExterieur);
      document.removeEventListener('keydown', echap);
    };
  }, [ouvert]);

  const inclureMoisEnCours = periode.type === 'relative' ? periode.inclureMoisEnCours : false;
  const moisActuels = periode.type === 'relative' && periode.mois > 0 ? periode.mois : null;

  const choisir = (nouvelle: Periode) => {
    setMode(modeDe(nouvelle));
    onChange(ecrirePeriode(nouvelle));
  };

  const appliquerDates = () => {
    if (!debut && !fin) return;
    choisir({ type: 'dates', debut: debut || null, fin: fin || null });
    setOuvert(false);
  };

  return (
    <div ref={conteneur} className={styles.filtre}>
      <button
        type="button"
        className={styles.boutonFiltre}
        aria-expanded={ouvert}
        aria-controls={`${id}-panneau`}
        onClick={() => setOuvert((etat) => !etat)}
      >
        <span className={styles.boutonFiltreEtiquette}>Période</span>
        <span>{libellePeriode(periode)}</span>
      </button>
      {ouvert && (
        <div id={`${id}-panneau`} className={styles.panneauFiltre}>
          <fieldset className={styles.groupeFiltre}>
            <legend className={styles.legendeFiltre}>Période</legend>
            <label className={styles.optionFiltre}>
              <input type="radio" name={`${id}-mode`} checked={mode === 'tout'} onChange={() => choisir({ type: 'tout' })} />
              Toute la période
            </label>
            <label className={styles.optionFiltre}>
              <input
                type="radio"
                name={`${id}-mode`}
                checked={mode === 'mois'}
                onChange={() => choisir({ type: 'relative', mois: 0, inclureMoisEnCours: true })}
              />
              Mois en cours
            </label>
            {MOIS_PROPOSES.map((mois) => (
              <label key={mois} className={styles.optionFiltre}>
                <input
                  type="radio"
                  name={`${id}-mode`}
                  checked={mode === 'relative' && moisActuels === mois}
                  onChange={() => choisir({ type: 'relative', mois, inclureMoisEnCours })}
                />
                {mois} derniers mois
              </label>
            ))}
            <label className={`${styles.optionFiltre} ${styles.optionSecondaire}`}>
              <input
                type="checkbox"
                checked={inclureMoisEnCours}
                disabled={moisActuels === null}
                onChange={(e) =>
                  moisActuels !== null &&
                  choisir({ type: 'relative', mois: moisActuels, inclureMoisEnCours: e.target.checked })
                }
              />
              Inclure le mois en cours
            </label>
            <label className={styles.optionFiltre}>
              <input type="radio" name={`${id}-mode`} checked={mode === 'dates'} onChange={() => setMode('dates')} />
              Dates personnalisées
            </label>
          </fieldset>
          {mode === 'dates' && (
            <div className={styles.datesFiltre}>
              <label className={styles.champDate}>
                Du
                <input type="date" value={debut} max={fin || undefined} onChange={(e) => setDebut(e.target.value)} />
              </label>
              <label className={styles.champDate}>
                Au
                <input type="date" value={fin} min={debut || undefined} onChange={(e) => setFin(e.target.value)} />
              </label>
              <button type="button" className={styles.boutonAppliquer} onClick={appliquerDates} disabled={!debut && !fin}>
                Appliquer
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
