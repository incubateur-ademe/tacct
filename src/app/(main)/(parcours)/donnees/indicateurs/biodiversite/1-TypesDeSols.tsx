'use client';
import DataNotFound from '@/assets/images/no_data_on_territory.svg';
import { MicroRemplissageTerritoire } from '@/components/charts/MicroDataviz';
import { generateMapPngBlob } from '@/components/exports/ExportPng';
import { ZipExportButtonNouveauParcours } from '@/components/exports/ZipExportButton';
import DataNotFoundForGraph from '@/components/graphDataNotFound';
import { vegetalisationLegend } from '@/components/maps/legends/datavizLegends';
import { LegendCompColor } from '@/components/maps/legends/legendComp';
import { Body } from '@/design-system/base/Textes';
import { vegetalisationMapper } from '@/lib/mapper/inconfortThermique';
import { ConfortThermique } from '@/lib/postgres/models';
import { IndicatorExportTransformations } from '@/lib/utils/export/environmentalDataExport';
import { exportAsZip } from '@/lib/utils/export/exportZipGeneric';
import { eptRegex } from '@/lib/utils/regex';
import { Round } from '@/lib/utils/reusableFunctions/round';
import { useSearchParams } from 'next/navigation';
import { lazy, useRef } from 'react';
import styles from '../../explorerDonnees.module.scss';
import { sumProperty } from '../fonctions';

const MapTiles = lazy(() => import('@/components/maps/mapTiles').then(m => ({ default: m.MapTiles })));

