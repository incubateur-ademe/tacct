import styles from '../metabase.module.scss';

export const InfoBulle = ({
  couleur,
  libelle,
  valeur
}: {
  couleur: string;
  libelle: string;
  valeur: string;
}) => (
  <div className={styles.infoBulle}>
    <span className={styles.pastille} style={{ background: couleur }} aria-hidden="true" />
    <span>{libelle}</span>
    <strong>{valeur}</strong>
  </div>
);
