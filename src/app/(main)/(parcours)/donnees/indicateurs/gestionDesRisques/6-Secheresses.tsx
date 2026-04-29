"use client";
import DataNotFound from '@/assets/images/zero_data_found.png';
import SecheressesCharts from '@/components/charts/gestionRisques/secheressesCharts';
import { MicroCircleGridMois } from '@/components/charts/MicroDataviz';
import { ExportButton } from '@/components/exports/ExportButton';
import DataNotFoundForGraph from "@/components/graphDataNotFound";
import { ReadMoreFade } from '@/components/utils/ReadMoreFade';
import { CustomTooltipNouveauParcours } from '@/components/utils/Tooltips';
import { Body } from '@/design-system/base/Textes';
import { calculerMoyenneJoursMensuelleAvecRestriction } from '@/lib/charts/gestionRisques';
import { SecheressesPasseesModel } from "@/lib/postgres/models";
import { SecheressesText } from '@/lib/staticTexts';
import { secheressesPasseesTooltipText } from '@/lib/tooltipTexts';
import { secheressesPasseesDoc } from '@/lib/utils/export/documentations';
import { IndicatorExportTransformations } from '@/lib/utils/export/environmentalDataExport';
import { useSearchParams } from 'next/navigation';
import { useState } from "react";
import styles from '../../explorerDonnees.module.scss';
import { SourceExport } from '../SourceExport';

export const SecheressesPassees = (props: {
  secheresses: SecheressesPasseesModel[];
}) => {
  const { secheresses } = props;
  const searchParams = useSearchParams();
  const code = searchParams.get('code')!;
  const type = searchParams.get('type')!;
  const libelle = searchParams.get('libelle')!;
  const [datavizTab, setDatavizTab] = useState<string>('Intensité');
  const { moyenne: moyenneJoursAvecRestriction, annee: anneeMaxRestriction } = calculerMoyenneJoursMensuelleAvecRestriction({ secheresses });
  const exportData =
    IndicatorExportTransformations.gestionRisques.SecheressesPassees(secheresses).toSorted(
      (a, b) => a.code_geographique.localeCompare(b.code_geographique)
    );

  return (
    <>
      <div className={styles.datavizContainer}>
        <div className={styles.dataTextWrapper}>
          <div className={styles.chiffreDynamiqueWrapper}>
            <MicroCircleGridMois nombreJours={moyenneJoursAvecRestriction} arrondi={0} ariaLabel="Nombre moyen de jours de restriction d'usage de l'eau par mois lors de l'année la plus sèche" />
            <Body weight='bold' style={{ color: "var(--gris-dark)" }}>
              Sur la période 2020-2025, c'est en {anneeMaxRestriction} que votre territoire
              a connu le plus de restrictions liées à la sécheresse, avec une moyenne
              de {moyenneJoursAvecRestriction} jours de restriction par mois.
            </Body>
            <CustomTooltipNouveauParcours
              title={secheressesPasseesTooltipText}
              texte="D'où vient ce chiffre ?"
            />
          </div>
          <ReadMoreFade maxHeight={300}>
            <SecheressesText />
          </ReadMoreFade>
        </div>
        <div className={styles.datavizWrapper} style={{ borderRadius: "1rem 0 0 1rem", height: "fit-content" }}>
          {
            secheresses.length !== 0 ?
              <SecheressesCharts
                datavizTab={datavizTab}
                setDatavizTab={setDatavizTab}
                secheresses={secheresses}
              /> : (
                <div className={styles.dataNotFoundForGraph}>
                  <DataNotFoundForGraph image={DataNotFound} />
                </div>
              )
          }
          <SourceExport
            anchor="Sécheresses-passées"
            source="Ministère de la transition écologique, 2026 (consultée en février 2026)"
            condition={secheresses.length !== 0}
            exportComponent={
              <ExportButton
                data={exportData}
                baseName="secheresses_passees"
                type={type}
                libelle={libelle}
                code={code}
                sheetName="Sécheresses passées"
                documentation={secheressesPasseesDoc}
              />
            }
          />
        </div>
      </div>
    </>
  );
};
