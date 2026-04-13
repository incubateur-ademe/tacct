import Patch4Img from '@/assets/images/patch4_home.png';
import RessourcesImg from '@/assets/images/ressources_home.png';
import { BoutonPrimaireClassic } from "@/design-system/base/Boutons";
import { Body, H2, H3 } from "@/design-system/base/Textes";
import { NewContainer } from "@/design-system/layout";
import Image from "next/image";
import styles from './home.module.scss';

export const PatchEtRessourcesBloc = () => {
  return (
    <div className={styles.patch4Container}>
      <NewContainer size="xl" style={{ padding: "3rem 2rem" }}>
        <div className={styles.deuxBlocsWrapper}>
          <div className={styles.ressourcesWrapper}>
            <Image
              alt=""
              src={RessourcesImg}
              className={styles.ressourcesImage}
            />
            <div className={styles.ressourcesText}>
              <H2 style={{ color: "#666666", fontSize: "20px", marginBottom: 0 }}>Boîte à outils</H2>
              <H3 style={{ color: "#2B4B49", fontSize: "22px", marginBottom: 0 }}>
                Trouvez les réponses à vos questions sur l’adaptation
              </H3>
              <Body style={{ color: "#3D3D3D" }}>
                Notre sélection d’indispensables : retours d'expérience d'autres
                territoires, conseils sur l’approche et bonnes pratiques dans la
                mise en place de votre démarche d'adaptation.
              </Body>
              <BoutonPrimaireClassic
                size='lg'
                link="/iframe/ressources"
                text="Accéder aux ressources"
                style={{ marginTop: '1.5rem' }}
                posthogEventName='bouton_decouvrir_ressources_home'
              />
            </div>
          </div>
          <div className={styles.patch4Wrapper}>
            <div className={styles.patch4img}>
              <Image
                alt=""
                src={Patch4Img}
              />
            </div>
            <div className={styles.patch4Text}>
              <H2 style={{ color: "#666666", fontSize: "20px", marginBottom: 0 }}>Patch 4°C</H2>
              <H3 style={{ color: "#2B4B49", fontSize: "22px", marginBottom: 0 }}>
                Intégrez à votre diagnostic la trajectoire de réchauffement de référence
              </H3>
              <Body style={{ color: "#3D3D3D" }}>
                Le “patch 4°C” est une action du Plan national d’adaptation au  changement climatique (PNACC-3, 2025).
              </Body>
              <Body style={{ color: "#3D3D3D" }}>
                Quelle est la tendance d’aggravation des aléas climatiques
                sur votre territoire d’ici à 2100 ? Comment vous y préparer ?
              </Body>
              <BoutonPrimaireClassic
                size='lg'
                link="/iframe/recherche-territoire-patch4"
                text='Découvrir le patch 4°C'
                style={{ marginTop: '1.5rem' }}
                posthogEventName='bouton_decouvrir_patch4_home'
              />
            </div>
          </div>
        </div>
      </NewContainer>
    </div>
  )
}
