import BulbIcon from '@/assets/icons/lightbulb_green_icon.svg';
import AnalyseExpositionImage from '@/assets/images/illustration_analyse_exposition.png';
import AnalyseSensibiliteImage from '@/assets/images/illustration_analyse_sensibilite.png';
import { Body, H2 } from '@/design-system/base/Textes';
import { NewContainer } from '@/design-system/layout';
import Image from 'next/image';
import styles from '../patch4c.module.scss';

export const ConseilsAggravation = () => {
  return (
    <NewContainer size="xl" style={{ padding: '1.5rem 1rem 4rem' }}>
      <div className={styles.conseilsAggravationContainer}>
        <H2
          style={{
            color: "var(--principales-vert)",
            fontSize: 22,
          }}
        >
          Que faire en cas de niveau d’aggravation "fort" ou "très fort" ?
        </H2>
        <div className={styles.separator} />
        <Body>
          Si l'un des indices de votre territoire est au niveau d'aggravation "fort" ou "très fort",
          il est impératif de renforcer votre plan d'adaptation. Prenez en compte dès maintenant les
          conséquences possibles de l'aléa.
        </Body>
        <div className={styles.tableau}>
          <div className={styles.tableauRow}>
            <div className={styles.tableauCell} />
            <div className={styles.tableauCell}
              style={{ justifyContent: "flex-end", gap: "3rem", maxHeight: "360px" }}>
              <Image
                src={AnalyseExpositionImage}
                alt="Analyse Exposition"
                style={{ height: "auto", width: "auto", maxWidth: "300px" }}
              />
              <Body style={{ color: "var(--principales-vert)" }} weight='bold'>
                Analyse de l’exposition
              </Body>
            </div>
            <div className={styles.tableauCell} style={{ maxHeight: "360px" }}>
              <Image
                src={AnalyseSensibiliteImage}
                alt="Analyse Sensibilité"
                style={{ height: "auto", width: "auto", maxWidth: "300px" }}
              />
              <Body style={{ color: "var(--principales-vert)" }} weight='bold'>
                Analyse de la sensibilité
              </Body>
            </div>
          </div>
          <div className={styles.tableauSeparator} />
          <div className={styles.tableauRow}>
            <div className={styles.tableauCell}>
              <div style={{
                height: "40px",
                width: "40px",
                borderRadius: "50%",
                backgroundColor: "#FFB181"
              }} />
              <Body weight='bold'>
                Aggravation forte
              </Body>
            </div>
            <div className={styles.tableauCell}>
              <Body>
                Vérifier que votre <b>diagnostic identifie bien l’aléa climatique</b> suivi par cet indice, sinon l’ajouter.
              </Body>
            </div>
            <div className={styles.tableauCell}>
              <Body>
                Vérifier que votre diagnostic évalue la <b>sensibilité face à cette exposition,</b> pour
                les habitants, les infrastructures, les ressources naturelles et les activités économiques.
              </Body>
            </div>
          </div>
          <div className={styles.tableauSeparator} />
          <div className={styles.tableauRow}>
            <div className={styles.tableauCell}>
              <div style={{
                height: "40px",
                width: "40px",
                borderRadius: "50%",
                backgroundColor: "#FF1C64"
              }} />
              <Body weight='bold'>
                Aggravation très forte
              </Body>
            </div>
            <div className={styles.tableauCell}>
              <Body>
                Considérez comme <b>maximal votre niveau d’exposition</b> à cet aléa climatique dans votre diagnostic de vulnérabilité.
              </Body>
            </div>
            <div className={styles.tableauCell}>
              <Body>
                Considérez comme maximal votre niveau de <b>sensibilité face à cette exposition,</b> sauf
                à disposer de <b>capacités d’adaptation</b> démontrant le contraire.
              </Body>
            </div>
          </div>
        </div>
        <div className={styles.aNoter}>
          <div className={styles.aNoterTitre}>
            <Image
              src={BulbIcon}
              alt=""
              width={24}
              height={24}
            />
            <Body weight='bold' style={{ color: "var(--principales-vert)" }}>
              À noter
            </Body>
          </div>
          <div>
            <Body style={{ marginLeft: "2rem" }}>
              Avant de faire valider votre PCAET, assurez-vous que l’analyse de l’exposition de votre territoire
              tient compte de la TRACC et que votre <b>plan d’action comporte des mesures concrètes pour
                réduire les facteurs de sensibilité identifiés.</b> Dans le cas contraire, enrichissez votre document.
            </Body>
          </div>
        </div>
      </div>
    </NewContainer>
  )
};
