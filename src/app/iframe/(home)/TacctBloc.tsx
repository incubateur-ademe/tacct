import OptimalParagraph from '@/components/utils/OptimalParagraph';
import { H2 } from "@/design-system/base/Textes";
import { NewContainer } from "@/design-system/layout";
import MiddlePageTrigger from '@/hooks/MiddlePageTrigger';
import { homeCards } from '@/lib/homeCards';
import styles from './home.module.scss';
import { HomeCard } from './homeCard';

export const TacctBloc = () => {
  return (
    <div className={styles.tacctContainer}>
      <NewContainer size="xl">
        <div className={styles.tacctWrapper}>
          <H2 style={{ color: "white", margin: 0, textAlign: "center", marginBottom: "2.5rem", fontSize: "28px"  }}>
            Pourquoi suivre la démarche TACCT ?
          </H2>
          {/* <H3 style={{ color: "white", fontSize: "1.25rem", fontWeight: 400, marginBottom: "2.5rem", textAlign: "center" }}>
            <span>TACCT</span> : <span>T</span>rajectoires d’<span>A</span>daptation
            au <span>C</span>hangement <span>C</span>limatique des <span>T</span>erritoires
          </H3> */}
          <OptimalParagraph maxWidth='85ch' style={{ color: "white", textAlign: "center" }}>
            Face aux défis du changement climatique, vous cherchez une méthode concrète pour
            agir ? TACCT vous accompagne étape par étape dans votre démarche d'adaptation territoriale.
          </OptimalParagraph>
          <MiddlePageTrigger />
          <div className={styles.cardWrapper}>
            {homeCards.map((card, index) => (
              <HomeCard
                key={index}
                icone={card.icone}
                titre={card.titre}
                description={card.description}
              />
            ))}
          </div>
        </div>
      </NewContainer>
    </div>
  )
};
