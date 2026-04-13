"use client";
import { PieChartTravailExt } from '@/components/charts/inconfortThermique/pieChartTravailExt';
import { MicroPieChart } from "@/components/charts/MicroDataviz";
import { ExportButtonNouveauParcours } from "@/components/exports/ExportButton";
import { Loader } from "@/components/ui/loader";
import { CustomTooltipNouveauParcours } from "@/components/utils/Tooltips";
import { Body } from "@/design-system/base/Textes";
import { travailExtMapper } from "@/lib/mapper/inconfortThermique";
import { ConfortThermique } from "@/lib/postgres/models";
import { TravailExterieurText } from '@/lib/staticTexts';
import { travailExterieurTooltipText } from '@/lib/tooltipTexts';
import { IndicatorExportTransformations } from "@/lib/utils/export/environmentalDataExport";
import { eptRegex } from "@/lib/utils/regex";
import { Round } from '@/lib/utils/reusableFunctions/round';
import { Sum } from '@/lib/utils/reusableFunctions/sum';
import { useSearchParams } from "next/navigation";
import styles from '../../explorerDonnees.module.scss';
import { sumProperty } from '../fonctions';
import { EmploisEnExterieurPieChartData } from '../graphData';
import { SourceExport } from '../SourceExport';

export const EmploisEnExterieur = ({
  inconfortThermique
}: {
  inconfortThermique: ConfortThermique[];
}) => {
  const searchParams = useSearchParams();
  const code = searchParams.get('code')!;
  const libelle = searchParams.get('libelle')!;
  const type = searchParams.get('type')!;
  const travailExterieurMapped = inconfortThermique.map(travailExtMapper);
  const travailExterieurTerritoire =
    type === 'commune'
      ? travailExterieurMapped.filter((e) => e.code_geographique === code)
      : type === 'ept' && eptRegex.test(libelle)
        ? travailExterieurMapped.filter((e) => e.ept === libelle)
        : type === 'epci' && !eptRegex.test(libelle)
          ? travailExterieurMapped.filter((e) => e.epci === code)
          : travailExterieurMapped;

  const sums = {
    sumAgriculture: sumProperty(travailExterieurTerritoire, 'NA5AZ_sum'),
    sumIndustries: sumProperty(travailExterieurTerritoire, 'NA5BE_sum'),
    sumConstruction: sumProperty(travailExterieurTerritoire, 'NA5FZ_sum'),
    sumCommerce: sumProperty(travailExterieurTerritoire, 'NA5GU_sum'),
    sumAdministration: sumProperty(travailExterieurTerritoire, 'NA5OQ_sum')
  };
  const graphData = EmploisEnExterieurPieChartData(sums);
  const travailExt =
    Number(
      ((100 * sums.sumConstruction) / Sum(Object.values(sums))).toFixed(1)
    ) +
    Number(((100 * sums.sumAgriculture) / Sum(Object.values(sums))).toFixed(1));
  const exportData = IndicatorExportTransformations.inconfort_thermique.travailExt(travailExterieurTerritoire);
  const sumAllCount = graphData.reduce((sum, item) => sum + (item.count || 0), 0);

  return (
    <>
      <div className={styles.datavizContainer}>
        <div className={styles.dataTextWrapper}>
          <div className={styles.chiffreDynamiqueWrapper}>
            <MicroPieChart pourcentage={travailExt} arrondi={1} ariaLabel="Pourcentage de l'emploi en extérieur" />
            {
              sums.sumConstruction || sums.sumAgriculture ?
                <Body weight='bold' style={{ color: "var(--gris-dark)" }}>
                  Les métiers physiques en extérieur, comme ceux du BTP et de l’agriculture, sont
                  les plus exposés à la chaleur. Sur votre territoire, ces deux secteurs à risque
                  concentrent {" "}{Round(travailExt, 1)} % des emplois, soit{' '}
                  {Round((sums.sumAgriculture + sums.sumConstruction), 0)} personnes.
                </Body>
                : ""
            }
            <CustomTooltipNouveauParcours title={travailExterieurTooltipText} />
            <TravailExterieurText />
          </div>
        </div>
        <div className={styles.datavizWrapper}>
          {graphData ?
            <PieChartTravailExt
              graphData={graphData}
              travailExterieurTerritoire={travailExterieurTerritoire}
            /> : <Loader />
          }
          <SourceExport
            source="INSEE, Emplois au lieu de travail par sexe, secteur d'activité économique et catégorie socioprofessionnelle, 2021 (consultée en décembre 2024)"
            anchor='Emplois en extérieur'
            exportComponent={
              <ExportButtonNouveauParcours
                data={exportData}
                baseName="travail_exterieur"
                type={type}
                libelle={libelle}
                code={code}
                sheetName="Activités économiques"
              />
            }
            condition={sumAllCount > 0}
          />
        </div>
      </div>
    </>
  );
};
