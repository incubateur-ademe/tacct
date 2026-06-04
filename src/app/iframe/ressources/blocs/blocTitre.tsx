import { H1 } from "@/design-system/base/Textes";
import { NewContainer } from "@/design-system/layout";
import styles from '../ressources.module.scss';

export const BlocTitre = () => {
  return (
    <div className={styles.ressourcesTitreContainer}>
      <NewContainer size="xl" style={{ padding: 0, position: "relative", zIndex: 1 }}>
        <H1
          style={{
            fontSize: "22px",
            color: "var(--boutons-primaire-1)"
          }}
        >
          Bienvenue dans votre boîte à outils !
        </H1>
      </NewContainer>
    </div>
  )
};
