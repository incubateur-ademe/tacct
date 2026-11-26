'use client';

import type { CSSProperties } from 'react';
import { BlocCarte } from './BlocCarte';
import styles from './metabase.module.scss';
import { TexteMarkdown } from './TexteMarkdown';
import type { Bloc } from './types';

type StyleCellule = CSSProperties & {
  '--colonne': number;
  '--largeur': number;
  '--ligne': number;
  '--hauteur': number;
};

const ContenuBloc = ({ bloc }: { bloc: Bloc }) => {
  switch (bloc.type) {
    case 'titre':
      return <h2 className={styles.titreSection}>{bloc.texte}</h2>;
    case 'texte':
      return <TexteMarkdown texte={bloc.texte} className={styles.blocTexte} />;
    case 'carte':
      return <BlocCarte config={bloc} />;
  }
};

export const Grille = ({ blocs }: { blocs: Bloc[] }) => {
  const tries = [...blocs].sort(
    (a, b) => a.position.ligne - b.position.ligne || a.position.colonne - b.position.colonne
  );
  return (
    <div className={styles.grille}>
      {tries.map((bloc) => {
        const style: StyleCellule = {
          '--colonne': bloc.position.colonne + 1,
          '--largeur': bloc.position.largeur,
          '--ligne': bloc.position.ligne + 1,
          '--hauteur': bloc.position.hauteur
        };
        return (
          <div
            key={`${bloc.position.ligne}-${bloc.position.colonne}`}
            className={`${styles.cellule} ${bloc.type === 'carte' ? styles.celluleCarte : ''}`}
            style={style}
          >
            <ContenuBloc bloc={bloc} />
          </div>
        );
      })}
    </div>
  );
};
