import { Body, H1 } from "@/design-system/base/Textes";
import { NewContainer } from "@/design-system/layout";
import styles from '../patch4c.module.scss';

export const BlocTitre = () => {
  return (
    <div className={styles.patch4TitreContainer}>
      <NewContainer size="xl" style={{ padding: "0 1rem", position: "relative", zIndex: 1 }}>
        <H1
          style={{
            fontSize: "28px",
            color: "var(--boutons-primaire-1)",
            marginBottom: "0.5rem",
          }}
        >
          Patch 4°C : le tendanciel d’aggravation des aléas majeurs de votre territoire
        </H1>
        <Body color="#3D3D3D">
          Calculé par Météo France, ce nouveau jeu de données (patch 4°C) est basé sur<br />
          la trajectoire de réchauffement de référence pour l'adaptation au changement climatique (TRACC).
        </Body>
      </NewContainer>
    </div>
  )
};
