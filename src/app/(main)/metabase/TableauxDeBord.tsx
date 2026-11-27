'use client';

import { Onglets } from '@/design-system/base/Onglets';
import type { ResultatCarte } from '@/lib/queries/metabase/types';
import { useRef, useState } from 'react';
import { Grille } from './Grille';
import styles from './metabase.module.scss';
import { TABLEAUX_DE_BORD } from './configuration';

type Resultats = Record<string, ResultatCarte>;

const chargerResultats = async (id: number): Promise<Resultats> => {
  try {
    const reponse = await fetch(`/api/metabase/tableaux/${id}`);
    return reponse.ok ? ((await reponse.json()) as Resultats) : {};
  } catch {
    return {};
  }
};

export const TableauxDeBord = ({ initiaux }: { initiaux: Resultats }) => {
  const premier = TABLEAUX_DE_BORD[0];
  const [actif, setActif] = useState(premier.nom);
  const [resultats, setResultats] = useState<Record<number, Resultats>>({ [premier.id]: initiaux });
  const demandes = useRef(new Set([premier.id]));

  const changer = (nom: string) => {
    setActif(nom);
    const tableau = TABLEAUX_DE_BORD.find((candidat) => candidat.nom === nom);
    if (!tableau || demandes.current.has(tableau.id)) return;
    demandes.current.add(tableau.id);
    void chargerResultats(tableau.id).then((recus) =>
      setResultats((precedents) => ({ ...precedents, [tableau.id]: recus }))
    );
  };

  return (
    <Onglets
      onglets={TABLEAUX_DE_BORD.map((tableau) => ({ libelle: tableau.nom }))}
      ongletActif={actif}
      onChange={changer}
      variante="souligne"
      ariaLabel="Tableaux de bord Metabase"
    >
      <div className={styles.panneaux}>
        {TABLEAUX_DE_BORD.map((tableau) => {
          const recus = resultats[tableau.id];
          if (!recus && tableau.nom !== actif) return null;
          return (
            <div key={tableau.id} hidden={tableau.nom !== actif}>
              {recus ? (
                <Grille blocs={tableau.blocs} initiaux={recus} />
              ) : (
                <div className={styles.chargement} role="status" style={{ padding: '3rem 0' }}>
                  <span>Chargement…</span>
                  <span className={styles.spinner} aria-hidden="true" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Onglets>
  );
};
