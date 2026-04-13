'use client';

import DataNotFound from '@/assets/images/no_data_on_territory.svg';
import { MicroNumberCircle } from '@/components/charts/MicroDataviz';
import { ExportButtonNouveauParcours } from '@/components/exports/ExportButton';
import DataNotFoundForGraph from '@/components/graphDataNotFound';
import { espacesNAFDatavizLegend } from '@/components/maps/legends/datavizLegends';
import { LegendCompColor } from '@/components/maps/legends/legendComp';
import { ReadMoreFade } from '@/components/utils/ReadMoreFade';
import { CustomTooltipNouveauParcours } from '@/components/utils/Tooltips';
import { Body } from '@/design-system/base/Textes';
import { ConsommationNAF, TableCommuneModel } from '@/lib/postgres/models';
import { SolsImpermeabilisesText } from '@/lib/staticTexts';
import { SolsImpermeabilisesBiodiversiteDynamicText } from '@/lib/textesIndicateurs/biodiversiteDynamicTexts';
import { espacesNAFTooltipText } from '@/lib/tooltipTexts';
import { consommationEspacesNafDoc } from '@/lib/utils/export/documentations';
import { IndicatorExportTransformations } from '@/lib/utils/export/environmentalDataExport';
import { useSearchParams } from 'next/navigation';
import { lazy } from 'react';
import styles from '../../explorerDonnees.module.scss';

const MapEspacesNaf = lazy(() => import('@/components/maps/mapEspacesNAF').then(m => ({ default: m.MapEspacesNaf })));

export const SolsImpermeabilises = (props: {
  consommationNAF: ConsommationNAF[];
  coordonneesCommunes: { codes: string[], bbox: { minLng: number, minLat: number, maxLng: number, maxLat: number } } | null;
  tableCommune: TableCommuneModel[];
}) => {
  const { consommationNAF, coordonneesCommunes, tableCommune } = props;
  const searchParams = useSearchParams();
  const code = searchParams.get('code')!;
  const type = searchParams.get('type')!;
  const libelle = searchParams.get('libelle')!;
  const atlasBiodiversite = tableCommune.filter((el) =>
    el.atlas_biodiversite_avancement !== null &&
    el.atlas_biodiversite_annee_debut !== null
  );
  const sumNaf = (type === "commune"
    ? consommationNAF.filter((item) => item.code_geographique === code)[0]
      ?.naf09art23
    : consommationNAF.reduce((acc, item) => acc + (item.naf09art23 ?? 0), 0));

  const exportData = IndicatorExportTransformations.biodiversite.EspacesNaf(consommationNAF);

  return (
    <>
      <div className={styles.datavizMapContainer}>
        <div className={styles.dataTextWrapper}>
          <div className={styles.chiffreDynamiqueWrapper}>
            {
              sumNaf !== null &&
              <>
                <MicroNumberCircle valeur={sumNaf / 10000} arrondi={1} unite='ha' />
                <div className={styles.text}>
                  <SolsImpermeabilisesBiodiversiteDynamicText
                    sumNaf={sumNaf}
                    atlasBiodiversite={atlasBiodiversite}
                    type={type}
                  />
                  <CustomTooltipNouveauParcours
                    title={espacesNAFTooltipText}
                    texte="D'où vient ce chiffre ?"
                  />
                </div>
              </>
            }
          </div>
          <div className='mt-4 pr-5'>
            <ReadMoreFade maxHeight={100}>
              <SolsImpermeabilisesText />
            </ReadMoreFade>
          </div>
        </div>
        <div className={styles.mapWrapper}>
          {
            consommationNAF && coordonneesCommunes ? (
              <>
                <MapEspacesNaf
                  consommationNAF={consommationNAF}
                  communesCodes={coordonneesCommunes?.codes ?? []}
                  boundingBox={
                    coordonneesCommunes ? [
                      [coordonneesCommunes.bbox.minLng, coordonneesCommunes.bbox.minLat],
                      [coordonneesCommunes.bbox.maxLng, coordonneesCommunes.bbox.maxLat]
                    ] : undefined
                  }
                />
                <div
                  className={styles.legend}
                  style={{ width: 'auto', justifyContent: 'center' }}
                >
                  <LegendCompColor legends={espacesNAFDatavizLegend} />
                </div>
              </>
            ) : <div className='p-10 flex flex-row justify-center'>
              <DataNotFoundForGraph image={DataNotFound} />
            </div>
          }
        </div>
      </div>
      <div className={styles.sourcesExportMapWrapper}>
        <Body size='sm' style={{ color: "var(--gris-dark)" }}>
          Source : CEREMA, 2024 (consultée en décembre 2024)
        </Body>
        {
          consommationNAF && coordonneesCommunes && (
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
          )}
      </div>
    </>
  );
};
