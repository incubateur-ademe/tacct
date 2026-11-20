'use client';
import { OngletsGraphiqueCarte } from '@/components/charts/inconfortThermique/ongletsGraphiqueCarte';
import { PieChartTravailExt } from '@/components/charts/inconfortThermique/pieChartTravailExt';
import { MicroPieChart } from '@/components/charts/MicroDataviz';
import { ExportButton } from '@/components/exports/ExportButton';
import { emploisExterieursClasses } from '@/components/maps/legends/datavizLegends';
import { Loader } from '@/components/ui/loader';
import { CustomTooltipNouveauParcours } from '@/components/utils/Tooltips';
import { Body } from '@/design-system/base/Textes';
import { travailExtMapper } from '@/lib/mapper/inconfortThermique';
import { ConfortThermique } from '@/lib/postgres/models';
import { TravailExterieurText } from '@/lib/staticTexts';
import { sansDoublonArrondissements } from '@/lib/territoireData/arrondissements';
import { travailExterieurTooltipText } from '@/lib/tooltipTexts';
import { IndicatorExportTransformations } from '@/lib/utils/export/environmentalDataExport';
import { eptRegex } from '@/lib/utils/regex';
import { Round } from '@/lib/utils/reusableFunctions/round';
import { Sum } from '@/lib/utils/reusableFunctions/sum';
import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import styles from '../../explorerDonnees.module.scss';
import { aUneValeurParCode, carteParCommune, sumProperty } from '../fonctions';
import { EmploisEnExterieurPieChartData } from '../graphData';
import { SourceExport } from '../SourceExport';

export const EmploisEnExterieur = ({
  inconfortThermique,
  coordonneesCommunes
}: {
  inconfortThermique: ConfortThermique[];
  coordonneesCommunes: {
    codes: string[];
    bbox: { minLng: number; minLat: number; maxLng: number; maxLat: number };
  } | null;
}) => {
  const searchParams = useSearchParams();
  const code = searchParams.get('code')!;
  const libelle = searchParams.get('libelle')!;
  const type = searchParams.get('type')!;
  const travailExterieurMapped = inconfortThermique.map(travailExtMapper);
  const partsParCommune = useMemo(
    () =>
      inconfortThermique.map(travailExtMapper).map((e) => {
        const emplois =
          e.NA5AZ_sum + e.NA5BE_sum + e.NA5FZ_sum + e.NA5GU_sum + e.NA5OQ_sum;
        return {
          code: e.code_geographique,
          name: e.libelle_geographique,
          part:
            emplois > 0 ? (100 * (e.NA5AZ_sum + e.NA5FZ_sum)) / emplois : null
        };
      }),
    [inconfortThermique]
  );
  const travailExterieurTerritoire =
    type === 'commune'
      ? travailExterieurMapped.filter((e) => e.code_geographique === code)
      : sansDoublonArrondissements(
          type === 'ept' && eptRegex.test(libelle)
            ? travailExterieurMapped.filter((e) => e.ept === libelle)
            : type === 'epci' && !eptRegex.test(libelle)
              ? travailExterieurMapped.filter((e) => e.epci === code)
              : travailExterieurMapped,
          (e) => e.code_geographique,
          aUneValeurParCode(partsParCommune)
        );
  const carte = useMemo(
    () =>
      carteParCommune(type, coordonneesCommunes, partsParCommune, {
        classes: emploisExterieursClasses,
        titreLegende:
          'Part des emplois dans l’agriculture et la construction en 2021',
        libelleInfobulle: 'Part des emplois dans l’agriculture et la construction',
        ariaLabel:
          'Carte représentant la part des emplois dans l’agriculture et la construction dans chaque commune de votre territoire en 2021'
      }),
    [type, coordonneesCommunes, partsParCommune]
  );

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
  const exportData = IndicatorExportTransformations.confortThermique.travailExt(
    travailExterieurTerritoire
  );
  const sumAllCount = graphData.reduce(
    (sum, item) => sum + (item.count || 0),
    0
  );

  return (
    <>
      <div className={styles.datavizContainer}>
        <div className={styles.dataTextWrapper}>
          <div className={styles.chiffreDynamiqueWrapper}>
            <MicroPieChart
              pourcentage={travailExt}
              arrondi={1}
              ariaLabel="Pourcentage de l'emploi en extérieur"
            />
            {sums ? (
              <Body weight="bold" style={{ color: 'var(--gris-dark)' }}>
                Les métiers physiques en extérieur, comme ceux du BTP et de
                l’agriculture, sont les plus exposés à la chaleur. Sur votre
                territoire, ces deux secteurs à risque concentrent{' '}
                {Round(travailExt, 1)} % des emplois, soit{' '}
                {Round(sums.sumAgriculture + sums.sumConstruction, 0)}{' '}
                personnes.
              </Body>
            ) : (
              ''
            )}
            <CustomTooltipNouveauParcours title={travailExterieurTooltipText} />
            <TravailExterieurText />
          </div>
        </div>
        <div className={styles.datavizWrapper}>
          {graphData ? (
            <OngletsGraphiqueCarte
              ongletGraphique="Répartition"
              carte={carte}
              graphique={
                <PieChartTravailExt
                  graphData={graphData}
                  travailExterieurTerritoire={travailExterieurTerritoire}
                />
              }
            />
          ) : (
            <Loader />
          )}
          <SourceExport
            source="INSEE, Emplois au lieu de travail par sexe, secteur d'activité économique et catégorie socioprofessionnelle, 2021 (consultée en décembre 2024)"
            anchor="Emplois-en-extérieur"
            exportComponent={
              <ExportButton
                data={exportData}
                baseName="travail_exterieur"
                type={type}
                libelle={libelle}
                code={code}
                sheetName="Activités-économiques"
              />
            }
            condition={sumAllCount > 0}
          />
        </div>
      </div>
    </>
  );
};
