'use client';

import DataNotFound from '@/assets/images/no_data_on_territory.svg';
import { MicroRemplissageTerritoire } from '@/components/charts/MicroDataviz';
import { ExportButtonNouveauParcours } from '@/components/exports/ExportButton';
import DataNotFoundForGraph from '@/components/graphDataNotFound';
import { surfacesIrrigueesLegend } from '@/components/maps/legends/datavizLegends';
import { LegendCompColor } from '@/components/maps/legends/legendComp';
import { Loader } from '@/components/ui/loader';
import { ReadMoreFade } from '@/components/utils/ReadMoreFade';
import { CustomTooltipNouveauParcours } from '@/components/utils/Tooltips';
import { Body } from '@/design-system/base/Textes';
import { TableCommuneModel } from '@/lib/postgres/models';
import { SurfacesIrrigueesText } from '@/lib/staticTexts';
import { surfacesIrrigueesTooltipText } from '@/lib/tooltipTexts';
import { IndicatorExportTransformations } from '@/lib/utils/export/environmentalDataExport';
import { Round } from '@/lib/utils/reusableFunctions/round';
import { useSearchParams } from 'next/navigation';
import { lazy, Suspense } from 'react';
import styles from '../../explorerDonnees.module.scss';

const MapSurfacesIrriguees = lazy(() => import('@/components/maps/mapSurfacesIrriguees').then(m => ({ default: m.MapSurfacesIrriguees })));

export const SuperficiesIrriguees = (props: {
  tableCommune: TableCommuneModel[];
  coordonneesCommunes: { codes: string[], bbox: { minLng: number, minLat: number, maxLng: number, maxLat: number } } | null;
  contoursCommunes: { geometry: string } | null;
}) => {
  const { tableCommune, coordonneesCommunes, contoursCommunes } = props;
  const searchParams = useSearchParams();
  const code = searchParams.get('code')!;
  const type = searchParams.get('type')!;
  const libelle = searchParams.get('libelle')!;
  // Parse la géométrie GeoJSON du contour du territoire
  const territoireContours = contoursCommunes ? [{
    type: 'Feature' as const,
    properties: {
      epci: '',
      libelle_epci: '',
      libelle_geographique: libelle,
      code_geographique: code,
      coordinates: ''
    },
    geometry: JSON.parse(contoursCommunes.geometry)
  }] : [];

  const tableFiltered = type === "commune"
    ? tableCommune.filter(c => c.code_geographique === code)
    : tableCommune

  const surfacesIrrigueesData = tableCommune.map(c => ({
    code: c.code_geographique,
    value: c.part_irr_sau_2020 === null ? null : Number(c.part_irr_sau_2020),
    name: c.libelle_geographique
  }))

  const surfaceTerritoire = type === "commune"
    ? tableFiltered[0]?.part_irr_sau_2020 ? Number(tableFiltered[0].part_irr_sau_2020) : undefined
    : tableFiltered.length > 0
      ? (tableFiltered
        .map(c => Number(c.part_irr_sau_2020) || 0)
        .reduce((acc, value) => acc + value, 0)) / tableFiltered.length
      : undefined;

  const exportData = IndicatorExportTransformations.agriculture.surfacesIrriguees(tableFiltered);

  return (
    <>
      <div className={styles.datavizMapContainer}>
        <div className={styles.chiffreDynamiqueWrapper}>
          {
            surfaceTerritoire !== undefined && !isNaN(surfaceTerritoire) ? (
              <>
                {contoursCommunes && (
                  <MicroRemplissageTerritoire
                    key={`${type}-${code}-${libelle}`}
                    pourcentage={surfaceTerritoire ?? 0}
                    territoireContours={territoireContours}
                    arrondi={1}
                  />
                )}
                <div className={styles.text}>
                  <Body weight='bold' style={{ color: "var(--gris-dark)" }}>
                    Une réalité locale :{' '}
                    {Round(surfaceTerritoire ?? 0, 1)} % de votre agriculture dépend de l'irrigation.
                  </Body>
                  <CustomTooltipNouveauParcours
                    title={surfacesIrrigueesTooltipText}
                    texte="D'où vient ce chiffre ?"
                  />
                </div>
              </>
            ) : (
              <Body weight='bold' style={{ color: "var(--gris-dark)" }}>
                Il n'y a pas de données référencées sur le territoire que vous avez sélectionné
              </Body>
            )
          }
        </div>
        <div className='mt-4 pr-5'>
          <ReadMoreFade maxHeight={100}>
            <SurfacesIrrigueesText />
          </ReadMoreFade>
        </div>
        <div className={styles.mapWrapper}>
          {
            coordonneesCommunes && tableFiltered.length > 0 ? (
              <Suspense fallback={<Loader />}>
                <MapSurfacesIrriguees
                  communesCodes={coordonneesCommunes.codes}
                  surfacesIrriguees={surfacesIrrigueesData}
                  boundingBox={[
                    [coordonneesCommunes.bbox.minLng, coordonneesCommunes.bbox.minLat],
                    [coordonneesCommunes.bbox.maxLng, coordonneesCommunes.bbox.maxLat]
                  ]}
                />
                <div
                  className={styles.legend}
                  style={{ width: 'auto', justifyContent: 'center' }}
                >
                  <LegendCompColor legends={surfacesIrrigueesLegend} />
                </div>
              </Suspense>
            ) : (
              <div className={styles.dataNotFoundForMap}>
                <DataNotFoundForGraph image={DataNotFound} />
              </div>
            )
          }
        </div>
      </div>
      {
        surfaceTerritoire !== undefined && !isNaN(surfaceTerritoire) && surfaceTerritoire !== 0 ? (
          <div className={styles.sourcesExportMapWrapper}>
            <Body size='sm' style={{ color: "var(--gris-dark)" }}>
              Source : AGRESTE, 2020 (consultée en novembre 2025)
            </Body>
            <ExportButtonNouveauParcours
              data={exportData}
              baseName="surfaces_irriguees"
              type={type}
              libelle={libelle}
              code={code}
              sheetName="Surfaces irriguées"
              anchor='Superficies irriguées'
            />
          </div>
        ) : (
          <div
            className={styles.sourcesExportWrapper}
            style={{
              marginLeft: '-2rem',
              borderTop: '1px solid var(--gris-medium)',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: 0
            }}>
            <Body size='sm' style={{ color: "var(--gris-dark)" }}>
              Source : AGRESTE, 2020 (consultée en novembre 2025)
            </Body>
            <Body size='sm' style={{ color: "var(--gris-dark)" }}>Export indisponible : données non référencées ou nulles.</Body>
          </div>
        )
      }
    </>
  );
};
