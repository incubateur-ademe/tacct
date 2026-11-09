'use client';

import DataNotFound from '@/assets/images/no_data_on_territory.svg';
import { MicroNumberCircle } from '@/components/charts/MicroDataviz';
import { ExportButton } from '@/components/exports/ExportButton';
import DataNotFoundForGraph from '@/components/graphDataNotFound';
import { stationsSkiTailleLegend } from '@/components/maps/legends/datavizLegends';
import { LegendCompColor } from '@/components/maps/legends/legendComp';
import { Loader } from '@/components/ui/loader';
import { ReadMoreFade } from '@/components/utils/ReadMoreFade';
import { CustomTooltipNouveauParcours } from '@/components/utils/Tooltips';
import { Body } from '@/design-system/base/Textes';
import { StationSki, StationsSkiModel } from '@/lib/postgres/models';
import { StationsSkiText } from '@/lib/staticTexts';
import { StationsSkiDynamicText } from '@/lib/textesIndicateurs/tourismeDynamicTexts';
import { stationsSkiTooltipText } from '@/lib/tooltipTexts';
import { IndicatorExportTransformations } from '@/lib/utils/export/environmentalDataExport';
import { useSearchParams } from 'next/navigation';
import { lazy, Suspense } from 'react';
import styles from '../../explorerDonnees.module.scss';

const MapStationsSki = lazy(() =>
  import('@/components/maps/mapStationsSki').then((m) => ({
    default: m.MapStationsSki
  }))
);

const SOURCE = 'Source : STRMTG, 2026 ; INRAE, 2026 (consultée en novembre 2026)';

const stationsUniques = (communes: StationsSkiModel[]) => [
  ...new Map(
    communes.flatMap((c) => c.stations).map((s) => [s.id, s])
  ).values()
];

const ageParcPondere = (stations: StationSki[]) => {
  const puissance = stations.reduce((acc, s) => acc + s.momentPuissance, 0);
  if (puissance <= 0) return null;
  return Math.round(
    stations.reduce((acc, s) => acc + s.ageParc * s.momentPuissance, 0) / puissance
  );
};

const plusGrandeStation = (stations: StationSki[]) =>
  stations.reduce<StationSki | null>(
    (max, s) => (max === null || s.momentPuissance > max.momentPuissance ? s : max),
    null
  );

export const StationsSki = ({
  stationsSki,
  coordonneesCommunes
}: {
  stationsSki: StationsSkiModel[];
  coordonneesCommunes: {
    codes: string[];
    bbox: { minLng: number; minLat: number; maxLng: number; maxLat: number };
  } | null;
}) => {
  const searchParams = useSearchParams();
  const code = searchParams.get('code')!;
  const type = searchParams.get('type')!;
  const libelle = searchParams.get('libelle')!;

  const territoire =
    type === 'commune'
      ? stationsSki.filter((c) => c.code_geographique === code)
      : stationsSki;
  const stations = stationsUniques(territoire);
  const ageParc = ageParcPondere(stations);

  const donneesCarte = stationsSki.map((c) => ({
    code: c.code_geographique,
    name: c.libelle_geographique,
    stations: c.stations,
    taille: plusGrandeStation(c.stations)?.taille ?? null
  }));
  const exportData = IndicatorExportTransformations.tourisme.StationsSki(territoire);

  return (
    <>
      <div className={styles.datavizMapContainer}>
        <div className={styles.chiffreDynamiqueWrapper}>
          {ageParc !== null && (
            <MicroNumberCircle
              valeur={ageParc}
              arrondi={0}
              unite="ans"
              ariaLabel={
                type === 'commune'
                  ? 'Âge moyen du parc de remontées mécaniques des stations de votre commune'
                  : 'Âge moyen du parc de remontées mécaniques des stations de votre territoire'
              }
            />
          )}
          <div className={styles.text}>
            <StationsSkiDynamicText
              stations={stations}
              ageParc={ageParc}
              type={type}
            />
            <CustomTooltipNouveauParcours
              title={stationsSkiTooltipText}
              texte="D'où vient ce chiffre ?"
            />
          </div>
        </div>
        <div className="mt-4 pr-5">
          <ReadMoreFade maxHeight={150}>
            <StationsSkiText />
          </ReadMoreFade>
        </div>
        <div className={styles.mapWrapper}>
          {coordonneesCommunes && stationsSki.length > 0 ? (
            <Suspense fallback={<Loader />}>
              <MapStationsSki
                communesCodes={coordonneesCommunes.codes}
                stationsSki={donneesCarte}
                boundingBox={[
                  [coordonneesCommunes.bbox.minLng, coordonneesCommunes.bbox.minLat],
                  [coordonneesCommunes.bbox.maxLng, coordonneesCommunes.bbox.maxLat]
                ]}
              />
              <div
                className={styles.legend}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                  justifyContent: 'center',
                  alignItems: 'center',
                  textAlign: 'center'
                }}
              >
                <Body weight="bold">
                  - Taille de la station de ski -
                </Body>
                <LegendCompColor legends={stationsSkiTailleLegend} />
              </div>
            </Suspense>
          ) : (
            <div className={styles.dataNotFoundForMap}>
              <DataNotFoundForGraph image={DataNotFound} />
            </div>
          )}
        </div>
      </div>
      {exportData.length > 0 ? (
        <div className={styles.sourcesExportMapWrapper}>
          <Body size="sm" style={{ color: 'var(--gris-dark)' }}>
            {SOURCE}
          </Body>
          <ExportButton
            data={exportData}
            baseName="stations_ski"
            type={type}
            libelle={libelle}
            code={code}
            sheetName="Stations de ski"
            anchor="Stations-de-ski"
          />
        </div>
      ) : (
        <div
          className={styles.sourcesExportWrapper}
          style={{
            margin: '0 -2rem',
            borderTop: '1px solid var(--gris-medium)',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: 0
          }}
        >
          <Body size="sm" style={{ color: 'var(--gris-dark)' }}>
            {SOURCE}
          </Body>
          <Body size="sm" style={{ color: 'var(--gris-dark)' }}>
            Export indisponible : données non référencées ou nulles.
          </Body>
        </div>
      )}
    </>
  );
};
