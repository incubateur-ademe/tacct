'use client';

import DataNotFound from '@/assets/images/no_data_on_territory.svg';
import { MicroPieChart } from '@/components/charts/MicroDataviz';
import DataNotFoundForGraph from '@/components/graphDataNotFound';
import { surfaceForetLegend } from '@/components/maps/legends/datavizLegends';
import { LegendCompColor } from '@/components/maps/legends/legendComp';
import { Loader } from '@/components/ui/loader';
import { ReadMoreFade } from '@/components/utils/ReadMoreFade';
import { CustomTooltipNouveauParcours } from '@/components/utils/Tooltips';
import { Body } from '@/design-system/base/Textes';
import { TableCommuneModel } from '@/lib/postgres/models';
import { SurfaceForetText } from '@/lib/staticTexts';
import { listeArrondissements } from '@/lib/territoireData/arrondissements';
import { SurfaceForetDynamicText } from '@/lib/textesIndicateurs/foretDynamicTexts';
import { SurfaceForetTooltipText } from '@/lib/tooltipTexts';
import { useSearchParams } from 'next/navigation';
import { lazy, Suspense } from 'react';
import styles from '../../explorerDonnees.module.scss';

const MapSurfaceForet = lazy(() =>
  import('@/components/maps/mapSurfaceForet').then((m) => ({
    default: m.MapSurfaceForet
  }))
);

// Sources de la ligne source :
// « IGN, 2021-2023 » : Masque Forêt v1, https://www.data.gouv.fr/datasets/masque-foret — producteur « Institut national de l'information géographique et forestière » ; « départements BD ORTHO® acquis entre 2021 et 2023 »
const SOURCE = 'Source : IGN, 2021-2023 (consultée en novembre 2026)';

// Plafonné à 100 % : la surface de communes_drom est parfois inférieure à la surface réelle (enclaves, arrondis)
const tauxBoisement = (surfaceForet: number | null, surfaceCommune: number | null) =>
  surfaceForet === null || surfaceCommune === null || surfaceCommune <= 0
    ? null
    : Math.min(1, surfaceForet / surfaceCommune);

export const SurfaceForet = ({
  tableCommune,
  coordonneesCommunes
}: {
  tableCommune: TableCommuneModel[];
  coordonneesCommunes: {
    codes: string[];
    bbox: { minLng: number; minLat: number; maxLng: number; maxLat: number };
  } | null;
}) => {
  const searchParams = useSearchParams();
  const code = searchParams.get('code')!;
  const type = searchParams.get('type')!;

  const renseignees = tableCommune.filter(
    (c) => c.surface_foret_ha !== null && c.surface_commune_ha !== null
  );
  const territoire =
    type === 'commune'
      ? renseignees.filter((c) => c.code_geographique === code)
      : renseignees.filter((c) => !listeArrondissements.includes(c.code_geographique));
  const surfaceForet = territoire.length
    ? territoire.reduce((acc, c) => acc + (c.surface_foret_ha ?? 0), 0)
    : null;
  const surfaceTerritoire = territoire.reduce((acc, c) => acc + (c.surface_commune_ha ?? 0), 0);
  const taux = tauxBoisement(surfaceForet, surfaceTerritoire);
  const tauxCommunes = territoire
    .map((c) => tauxBoisement(c.surface_foret_ha, c.surface_commune_ha))
    .filter((t): t is number => t !== null);
  const ecart =
    type !== 'commune' && tauxCommunes.length > 1
      ? { min: Math.min(...tauxCommunes), max: Math.max(...tauxCommunes) }
      : null;
  const codesTerritoire = type === 'commune' ? [code] : tableCommune.map((c) => c.code_geographique);
  const isOutreMer =
    codesTerritoire.length > 0 && codesTerritoire.every((c) => c.startsWith('97'));

  const donneesCarte = tableCommune.map((c) => ({
    code: c.code_geographique,
    name: c.libelle_geographique,
    surfaceForet: c.surface_foret_ha,
    taux: tauxBoisement(c.surface_foret_ha, c.surface_commune_ha)
  }));

  return (
    <>
      <div className={styles.datavizMapContainer}>
        <div className={styles.chiffreDynamiqueWrapper}>
          {!isOutreMer && taux !== null && Math.round(taux * 100) >= 1 && (
            <MicroPieChart
              pourcentage={taux * 100}
              arrondi={0}
              ariaLabel="Part de la surface de votre territoire couverte de forêt"
            />
          )}
          <div className={styles.text}>
            <SurfaceForetDynamicText
              taux={taux}
              surfaceForet={surfaceForet}
              ecart={ecart}
              isOutreMer={isOutreMer}
              type={type}
            />
            <CustomTooltipNouveauParcours
              title={SurfaceForetTooltipText}
              texte="Définition"
            />
          </div>
        </div>
        <div className="mt-4 pr-5">
          <ReadMoreFade maxHeight={150}>
            <SurfaceForetText />
          </ReadMoreFade>
        </div>
        <div className={styles.mapWrapper}>
          {coordonneesCommunes && donneesCarte.some((c) => c.taux !== null) ? (
            <Suspense fallback={<Loader />}>
              <MapSurfaceForet
                communesCodes={coordonneesCommunes.codes}
                surfacesForet={donneesCarte}
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
                <Body weight="bold">- Taux de boisement de la commune -</Body>
                <LegendCompColor legends={surfaceForetLegend} />
              </div>
            </Suspense>
          ) : (
            <div className={styles.dataNotFoundForMap}>
              <DataNotFoundForGraph image={DataNotFound} />
            </div>
          )}
        </div>
      </div>
      <div className={styles.sourcesExportMapWrapper}>
        <Body size="sm" style={{ color: 'var(--gris-dark)' }}>
          {SOURCE}
        </Body>
      </div>
    </>
  );
};
