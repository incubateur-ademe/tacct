"use client";
import { BarChartAgeBatiNouveauParcours } from '@/components/charts/inconfortThermique/BarChartAgeBatiNouveauParcours';
import { MicroCircleGrid } from "@/components/charts/MicroDataviz";
import { ExportButtonNouveauParcours } from "@/components/exports/ExportButton";
import { Loader } from "@/components/ui/loader";
import { Body } from "@/design-system/base/Textes";
import { ageBatiMapper } from "@/lib/mapper/inconfortThermique";
import { ConfortThermique } from "@/lib/postgres/models";
import { AgeBatiText } from '@/lib/staticTexts';
import { IndicatorExportTransformations } from "@/lib/utils/export/environmentalDataExport";
import { eptRegex } from "@/lib/utils/regex";
import { Round } from '@/lib/utils/reusableFunctions/round';
import { Sum } from '@/lib/utils/reusableFunctions/sum';
import { useSearchParams } from "next/navigation";
import styles from '../../explorerDonnees.module.scss';
import { averageProperty } from '../fonctions';
import { DateConstructionResidencesBarChartData } from '../graphData';
import { SourceExport } from '../SourceExport';

export const DateConstructionResidences = ({
  inconfortThermique
}: {
  inconfortThermique: ConfortThermique[];
}) => {
  const searchParams = useSearchParams();
  const code = searchParams.get('code')!;
  const libelle = searchParams.get('libelle')!;
  const type = searchParams.get('type')!;
  const ageBatiMapped = inconfortThermique.map(ageBatiMapper);
  const ageBatiTerritoire =
    type === 'commune'
      ? ageBatiMapped.filter((e) => e.code_geographique === code)
      : type === 'ept' && eptRegex.test(libelle)
        ? ageBatiMapped.filter((e) => e.ept === libelle)
        : type === 'epci' && !eptRegex.test(libelle)
          ? ageBatiMapped.filter((e) => e.epci === code)
          : ageBatiMapped;
  const exportData = IndicatorExportTransformations.inconfort_thermique.AgeBati(ageBatiTerritoire);
  const averages = {
    averageAgeBatiPre19: averageProperty(ageBatiTerritoire, 'age_bati_pre_19'),
    averageAgeBati1945: averageProperty(ageBatiTerritoire, 'age_bati_19_45'),
    averageAgeBati4690: averageProperty(ageBatiTerritoire, 'age_bati_46_90'),
    averageAgeBati9105: averageProperty(ageBatiTerritoire, 'age_bati_91_05'),
    averageAgeBatiPost06: averageProperty(ageBatiTerritoire, 'age_bati_post06')
  };
  const constructionBefore2006 =
    averages.averageAgeBatiPre19 +
    averages.averageAgeBati1945 +
    averages.averageAgeBati4690 +
    averages.averageAgeBati9105;
  const chartData = DateConstructionResidencesBarChartData(averages);
  return (
    <>
      <div className={styles.datavizContainer}>
        <div className={styles.dataTextWrapper}>
          <div className={styles.chiffreDynamiqueWrapper}>
            {
              constructionBefore2006 &&
                !Object.values(averages).includes(NaN) &&
                Sum(Object.values(averages)) != 0 ?
                <>
                  <MicroCircleGrid pourcentage={constructionBefore2006} arrondi={1} ariaLabel="Pourcentage de constructions avant 2006" />
                  <Body weight='bold' style={{ color: "var(--gris-dark)" }}>
                    Sur votre territoire,{' '}
                    <b>{Round(constructionBefore2006, 1)} %</b> des résidences
                    principales sont construites avant 2006.
                  </Body>
                </>
                : ""
            }
            <AgeBatiText />
          </div>
        </div>
        <div className={styles.datavizWrapper}>
          {chartData ? <BarChartAgeBatiNouveauParcours chartData={chartData} /> : <Loader />}
          <SourceExport
            source="INSEE, RP 2015-2021 (consultée en décembre 2024)"
            condition={Sum(chartData.map(el => Number(el["Votre territoire"]))) !== 0 && !isNaN(Sum(chartData.map(el => Number(el["Votre territoire"]))))}
            anchor='Âge du bâtiment'
            exportComponent={
              <ExportButtonNouveauParcours
                data={exportData}
                baseName="age_bati"
                type={type}
                libelle={libelle}
                code={code}
                sheetName="Age du bâti"
              // style={{ backgroundColor: 'var(--principales-vert)' }}
              />
            }
          />
        </div>
      </div>
    </>
  );
};
