'use client';

import { ConsommationEspacesNAFCharts } from '@/components/charts/amenagement/consommationEspacesNAFCharts';
import { MicroNumberCircle } from '@/components/charts/MicroDataviz';
import { ExportButtonNouveauParcours } from '@/components/exports/ExportButton';
import { ReadMoreFade } from '@/components/utils/ReadMoreFade';
import { CustomTooltipNouveauParcours } from '@/components/utils/Tooltips';
import { Body } from '@/design-system/base/Textes';
import { ConsommationNAF } from '@/lib/postgres/models';
import { ConsommationEspacesNAFAmenagementText } from '@/lib/staticTexts';
import { espacesNAFTooltipText } from '@/lib/tooltipTexts';
import { consommationEspacesNafDoc } from '@/lib/utils/export/documentations';
import { IndicatorExportTransformations } from '@/lib/utils/export/environmentalDataExport';
import { Round } from '@/lib/utils/reusableFunctions/round';
import { useSearchParams } from 'next/navigation';
import styles from '../../explorerDonnees.module.scss';
import { SourceExport } from '../SourceExport';

export const ConsommationEspacesNAFAmenagement = (props: {
  consommationNAF: ConsommationNAF[];
}) => {
  const { consommationNAF } = props;
  const searchParams = useSearchParams();
  const code = searchParams.get('code')!;
  const type = searchParams.get('type')!;
  const libelle = searchParams.get('libelle')!;
  const exportData = IndicatorExportTransformations.biodiversite.EspacesNaf(consommationNAF);
  const sumNaf = (type === "commune"
    ? consommationNAF.filter((item) => item.code_geographique === code)[0]
      ?.naf09art23
    : consommationNAF.reduce((acc, item) => acc + (item.naf09art23 ?? 0), 0)) ?? 0;

  return (
    <>
      <div className={styles.datavizContainer}>
        <div className={styles.dataTextWrapper}>
          <div className={styles.chiffreDynamiqueWrapper}>
            <MicroNumberCircle valeur={sumNaf / 10000} arrondi={1} unite='ha' />
            <div className={styles.text}>
              {
                sumNaf && sumNaf !== 0 ? (
                  <Body weight='bold' style={{ color: "var(--gris-dark)" }}>
                    Entre 2009 et 2023, votre territoire a consommé{' '}
                    <b>{Round(sumNaf / 10000, 1)} hectare(s)</b> d’espaces naturels
                    et forestiers.{' '}
                  </Body>
                ) : ""
              }
              <CustomTooltipNouveauParcours
                title={espacesNAFTooltipText}
                texte="D'où vient ce chiffre ?"
              />
            </div>
          </div>
          <div className='mt-4'>
            <ReadMoreFade maxHeight={500}>
              <ConsommationEspacesNAFAmenagementText />
            </ReadMoreFade>
          </div>
        </div>
        <div className={styles.datavizWrapper}>
          <ConsommationEspacesNAFCharts
            consommationNAF={consommationNAF}
          />
          <SourceExport
            source="CEREMA, 2024 (consultée en décembre 2024)"
            condition={sumNaf !== 0}
            exportComponent={
              <ExportButtonNouveauParcours
                data={exportData}
                baseName="consommation_espaces_naf"
                type={type}
                libelle={libelle}
                code={code}
                sheetName="Espaces NAF"
                documentation={consommationEspacesNafDoc}
                anchor="Sols imperméabilisés"
              />
            }
          />
        </div>
      </div>
    </>
  );
};
