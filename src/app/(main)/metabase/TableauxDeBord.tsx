'use client';

import { Onglets } from '@/design-system/base/Onglets';
import { useState } from 'react';
import { Grille } from './Grille';
import styles from './metabase.module.scss';
import { TABLEAUX_DE_BORD } from './configuration';

export const TableauxDeBord = () => {
  const [actif, setActif] = useState(TABLEAUX_DE_BORD[0].nom);
  const [visites, setVisites] = useState<string[]>([TABLEAUX_DE_BORD[0].nom]);

  const changer = (nom: string) => {
    setActif(nom);
    setVisites((precedents) => (precedents.includes(nom) ? precedents : [...precedents, nom]));
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
        {TABLEAUX_DE_BORD.filter((tableau) => visites.includes(tableau.nom)).map((tableau) => (
          <div key={tableau.id} hidden={tableau.nom !== actif}>
            <Grille blocs={tableau.blocs} />
          </div>
        ))}
      </div>
    </Onglets>
  );
};
