import { CarteHoverLink } from "@/components/Cartes";
import { TacctoscopeCard } from "@/components/mon-espace/TacctoscopeCard";
import { H2 } from "@/design-system/base/Textes";
import { NewContainer } from "@/design-system/layout";
import { getCurrentUserValide } from "@/lib/auth/getCurrentUser";
import { getUserAnswers } from "@/lib/queries/tacctoscope";
import { autresOutilsCartes } from "@/lib/ressources/cartes";
import { estProfilDeverrouille } from "@/lib/segmentation";
import { CRITERIA } from "@/lib/tacctoscope/content/criteria";
import { getRecommendationCount } from "@/lib/tacctoscope/content/roadmapResources";
import { getAllProgress } from "@/lib/tacctoscope/progress";
import { AnswerMap } from "@/lib/tacctoscope/types";
import styles from '../ressources.module.scss';

export const BlocAutresOutils = async () => {
  const user = await getCurrentUserValide();
  const deverrouille = estProfilDeverrouille(user?.profil);

  const answers: AnswerMap = deverrouille ? await getUserAnswers() : {};
  const progress = getAllProgress(answers);
  const completed = progress.filter(
    (criterion) => criterion.total > 0 && criterion.answered === criterion.total
  ).length;
  const started = progress.filter((criterion) => criterion.answered > 0).length;
  const isComplete = completed === CRITERIA.length;
  const recommendationCount = isComplete ? getRecommendationCount(answers) : 0;

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
                hasAnswers={started > 0}
                isComplete={isComplete}
                recommendationCount={recommendationCount}
                completed={completed}
                started={started}
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
