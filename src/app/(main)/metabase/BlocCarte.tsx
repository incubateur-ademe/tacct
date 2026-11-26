'use client';

import { GRANULARITES, type Granularite } from '@/lib/queries/metabase/periode';
import type { ResultatCarte } from '@/lib/queries/metabase/types';
import { useEffect, useId, useState } from 'react';
import { FiltrePeriode } from './FiltrePeriode';
import styles from './metabase.module.scss';
import { TexteMarkdown } from './TexteMarkdown';
import type { BlocCarte as ConfigCarte } from './types';
import { Barres } from './visualisations/Barres';
import { ChiffreCle } from './visualisations/ChiffreCle';
import { Courbe } from './visualisations/Courbe';
import { Donut } from './visualisations/Donut';
import { Tableau } from './visualisations/Tableau';

type Reponse = { cle: string; resultat: ResultatCarte } | { cle: string; erreur: 'delai' | 'echec' };

const MESSAGES_ERREUR = {
  delai: 'La requête a dépassé le délai maximum de 30 secondes.',
  echec: 'La requête a échoué.'
};

const Visualisation = ({ config, resultat }: { config: ConfigCarte; resultat: ResultatCarte }) => {
  const visualisation = config.visualisation;
  switch (visualisation.type) {
    case 'chiffre':
      return <ChiffreCle resultat={resultat} />;
    case 'tableau':
      return <Tableau resultat={resultat} colonnes={visualisation.colonnes} ordre={visualisation.ordre} />;
    case 'barres':
      return <Barres resultat={resultat} {...visualisation} />;
    case 'courbe':
      return <Courbe resultat={resultat} {...visualisation} />;
    case 'donut':
      return <Donut resultat={resultat} {...visualisation} />;
  }
};

const Description = ({ texte, id }: { texte: string; id: string }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!visible) return;
    const echap = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setVisible(false);
    };
    document.addEventListener('keydown', echap);
    return () => document.removeEventListener('keydown', echap);
  }, [visible]);

  return (
    <div className={styles.info} onMouseEnter={() => setVisible(true)} onMouseLeave={() => setVisible(false)}>
      <button
        type="button"
        className={styles.boutonInfo}
        aria-label="Description"
        aria-describedby={id}
        onFocus={() => setVisible(true)}
        onBlur={() => setVisible(false)}
      >
        <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
          <circle cx="8" cy="8" r="7.25" fill="none" stroke="currentColor" strokeWidth="1.25" />
          <circle cx="8" cy="4.9" r="0.95" fill="currentColor" />
          <path d="M8 7.25v4.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
      <div id={id} role="tooltip" className={styles.infoDescription} hidden={!visible}>
        <TexteMarkdown texte={texte} />
      </div>
    </div>
  );
};

export const BlocCarte = ({ config }: { config: ConfigCarte }) => {
  const [periode, setPeriode] = useState(config.periode);
  const [granularite, setGranularite] = useState<Granularite>(config.granularite ?? 'month');
  const [reponse, setReponse] = useState<Reponse | null>(null);
  const id = useId();

  const parametres = new URLSearchParams({ granularite });
  if (periode) parametres.set('periode', periode);
  if (config.periodeEtape2) parametres.set('periodeEtape2', config.periodeEtape2);
  const cle = `${config.carte}?${parametres.toString()}`;

  useEffect(() => {
    const controleur = new AbortController();
    fetch(`/api/metabase/cartes/${cle}`, { signal: controleur.signal })
      .then(async (r) => {
        if (r.ok) setReponse({ cle, resultat: (await r.json()) as ResultatCarte });
        else setReponse({ cle, erreur: r.status === 504 ? 'delai' : 'echec' });
      })
      .catch(() => {
        if (!controleur.signal.aborted) setReponse({ cle, erreur: 'echec' });
      });
    return () => controleur.abort();
  }, [cle]);

  const aJour = reponse?.cle === cle ? reponse : null;
  const resultat = aJour && 'resultat' in aJour ? aJour.resultat : null;
  const estTableau = config.visualisation.type === 'tableau';

  return (
    <section className={styles.carte} aria-labelledby={`${id}-titre`} aria-busy={!aJour}>
      <header className={styles.carteEntete}>
        <div className={styles.carteTitres}>
          <h3 id={`${id}-titre`} className={styles.carteTitre}>
            {config.titre}
          </h3>
          {config.description && <Description texte={config.description} id={`${id}-description`} />}
        </div>
        {(config.granulariteModifiable || periode !== undefined) && (
          <div className={styles.carteFiltres}>
            {config.granulariteModifiable && (
              <label className={styles.filtreGranularite}>
                <span className={styles.boutonFiltreEtiquette}>Granularité</span>
                <select value={granularite} onChange={(e) => setGranularite(e.target.value as Granularite)}>
                  {GRANULARITES.map((g) => (
                    <option key={g.valeur} value={g.valeur}>
                      {g.libelle}
                    </option>
                  ))}
                </select>
              </label>
            )}
            {periode !== undefined && <FiltrePeriode valeur={periode} onChange={setPeriode} />}
          </div>
        )}
      </header>
      <div className={styles.carteCorps}>
        {!aJour && (
          <div className={styles.chargement} role="status">
            <span>Chargement…</span>
            <span className={styles.spinner} aria-hidden="true" />
          </div>
        )}
        {aJour && 'erreur' in aJour && (
          <p className={`${styles.etat} ${styles.etatErreur}`}>{MESSAGES_ERREUR[aJour.erreur]}</p>
        )}
        {resultat && resultat.lignes.length === 0 && <p className={styles.etat}>Aucune donnée sur cette période.</p>}
        {resultat && resultat.lignes.length > 0 && <Visualisation config={config} resultat={resultat} />}
      </div>
      {resultat && estTableau && resultat.lignes.length > 0 && (
        <p className={styles.cartePied}>
          {resultat.tronque
            ? `Seules les ${resultat.lignes.length.toLocaleString('fr-FR')} premières lignes sont affichées`
            : `${resultat.lignes.length.toLocaleString('fr-FR')} ligne${resultat.lignes.length > 1 ? 's' : ''}`}
        </p>
      )}
    </section>
  );
};
