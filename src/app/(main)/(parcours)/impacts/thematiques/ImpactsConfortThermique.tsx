"use client";
import { MicroPieChart } from '@/components/charts/MicroDataviz';
import { ScrollToSourceTag, SourcesSection } from '@/components/interactions/scrollToSource';
import { Body, H2 } from "@/design-system/base/Textes";
import MiddlePageTrigger from '@/hooks/MiddlePageTrigger';
import { AssocierLesActeurs } from '../components/associerLesActeurs';
import { ThematiquesLieesNavigation } from '../components/ThematiquesLieesNavigation';
import styles from '../impacts.module.scss';

export const DiagnostiquerImpactsConfortThermique = () => {
  return (
    <>
      {/* Introduction */}
      <section>
        <Body>
          Prendre conscience des facteurs de sensibilité aux fortes chaleurs de
          son territoire, c’est un bon début. Mais c’est sur le terrain que vous
          comprendrez comment votre territoire vit &ndash; ou subit &ndash; ces périodes d’inconfort thermique.
        </Body>
      </section>
      <section className={styles.sectionType}>
        <div id="section1" className={styles.diagnosticWrapper}>
          <H2 style={{ color: "var(--principales-vert)", fontSize: '1.25rem' }}>
            33 000 décès attribués à la chaleur entre 2014 et 2022 : c’est toujours beaucoup trop !
          </H2>
          <Body>
            Voici quelques chiffres au niveau national pour vous aider à poser les bonnes questions,
            mais c’est le terrain qui vous donnera les vraies réponses.
          </Body>
          <div className={styles.donneesNationalesWrapper}>
            <div className={styles.leftData}>
              <MicroPieChart pourcentage={28} ariaLabel="Pourcentage des décès liés à la chaleur" />
              <Body>
                En France, {" "}
                <ScrollToSourceTag sourceNumero={1}>
                  seuls <b>28 %</b> des décès liés à la chaleur
                </ScrollToSourceTag>
                {" "}se produisent pendant les canicules ; ce qui ne représente que <b>6 % des
                  jours d’été</b>. Soyons vigilants aussi en dehors des périodes de canicule.
              </Body>
            </div>
            <div className={styles.rightData}>
              <Body weight='bold'>
                Ce que cela révèle
              </Body>
              <Body>
                Les risques existent aussi en dehors des alertes officielles.
              </Body>
              <Body weight='bold' style={{ marginTop: '0.5rem', marginBottom: '-0.5rem' }}>
                Avec qui pourriez-vous échanger
              </Body>
              <ul>
                <li><Body>de l’organisation du territoire en dehors de ces épisodes</Body></li>
                <li><Body>de la culture du risque concernant la chaleur</Body></li>
              </ul>
            </div>
          </div>
          <div className={styles.donneesNationalesWrapper}>
            <div className={styles.leftData}>
              <MicroPieChart
                pourcentage={71}
                ariaLabel="Pourcentage des consultations SOS médecinspour les plus de 75 ans"
              />
              <Body>
                Tous exposés : {" "}
                <ScrollToSourceTag sourceNumero={2}>
                  <b>71 %</b> des consultations SOS médecins
                </ScrollToSourceTag>
                {" "}liées à la chaleur concernent des personnes de moins de 75 ans (juin-septembre 2022).
                <br></br>Seuls {" "}
                <ScrollToSourceTag sourceNumero={3}>
                  <b>12 %</b> des Français
                </ScrollToSourceTag>
                {" "}se considèrent fragiles ou très fragiles pendant une canicule.
              </Body>
            </div>
            <div className={styles.rightData}>
              <Body weight='bold'>
                Ce que cela révèle
              </Body>
              <Body>
                La sensibilité à la chaleur n'est pas qu'une affaire d'âge.
              </Body>
              <Body weight='bold' style={{ marginTop: '0.5rem', marginBottom: '-0.5rem' }}>
                Avec qui pourriez-vous échanger
              </Body>
              <ul>
                <li><Body>des pratiques sportives</Body></li>
                <li><Body>de la présence et des comportements touristiques</Body></li>
                <li><Body>de l’isolement géographique ou social de personnes fragiles</Body></li>
                <li><Body>des travailleurs exposés</Body></li>
              </ul>
            </div>
          </div>
          <div className={styles.donneesNationalesWrapper} style={{ borderBottom: 'none', paddingBottom: 0 }}>
            <div className={styles.leftData}>
              <MicroPieChart pourcentage={55} ariaLabel="Pourcentage des Français ayant trop chaud" />
              <Body>
                <ScrollToSourceTag sourceNumero={4}>
                  <b>55 %</b> des Français
                </ScrollToSourceTag>
                {" "}déclarent avoir eu trop chaud pendant au moins 24 heures dans leur logement en 2023.
                <br></br>
                <ScrollToSourceTag sourceNumero={5}>
                  La présence d’arbres peut rafraîchir l’air de <b>2 à 3 °C</b>
                </ScrollToSourceTag>
                , notamment dans les rues ou lorsqu’ils sont
                alignés en bordure de route.
              </Body>
            </div>
            <div className={styles.rightData}>
              <Body weight='bold'>
                Ce que cela révèle
              </Body>
              <Body>
                Le logement est un facteur clé d’exposition et l’absence de végétation aggrave les ilots de chaleur.
              </Body>
              <Body weight='bold' style={{ marginTop: '0.5rem', marginBottom: '-0.5rem' }}>
                Avec qui pourriez-vous échanger
              </Body>
              <ul>
                <li><Body>du niveau d’intégration des enjeux climatiques dans les documents d’urbanisme (PLU(i), SCoT, etc.)</Body></li>
                <li><Body>de l’opportunité d’effectuer un diagnostic de surchauffe urbaine</Body></li>
                <li><Body>de l’adéquation des mesures déjà prises avec les pratiques et usages de la ville</Body></li>
                <li><Body>de l’état du parc urbain et de rénovation énergétique</Body></li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      <MiddlePageTrigger />
      <section className={styles.sectionType} style={{ border: "none" }}>
        <AssocierLesActeurs />
      </section>
      <SourcesSection tag="h2" thematique="confortThermique" />
      <section className={styles.sectionType}>
        <div id="section4" className={styles.diagnosticWrapper}>
          <H2 style={{ color: "var(--principales-vert)", fontSize: '1.25rem', margin: 0 }}>
            Poursuivez votre exploration
          </H2>
          <Body>
            Vous pouvez retourner à l’ensemble des thématiques ou bien explorer les thématiques liées à celle-ci.
          </Body>
          <ThematiquesLieesNavigation thematiqueSelectionnee='Confort thermique' />
        </div>
      </section>
    </>
  );
};
