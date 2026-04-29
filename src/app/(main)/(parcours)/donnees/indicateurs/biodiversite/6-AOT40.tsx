"use client";
import DataNotFound from '@/assets/images/no_data_on_territory.svg';
import { MicroNumberCircle } from '@/components/charts/MicroDataviz';
import { ExportButton } from '@/components/exports/ExportButton';
import DataNotFoundForGraph from "@/components/graphDataNotFound";
import { aot40Legends } from '@/components/maps/legends/datavizLegends';
import { LegendCompColor } from '@/components/maps/legends/legendComp';
import { Loader } from '@/components/ui/loader';
import { CustomTooltipNouveauParcours } from '@/components/utils/Tooltips';
import { Body } from "@/design-system/base/Textes";
import { AOT40 } from "@/lib/postgres/models";
import { AOT40Text } from '@/lib/staticTexts';
import { AOT40DynamicText } from '@/lib/textesIndicateurs/biodiversiteDynamicTexts';
import { AOT40TooltipText } from '@/lib/tooltipTexts';
import { IndicatorExportTransformations } from '@/lib/utils/export/environmentalDataExport';
import { Any } from '@/lib/utils/types';
import * as turf from '@turf/turf';
import type { Feature, MultiPoint, Point } from 'geojson';
import { useSearchParams } from "next/navigation";
import { lazy, Suspense } from 'react';
import styles from '../../explorerDonnees.module.scss';

const MapAOT40 = lazy(() => import('@/components/maps/mapAOT40').then(m => ({ default: m.MapAOT40 })));

type NearestPoint = Feature<Point, {
  featureIndex: number;
  distanceToPoint: number;
  [key: string]: Any;
}>;

export const OzoneEtVegetation = (props: {
  aot40: AOT40[];
  contoursCommunes: { geometry: string } | null;
  communesCodes: string[];
}) => {
  const { aot40, contoursCommunes, communesCodes } = props;
  const searchParams = useSearchParams();
  const code = searchParams.get('code')!;
  const libelle = searchParams.get('libelle')!;
  const type = searchParams.get('type')!;

  // Calculate center coordinates from territory geometry
  const territoireGeometry = contoursCommunes ? JSON.parse(contoursCommunes.geometry) : null;
  const polygonTerritoire = territoireGeometry ? turf.feature(territoireGeometry) : null;
  const centroid = polygonTerritoire ? turf.centroid(polygonTerritoire).geometry.coordinates : null;
  // GeoJSON uses [longitude, latitude], but we need [latitude, longitude] to match AOT40 data
  const centerCoord = centroid ? [centroid[1], centroid[0]] : [0, 0];
  // Transform AOT40 data and calculate station with max value
  let stationWithMaxValue: Feature<Point | MultiPoint, { value: number; nom_site: string; }>[] | null = null;
  let nearestStation: NearestPoint | null = null;

  if (aot40 && aot40.length > 0) {
    const aot40map = aot40.map((station: AOT40) =>
      turf.point([station.Latitude, station.Longitude], {
        value: station.valeur_brute,
        nom_site: station.nom_site,
      })
    );

    const pointCollection = turf.featureCollection(aot40map);
    const centerPoint = turf.point(centerCoord as [number, number]);
    nearestStation = turf.nearestPoint(centerPoint, pointCollection);
    const circle = turf.circle(centerPoint, nearestStation.properties.distanceToPoint + 20, { steps: 10, units: 'kilometers' });
    const stationsWithinCircle = turf.pointsWithinPolygon(pointCollection, circle);
    if (stationsWithinCircle.features.length > 0) {
      stationWithMaxValue = stationsWithinCircle.features
        .filter((f) => f.properties?.value === Math.max(...stationsWithinCircle.features.map((f) => f.properties?.value)));
    }
  }
  const exportData = IndicatorExportTransformations.biodiversite.aot40(aot40);

  return (
    <>
      <div className={styles.datavizMapContainer}>
        <div className={styles.chiffreDynamiqueWrapper} >
          {stationWithMaxValue && <MicroNumberCircle valeur={stationWithMaxValue[0].properties.value} arrondi={0} unite='µg/m³' ariaLabel="Valeur maximale d'AOT40 mesurée sur votre territoire, en microgrammes par mètre cube" />}
          <div className={styles.text}>
            <AOT40DynamicText
              stationWithMaxValue={stationWithMaxValue}
              nearestPoint={nearestStation!}
            />
            <CustomTooltipNouveauParcours
              title={AOT40TooltipText}
              texte="D'où vient ce chiffre ?"
            />
          </div>
        </div>
        <div className='pr-5 pt-8'>
          <AOT40Text />
        </div>
        <div className={styles.mapWrapper}>
          {
            aot40.length && contoursCommunes ? (
              <Suspense fallback={<Loader />}>
                <MapAOT40
                  aot40={aot40}
                  contoursCommunes={contoursCommunes}
                  communesCodes={communesCodes}
                />
                <div
                  className={styles.legend}
                  style={{ width: 'auto', justifyContent: 'center' }}
                >
                  <LegendCompColor legends={aot40Legends} />
                </div>
              </Suspense>
            ) : <div className='p-10 flex flex-row justify-center'><DataNotFoundForGraph image={DataNotFound} /></div>
          }
        </div>
      </div>
      <div className={styles.sourcesExportMapWrapper}>
        <Body size='sm' style={{ color: "var(--gris-dark)" }}>
          Source : Geod’air (2024)
        </Body>
        {
          aot40.length && contoursCommunes && (
            <ExportButton
              data={exportData}
              baseName="aot_40"
              type={type}
              libelle={libelle}
              code={code}
              sheetName="AOT 40"
              anchor='Ozone-et-végétation'
            />
          )}
      </div>
    </>
  );
};
