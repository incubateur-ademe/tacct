"use client";
import { MicroNumberCircle, MicroPieChart } from '@/components/charts/MicroDataviz';
import { ScrollToSourceTag, SourcesSection } from '@/components/interactions/scrollToSource';
import { DefinitionTooltip } from '@/components/utils/Tooltips';
import { Body, H2 } from "@/design-system/base/Textes";
import { irrigable } from '@/lib/definitions';
import { AssocierLesActeurs } from '../components/associerLesActeurs';
import { ThematiquesLieesNavigation } from '../components/ThematiquesLieesNavigation';
import styles from '../impacts.module.scss';

export const DiagnostiquerImpactsAgriculture = () => {
  return (
    <>
      {/* Introduction */}
      <section>
        <Body>
          Voici quelques repères nationaux sur des enjeux agricoles. Mais c’est sur le terrain que vous identifierez
          les (dés)équilibres propres à votre territoire.
        </Body>
      </section>
      <section className={styles.sectionType}>
        <div id="section1" className={styles.diagnosticWrapper}>
          <H2 style={{ color: "var(--principales-vert)", fontSize: '1.25rem' }}>
            Comment associer renouvellement agricole et pratiques durables pour un territoire résilient ?
          </H2>
          <div className={styles.donneesNationalesWrapper}>
            <div className={styles.leftData}>
              <MicroPieChart pourcentage={50} ariaLabel="Pourcentage des exploitations dirigées par au moins un exploitant de 55 ans ou plus" />
              <Body>
                1 exploitation française sur 2 est dirigée par au moins un exploitant de 55 ans ou plus, même si cette proportion
                varie selon les spécialisations. <br></br>En dix ans (2010-2020), les régions françaises ont par ailleurs perdu{" "}
                <ScrollToSourceTag sourceNumero={1}>
                  entre 12 % à 25 % de leurs exploitations sans perdre de surface agricole (-2 %  max de SAU).
                </ScrollToSourceTag>
              </Body>
            </div>
            <div className={styles.rightData}>
              <Body weight='bold'>
                Ce que cela révèle
              </Body>
              <Body>
                Pour une agriculture durable et résiliente, le renouvellement des générations est aussi crucial que
                la taille des exploitations – un équilibre à retrouver d’urgence.
              </Body>
              <Body weight='bold' style={{ marginTop: '0.5rem', marginBottom: '-0.5rem' }}>
                Avec qui pourriez-vous échanger
              </Body>
              <ul>
                <li><Body>sur l’anticipation des départs</Body></li>
                <li><Body>sur l’accès au foncier</Body></li>
                <li><Body>sur les aides à l’installation et à l’investissement</Body></li>
                <li><Body>...</Body></li>
              </ul>
            </div>
          </div>
          <div className={styles.donneesNationalesWrapper}>
            <div className={styles.leftData}>
              <MicroNumberCircle
                comparateur='+'
                valeur={15}
                ariaLabel="Augmentation des surfaces irriguées en 10 ans"
                unite='%'
              />
              <Body>
                <ScrollToSourceTag sourceNumero={2}>
                  <b>L'irrigation explose</b>
                </ScrollToSourceTag> : +15 % de surfaces irriguées en dix ans ; +23 % de{" "}
                <DefinitionTooltip title={irrigable}>
                  surfaces irrigables.
                </DefinitionTooltip>
                <br></br>6,8 % de la surface agricole utile (SAU) est irriguée en France, mais <b>avec des écarts
                  vertigineux</b> : de 1 % à 40 % selon les territoires.
              </Body>
            </div>
            <div className={styles.rightData}>
              <Body weight='bold'>
                Ce que cela révèle
              </Body>
              <Body>
                Malgré les risques pour la ressource, l’irrigation demeure un réflexe dominant du monde agricole pour affronter les sécheresses.
              </Body>
              <Body weight='bold' style={{ marginTop: '0.5rem', marginBottom: '-0.5rem' }}>
                Avec qui pourriez-vous échanger
              </Body>
              <ul>
                <li><Body>des dispositions ou opportunités des outils de gestion partagée de la ressource en eau (SAGE, PTGE...)</Body></li>
                <li><Body>de la disponibilité de la ressource</Body></li>
                <li><Body>des arbitrages entre usages</Body></li>
                <li><Body>de l’évolution des modèles et pratiques économes en eau</Body></li>
                <li><Body>...</Body></li>
              </ul>
            </div>
          </div>
          <div className={styles.donneesNationalesWrapper} style={{ borderBottom: "none", paddingBottom: 0 }}>
            <div className={styles.leftData}>
              <MicroNumberCircle
                comparateur='-'
                valeur={50}
                ariaLabel="Réduction des émissions de gaz à effet de serre en agriculture biologique"
                unite='%'
              />
              <Body>
                Par rapport aux cultures conventionnelles, les cultures végétales biologiques émettent de l’ordre de{" "}
                <ScrollToSourceTag sourceNumero={3}>
                  50 % de gaz à effet de serre en moins
                </ScrollToSourceTag>
                {" "}par unité de surface.
              </Body>
            </div>
            <div className={styles.rightData}>
              <Body weight='bold'>
                Ce que cela révèle
              </Body>
              <Body>
                Au-delà des émissions de l’agriculture, c’est aussi l’empreinte carbone globale de notre alimentation
                qui pose question, en raison notamment du risque d’émissions délocalisées via les importations.
                Pour éviter ce piège, la transition vers des modes de production moins intensifs doit s’accompagner
                d’une évolution des habitudes alimentaires, afin de réduire à la fois les émissions territoriales et
                l’empreinte carbone de notre assiette.
              </Body>
              <Body weight='bold' style={{ marginTop: '0.5rem', marginBottom: '-0.5rem' }}>
                Avec qui pourriez-vous échanger
              </Body>
              <ul>
                <li><Body>de la relocalisation des productions agricoles nourricières</Body></li>
                <li><Body>de nouvelles formes de coopérations avec les agriculteurs</Body></li>
                <li><Body>de la précarité alimentaire sur votre territoire</Body></li>
                <li><Body>des dispositifs d’éducation alimentaire</Body></li>
                <li><Body>des liens avec votre contrat local de santé (CLS)</Body></li>
                <li><Body>…</Body></li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      <section className={styles.sectionType} style={{ border: "none" }}>
        <AssocierLesActeurs />
      </section>
      <SourcesSection tag="h2" thematique="agricultureImpact" />
      <section className={styles.sectionType}>
        <div id="section4" className={styles.diagnosticWrapper}>
          <H2 style={{ color: "var(--principales-vert)", fontSize: '1.25rem', margin: 0 }}>
            Poursuivez votre exploration
          </H2>
          <Body>
            Vous pouvez retourner à l’ensemble des thématiques ou bien explorer les thématiques liées à celle-ci.
          </Body>
          <ThematiquesLieesNavigation thematiqueSelectionnee='Agriculture' />
        </div>
      </section>
    </>
  );
};
