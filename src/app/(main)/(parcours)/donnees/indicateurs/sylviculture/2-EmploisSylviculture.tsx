'use client';

import { MicroPieChart } from '@/components/charts/MicroDataviz';
import { PieChartEmploisSylviculture } from '@/components/charts/sylviculture/pieChartEmploisSylviculture';
import { ExportButton } from '@/components/exports/ExportButton';
import { ReadMoreFade } from '@/components/utils/ReadMoreFade';
import { CustomTooltipNouveauParcours } from '@/components/utils/Tooltips';
import { EmploisSylvicultureModel } from '@/lib/postgres/models';
import { EmploisSylvicultureText } from '@/lib/staticTexts';
import { sansDoublonArrondissements } from '@/lib/territoireData/arrondissements';
import { EmploisSylvicultureDynamicText } from '@/lib/textesIndicateurs/sylvicultureDynamicTexts';
import { emploisSylvicultureTooltipText } from '@/lib/tooltipTexts';
import { IndicatorExportTransformations } from '@/lib/utils/export/environmentalDataExport';
import { useSearchParams } from 'next/navigation';
import styles from '../../explorerDonnees.module.scss';
import { sumProperty } from '../fonctions';
import { SourceExport } from '../SourceExport';

export const EmploisSylviculture = ({
  emploisSylviculture
}: {
  emploisSylviculture: EmploisSylvicultureModel[];
}) => {
  const searchParams = useSearchParams();
  const code = searchParams.get('code')!;
  const type = searchParams.get('type')!;
  const libelle = searchParams.get('libelle')!;

  const territoire = sansDoublonArrondissements(
    emploisSylviculture,
    (c) => c.code_geographique,
    (codeArrondissement) =>
      emploisSylviculture.some(
        (c) => c.code_geographique === codeArrondissement && c.postes_total !== null
      )
  );
  const donneesReferencees = territoire.some((c) => c.postes_total !== null);
  const postesSylviculture = sumProperty(territoire, 'postes_sylviculture');
  const postesTravailBois = sumProperty(territoire, 'postes_travail_bois');
  const postesTotal = sumProperty(territoire, 'postes_total');
  const postes = donneesReferencees ? postesSylviculture + postesTravailBois : null;
  const part =
    postes !== null && postesTotal > 0 ? (100 * postes) / postesTotal : null;

  const partDe = (valeur: number) =>
    postesTotal > 0 ? (100 * valeur) / postesTotal : 0;
  const postesAutres = Math.max(0, postesTotal - postesSylviculture - postesTravailBois);
  const graphData = [
    {
      id: 'Sylviculture et exploitation forestière',
      label: 'Sylviculture et exploitation forestière',
      value: partDe(postesSylviculture),
      count: postesSylviculture
    },
    {
      id: 'Travail du bois',
      label: 'Travail du bois',
      value: partDe(postesTravailBois),
      count: postesTravailBois
    },
    {
      id: 'Autres secteurs',
      label: 'Autres secteurs',
      value: partDe(postesAutres),
      count: postesAutres
    }
  ];
  const exportData =
    IndicatorExportTransformations.sylviculture.EmploisSylviculture(territoire);

  return (
    <div className={styles.datavizContainer}>
      <div className={styles.dataTextWrapper}>
        <div className={styles.chiffreDynamiqueWrapper}>
          {part !== null && (
            <MicroPieChart
              pourcentage={part}
              arrondi={1}
              ariaLabel="Part de la sylviculture, de l’exploitation forestière et du travail du bois dans les postes salariés"
            />
          )}
          <div className={styles.text}>
            <EmploisSylvicultureDynamicText
              part={part}
              postes={postes}
              type={type}
              sansEpci={territoire.some((c) => c.epci === 'ZZZZZZZZZ')}
            />
            <CustomTooltipNouveauParcours
              title={emploisSylvicultureTooltipText}
              texte="D'où vient ce chiffre ?"
            />
          </div>
        </div>
        <div className="mt-4">
          <ReadMoreFade maxHeight={500}>
            <EmploisSylvicultureText />
          </ReadMoreFade>
        </div>
      </div>
      <div className={styles.datavizWrapper}>
        <PieChartEmploisSylviculture
          graphData={graphData}
          donneesReferencees={donneesReferencees}
        />
        <SourceExport
          source="INSEE, Flores 2024 (consultée en novembre 2026)"
          anchor="Emplois-de-la-sylviculture"
          condition={exportData.length > 0 && donneesReferencees}
          exportComponent={
            <ExportButton
              data={exportData}
              baseName="emplois_sylviculture"
              type={type}
              libelle={libelle}
              code={code}
              sheetName="Emplois de la sylviculture"
            />
          }
        />
      </div>
    </div>
  );
};
