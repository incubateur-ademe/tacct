'use client';
import { BarChartAgeBatiNouveauParcours } from '@/components/charts/inconfortThermique/BarChartAgeBatiNouveauParcours';
import { MicroCircleGrid } from '@/components/charts/MicroDataviz';
import { ExportButton } from '@/components/exports/ExportButton';
import { Loader } from '@/components/ui/loader';
import { Body } from '@/design-system/base/Textes';
import { ageBatiMapper } from '@/lib/mapper/inconfortThermique';
import { ConfortThermique } from '@/lib/postgres/models';
import { AgeBatiText } from '@/lib/staticTexts';
import { IndicatorExportTransformations } from '@/lib/utils/export/environmentalDataExport';
import { eptRegex } from '@/lib/utils/regex';
import { Round } from '@/lib/utils/reusableFunctions/round';
import { Sum } from '@/lib/utils/reusableFunctions/sum';
import { useSearchParams } from 'next/navigation';
import styles from '../../explorerDonnees.module.scss';
import { sumProperty } from '../fonctions';
import { DateConstructionResidencesBarChartData } from '../graphData';
import { SourceExport } from '../SourceExport';

export const DateConstructionResidences = ({
  confortThermique
}: {
  confortThermique: ConfortThermique[];
}) => {
  const searchParams = useSearchParams();
  const code = searchParams.get('code')!;
  const libelle = searchParams.get('libelle')!;
  const type = searchParams.get('type')!;
  const ageBatiMapped = confortThermique.map(ageBatiMapper);
  const ageBatiTerritoire =
    type === 'commune'
      ? ageBatiMapped.filter((e) => e.code_geographique === code)
      : type === 'ept' && eptRegex.test(libelle)
        ? ageBatiMapped.filter((e) => e.ept === libelle)
        : type === 'epci' && !eptRegex.test(libelle)
          ? ageBatiMapped.filter((e) => e.epci === code)
          : ageBatiMapped;

  const totalNbRp = sumProperty(ageBatiTerritoire, 'nb_rp_tot');
  const pourcentagesDatesConstruction = {
    ageBatiPre19:
      (sumProperty(ageBatiTerritoire, 'nb_rp_pre_19') / totalNbRp) * 100,
    ageBati1945:
      (sumProperty(ageBatiTerritoire, 'nb_rp_19_45') / totalNbRp) * 100,
    ageBati4690:
      ((sumProperty(ageBatiTerritoire, 'nb_rp_46_70') +
        sumProperty(ageBatiTerritoire, 'nb_rp_71_90')) /
        totalNbRp) *
      100,
    ageBati9105:
      (sumProperty(ageBatiTerritoire, 'nb_rp_91_05') / totalNbRp) * 100,
    ageBatiPost06:
      (sumProperty(ageBatiTerritoire, 'nb_rp_post_06') / totalNbRp) * 100
  };
  const constructionBefore2006 =
    pourcentagesDatesConstruction.ageBatiPre19 +
    pourcentagesDatesConstruction.ageBati1945 +
    pourcentagesDatesConstruction.ageBati4690 +
    pourcentagesDatesConstruction.ageBati9105;
  const chartData = DateConstructionResidencesBarChartData(
    pourcentagesDatesConstruction
  );

  const exportData =
    IndicatorExportTransformations.confortThermique.AgeBati(ageBatiTerritoire);

  return (
    <>
      <div className={styles.datavizContainer}>
        <div className={styles.dataTextWrapper}>
          <div className={styles.chiffreDynamiqueWrapper}>
            {constructionBefore2006 &&
            !Object.values(pourcentagesDatesConstruction).includes(NaN) &&
            Sum(Object.values(pourcentagesDatesConstruction)) != 0 ? (
              <>
                <MicroCircleGrid
                  pourcentage={constructionBefore2006}
                  arrondi={1}
                  ariaLabel="Pourcentage de constructions avant 2006"
                />
                <Body weight="bold" style={{ color: 'var(--gris-dark)' }}>
                  Sur votre territoire,{' '}
                  <b>{Round(constructionBefore2006, 1)} %</b> des résidences
                  principales sont construites avant 2006.
                </Body>
              </>
            ) : (
              ''
            )}
            <AgeBatiText />
          </div>
        </div>
        <div className={styles.datavizWrapper}>
          {chartData ? (
            <BarChartAgeBatiNouveauParcours chartData={chartData} />
          ) : (
            <Loader />
          )}
          <SourceExport
            source="INSEE, RP2022 (consultée en avril 2026)"
            condition={
              Sum(chartData.map((el) => Number(el['Votre territoire']))) !==
                0 &&
              !isNaN(Sum(chartData.map((el) => Number(el['Votre territoire']))))
            }
            anchor="Âge du bâtiment"
            exportComponent={
              <ExportButton
                data={exportData}
                baseName="age_bati"
                type={type}
                libelle={libelle}
                code={code}
                sheetName="Age du bâti"
              />
            }
          />
        </div>
      </div>
    </>
  );
};