export const TypesDeSols = ({
  confortThermique,
  coordonneesCommunes,
  contoursCommunes
}: {
  confortThermique: Partial<ConfortThermique>[];
  coordonneesCommunes: {
    codes: string[];
    bbox: { minLng: number; minLat: number; maxLng: number; maxLat: number };
  } | null;
  contoursCommunes: { geometry: string } | null;
}) => {
  const searchParams = useSearchParams();
  const code = searchParams.get('code')!;
  const libelle = searchParams.get('libelle')!;
  const type = searchParams.get('type')!;
  const guyaneConditions =
    code &&
    !(
      code.startsWith('973') ||
      (type === 'epci' && code.startsWith('24973')) ||
      (type === 'epci' && code === '200027548') ||
      (type === 'pnr' && code === 'FR8000040')
    );
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const legendRef = useRef<HTMLDivElement>(null);

  // Parse la géométrie GeoJSON du contour du territoire
  const territoireContours = contoursCommunes
    ? [
      {
        type: 'Feature',
        properties: {
          epci: '',
          libelle_epci: '',
          libelle_geographique: libelle,
          code_geographique: code,
          coordinates: ''
        },
        geometry: JSON.parse(contoursCommunes.geometry)
      }
    ]
    : [];

  const vegetalisationMapped = confortThermique.map(vegetalisationMapper);
  const vegetalisationTerritoire =
    type === 'commune'
      ? vegetalisationMapped.filter((e) => e.code_geographique === code)
      : type === 'ept' && eptRegex.test(libelle)
        ? vegetalisationMapped.filter((e) => e.ept === libelle)
        : type === 'epci' && !eptRegex.test(libelle)
          ? vegetalisationMapped.filter((e) => e.epci === code)
          : vegetalisationMapped;

  const foretSum = sumProperty(
    vegetalisationTerritoire,
    'clc_3_foret_semiNaturel'
  );
  const foretPercent =
    (100 * foretSum) /
    (100 * sumProperty(vegetalisationTerritoire, 'superf_choro'));
  const exportData =
    IndicatorExportTransformations.inconfort_thermique.vegetalisation(
      vegetalisationTerritoire
    );

  return (
    <>
      <div className={styles.datavizMapContainer}>
        {/* Pour exclure la Guyane, si le code commence par "973" (communes et département), on l'exclut
        Pour les EPCI qui commencent par 24973, un PNR en Guyane avec code FR8000040, l'EPCI
        des Savanes qui est le code 200027548 */}
        {guyaneConditions && (
          <div
            className={styles.chiffreDynamiqueWrapper}
            style={{ alignItems: 'center' }}
          >
            {isNaN(foretPercent) || !isFinite(foretPercent) ? (
              ''
            ) : (
              <>
                {contoursCommunes && (
                  <MicroRemplissageTerritoire
                    pourcentage={foretPercent}
                    territoireContours={territoireContours}
                    arrondi={1}
                  />
                )}
                <div className={styles.text}>
                  <Body weight="bold" style={{ color: 'var(--gris-dark)' }}>
                    {foretPercent == Infinity ? 0 : Round(foretPercent, 1)} % de
                    votre territoire est recouvert par de la forêt ou des
                    espaces semi-naturels.
                  </Body>
                </div>
              </>
            )}
          </div>
        )}
        <Body
          size="sm"
          style={{
            marginTop:
              isNaN(foretPercent) || !guyaneConditions ? '0rem' : '1rem'
          }}
        >
          Les forêts et les espaces semi-naturels constituent des refuges
          essentiels pour la biodiversité, abritant 80 % des espèces terrestres.
          Ces milieux offrent habitat, nourriture et corridors de circulation
          pour la faune et la flore. Plus leur surface est importante et
          connectée, plus l'écosystème résiste aux pressions climatiques et
          humaines.
        </Body>
        <div className={styles.mapWrapper}>
          {confortThermique &&
            confortThermique.length &&
            coordonneesCommunes ? (
            <>
              <MapTiles
                coordonneesCommunes={coordonneesCommunes}
                mapRef={mapRef}
                mapContainer={mapContainer}
                bucketUrl="clc"
                layer="clc"
                paint={{
                  'fill-color': [
                    'match',
                    ['get', 'legend'],
                    'Continuous urban fabric',
                    '#ffff99',
                    'Discontinuous urban fabric',
                    '#ffff99',
                    'Industrial or commercial units',
                    '#ffff99',
                    'Road and rail networks and associated land',
                    '#ffff99',
                    'Port areas',
                    '#ffff99',
                    'Airports',
                    '#ffff99',
                    'Mineral extraction sites',
                    '#ffff99',
                    'Dump sites',
                    '#ffff99',
                    'Construction sites',
                    '#ffff99',
                    'Green urban areas',
                    '#7fc97f',
                    'Sport and leisure facilities',
                    '#ffff99',
                    'Non-irrigated arable land',
                    '#fdc086',
                    'Permanently irrigated land',
                    '#fdc086',
                    'Rice fields',
                    '#fdc086',
                    'Vineyards',
                    '#fdc086',
                    'Fruit trees and berry plantations',
                    '#fdc086',
                    'Olive groves',
                    '#fdc086',
                    'Pastures',
                    '#fdc086',
                    'Annual crops associated with permanent crops',
                    '#fdc086',
                    'Complex cultivation patterns',
                    '#fdc086',
                    'Land principally occupied by agriculture, with significant areas of natural vegetation',
                    '#fdc086',
                    'Agro-forestry areas',
                    '#fdc086',
                    'Broad-leaved forest',
                    '#7fc97f',
                    'Coniferous forest',
                    '#7fc97f',
                    'Mixed forest',
                    '#7fc97f',
                    'Natural grasslands',
                    '#7fc97f',
                    'Moors and heathland',
                    '#7fc97f',
                    'Sclerophyllous vegetation',
                    '#7fc97f',
                    'Transitional woodland-shrub',
                    '#7fc97f',
                    'Beaches, dunes, sands',
                    '#7fc97f',
                    'Bare rocks',
                    '#7fc97f',
                    'Sparsely vegetated areas',
                    '#7fc97f',
                    'Burnt areas',
                    '#7fc97f',
                    'Glaciers and perpetual snow',
                    '#7fc97f',
                    'Inland marshes',
                    '#beaed4',
                    'Peat bogs',
                    '#beaed4',
                    'Salt marshes',
                    '#beaed4',
                    'Salines',
                    '#beaed4',
                    'Intertidal flats',
                    '#beaed4',
                    'Water courses',
                    '#386cb0',
                    'Water bodies',
                    '#386cb0',
                    'Coastal lagoons',
                    '#386cb0',
                    'Estuaries',
                    '#386cb0',
                    'Sea and ocean',
                    '#386cb0',
                    'white'
                  ],
                  'fill-opacity': 0.6
                }}
              />
              <div
                ref={legendRef}
                className={styles.legendTypesDeSols}
                style={{ width: 'auto', justifyContent: 'center' }}
              >
                <LegendCompColor legends={vegetalisationLegend} />
              </div>
            </>
          ) : (
            <div className="p-10 flex flex-row justify-center">
              <DataNotFoundForGraph image={DataNotFound} />
            </div>
          )}
        </div>
      </div>
      {confortThermique && confortThermique.length && (
        <div className={styles.sourcesExportMapWrapper}>
          <Body size="sm" style={{ color: 'var(--gris-dark)' }}>
            Source : CORINE Land Cover, 2018 (consultée en décembre 2024)
          </Body>
          <ZipExportButtonNouveauParcours
            anchor="Types de sols"
            handleExport={async () => {
              const pngBlob = await generateMapPngBlob({
                mapRef,
                mapContainer,
                documentDiv: legendRef.current!
              });
              if (!pngBlob) {
                alert("Erreur lors de la génération de l'image PNG.");
                return;
              }
              await exportAsZip({
                excelFiles: [
                  {
                    data: exportData,
                    baseName: 'vegetalisation',
                    sheetName: 'Végétalisation',
                    type,
                    libelle
                  }
                ],
                blobFiles: [
                  {
                    blob: pngBlob,
                    filename: `Carte_Vegetalisation_${type}_${libelle}.png`
                  }
                ],
                zipFilename: `vegetalisation_export_${new Date().toISOString().split('T')[0]}.zip`
              });
            }}
            code={code}
            libelle={libelle}
            type={type}
            thematique="types_de_sols"
          >
            Exporter
          </ZipExportButtonNouveauParcours>
        </div>
      )}
    </>
  );
};
