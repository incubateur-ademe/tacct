import { CarteHoverLink } from "@/components/Cartes";
import { TacctoscopeCard } from "@/components/mon-espace/TacctoscopeCard";
import { H2 } from "@/design-system/base/Textes";
import { NewContainer } from "@/design-system/layout";
import { autresOutilsCartes } from "@/lib/ressources/cartes";
import { CRITERIA } from "@/lib/tacctoscope/content/criteria";
import styles from '../ressources.module.scss';

export const BlocAutresOutils = () => {
  return (
    <div className={styles.ressourcesAutresOutilsContainer}>
      <NewContainer size="xl" style={{ padding: "40px 0" }}>
        <div className={styles.ressourcesAutresOutilsWrapper}>
          <H2 style={{ color: "#038278", fontSize: "2.5rem", margin: 0 }}>
            Découvrez nos autres outils
          </H2>
          <div className={styles.autresOutilsColonnes}>
            <div className={styles.autresOutilsPrincipal}>
              <TacctoscopeCard
                hasAnswers={false}
                isComplete={false}
                recommendationCount={0}
                completed={0}
                started={0}
                total={CRITERIA.length}
              />
            </div>
            <div className={styles.cartesWrapper}>
              {
                autresOutilsCartes.map((carte, index) => (
                  <CarteHoverLink
                    key={index}
                    titre={carte.titre}
                    description={carte.description}
                    icone={carte.icone}
                    lien={carte.lien}
                  />
                ))
              }
            </div>
          </div>
        </div>
      </NewContainer>
    </div>
  )
};
