"use client";
import WarningIcon from "@/assets/icons/exclamation_point_icon_black.png";
import DataNotFound from '@/assets/images/no_data_on_territory.svg';
import { LineChartGrandAge } from "@/components/charts/inconfortThermique/lineChartGrandAge";
import { MicroCircleGrid } from "@/components/charts/MicroDataviz";
import { ExportButtonNouveauParcours } from "@/components/exports/ExportButton";
import DataNotFoundForGraph from "@/components/graphDataNotFound";
import { Loader } from "@/components/ui/loader";
import { CustomTooltipNouveauParcours } from "@/components/utils/Tooltips";
import { Body } from "@/design-system/base/Textes";
import { grandAgeMapper } from "@/lib/mapper/inconfortThermique";
import { ConfortThermique } from "@/lib/postgres/models";
import { GrandAgeText } from '@/lib/staticTexts';
import { IndicatorExportTransformations } from "@/lib/utils/export/environmentalDataExport";
import { eptRegex, numberWithSpacesRegex } from "@/lib/utils/regex";
import { Round } from '@/lib/utils/reusableFunctions/round';
import Image from 'next/image';
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from 'react';
import styles from '../../explorerDonnees.module.scss';
import { sumProperty } from '../fonctions';
import { GrandAge75LineChartYData } from '../graphData';
import { SourceExport } from '../SourceExport';

export const GrandAge75 = ({
  confortThermique
}: {
  confortThermique: ConfortThermique[];
}) => {
  const searchParams = useSearchParams();
  const code = searchParams.get('code')!;
  const libelle = searchParams.get('libelle')!;
  const type = searchParams.get('type')!;
  const libelleDepartement = type === "epci" ? confortThermique[0]?.libelle_departement : "";
  const departement = type === "epci" ? confortThermique[0]?.departement : "";
  const [multipleDepartements, setMultipleDepartements] = useState<string[]>([]);
  const grandAgeMapped = confortThermique.map(
    grandAgeMapper
  );
  const territoireSup = type === 'epci' ? grandAgeMapped.filter((e) => e.departement === departement) : grandAgeMapped;
  const percentTerritoireSup = Round((
    (100 * sumProperty(territoireSup, 'over_75_sum_2022')) /
    (sumProperty(territoireSup, 'to_75_sum_2022') +
      sumProperty(territoireSup, 'under_4_sum_2022'))
  ), 2);
  const grandAgeTerritoire =
    type === 'commune'
      ? grandAgeMapped.filter((e) => e.code_geographique === code)
      : type === 'ept' && eptRegex.test(libelle)
        ? grandAgeMapped.filter((e) => e.ept === libelle)
        : type === 'epci' && !eptRegex.test(libelle)
          ? grandAgeMapped.filter((e) => e.epci === code)
          : grandAgeMapped;

  const yData = GrandAge75LineChartYData(grandAgeTerritoire);
  const xData = ['1968', '1975', '1982', '1990', '1999', '2006','2011', '2016', '2022'];
  const yGraphData = Object.values(yData)
    .map(Number)
    .map((value) => (isNaN(value) ? null : value));
  const methodeCalcul =
    'Nombre de personnes de plus de 75 ans divisé par la population totale à chaque recensement INSEE.';

  useEffect(() => {
    if (type === "epci" && code) {
      const departements = confortThermique.map(item => item.departement);
      const uniqueDepartements = Array.from(new Set(departements));
      setMultipleDepartements(uniqueDepartements);
    }
  }, [type, code, confortThermique]);
  const exportData = IndicatorExportTransformations.inconfort_thermique.GrandAge75(grandAgeTerritoire);

  return (
    <>
      <div className={styles.datavizContainer}>
        <div className={styles.dataTextWrapper}>
          <div className={styles.chiffreDynamiqueWrapper}>
            <MicroCircleGrid pourcentage={Number(yData.over_75_2022_percent)} arrondi={2} ariaLabel="Pourcentage des personnes âgées de plus de 80 ans" />
            {
              !Object.values(yData).slice(0, -2).includes('NaN') && (
                <>
                  <Body weight='bold' style={{ color: "var(--gris-dark)" }}>
                    En 2022, <b>{numberWithSpacesRegex(yData.over_75_2022_percent)} %</b> de la
                    population de votre territoire est constitué de personnes
                    âgées de plus de 75 ans (soit{' '}
                    <b>
                      {numberWithSpacesRegex(sumProperty(
                        grandAgeTerritoire,
                        'over_75_sum_2022'
                      ))}
                    </b>{' '}
                    personnes).
                  </Body>
                </>
              )
            }
            {
              type === "commune" && percentTerritoireSup && percentTerritoireSup !== "NaN" ? (
                <Body weight='bold' style={{ color: "var(--gris-dark)" }}>
                  Ce taux est de {percentTerritoireSup} % dans votre EPCI.
                </Body>
              ) : type === "epci" && percentTerritoireSup && percentTerritoireSup !== "NaN" ? (
                <Body weight='bold' style={{ color: "var(--gris-dark)" }}>
                  Ce taux est de {percentTerritoireSup} % dans ce département : {libelleDepartement}.
                </Body>
              ) : ''
            }
            <CustomTooltipNouveauParcours title={methodeCalcul} />
            <GrandAgeText />
          </div>
        </div>
        <div className={styles.datavizWrapper}>
          {yData.over_75_2022_percent ? (
            <div
              style={{
                backgroundColor: 'white',
                height: !Object.values(yData).slice(0, -2).includes('NaN') ? '500px' : 'max-content',
                width: '100%',
                borderRadius: '1rem 0 0 0',
              }}
            >
              {
                !Object.values(yData).slice(0, -2).includes('NaN') ? (
                  <>
                    <LineChartGrandAge xData={xData} yData={yGraphData} disclaimer={multipleDepartements.length > 1} />
                    {
                      multipleDepartements.length > 1 &&
                      <div style={{ minWidth: "450px", backgroundColor: "white", padding: "1em", transform: "translateY(-80px)" }}>
                        <div className='flex flex-row items-center justify-center'>
                          <Image
                            src={WarningIcon}
                            alt="Attention"
                            width={24}
                            height={24}
                            style={{ marginRight: '0.5em', alignItems: 'center' }}
                          />
                          <Body style={{ fontSize: 12 }}>
                            L'EPCI sélectionné s'étend sur
                            plusieurs départements. La comparaison proposée est
                            effectuée avec : {libelleDepartement}
                          </Body>
                        </div>
                      </div>
                    }
                  </>
                )
                  : <div className='p-10 flex flex-row justify-center'>
                    <DataNotFoundForGraph image={DataNotFound} />
                  </div>
              }
            </div>
          ) : (
            <Loader />
          )}
          <SourceExport
            anchor="Grand âge"
            exportComponent={
              <ExportButtonNouveauParcours
                data={exportData}
                baseName="grand_age"
                type={type}
                libelle={libelle}
                code={code}
                sheetName="Grand âge"
              />
            }
            source='INSEE, 2024 (consultée en février 2026)'
            condition={!Object.values(yData).slice(0, -2).includes('NaN')}
          />
        </div>
      </div>
    </>
  );
};
