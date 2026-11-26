import type { ResultatCarte, Valeur } from '@/lib/queries/metabase/types';
import styles from '../metabase.module.scss';
import { formaterValeur } from '../formatage';
import type { ColonneTableau } from '../types';

const LONGUEUR_INFOBULLE = 40;

const Cellule = ({ valeur, suffixe }: { valeur: Valeur; suffixe?: string }) => {
  if (typeof valeur === 'string' && /^https?:\/\//.test(valeur)) {
    return (
      <a
        href={valeur}
        target="_blank"
        rel="noopener noreferrer"
        title={valeur}
        className={`${styles.texteCellule} ${styles.lienTableau}`}
      >
        {valeur}
      </a>
    );
  }
  const texte = formaterValeur(valeur, suffixe);
  return (
    <span className={styles.texteCellule} title={texte.length > LONGUEUR_INFOBULLE ? texte : undefined}>
      {texte}
    </span>
  );
};

export const Tableau = ({
  resultat,
  colonnes = {},
  ordre
}: {
  resultat: ResultatCarte;
  colonnes?: Record<string, ColonneTableau>;
  ordre?: string[];
}) => {
  const visibles = (ordre ?? resultat.colonnes).filter((nom) => resultat.colonnes.includes(nom));
  return (
    <div className={styles.tableauConteneur} tabIndex={0}>
      <table className={styles.tableau}>
        <thead>
          <tr>
            {visibles.map((nom) => (
              <th key={nom} scope="col">
                {colonnes[nom]?.titre ?? nom}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {resultat.lignes.map((ligne, index) => (
            <tr key={index}>
              {visibles.map((nom) => (
                <td key={nom} className={typeof ligne[nom] === 'number' ? styles.celluleNombre : undefined}>
                  <Cellule valeur={ligne[nom]} suffixe={colonnes[nom]?.suffixe} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
