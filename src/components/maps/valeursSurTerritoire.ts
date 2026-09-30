import * as turf from '@turf/turf';
import type { Geometry, MultiPolygon, Polygon, Position } from 'geojson';
import type { Map as MaplibreMap } from 'maplibre-gl';

export type ValeursTerritoire = { moyenne: number; max: number } | null;

const PAS_ECHANTILLONNAGE_KM = 1;
const PAS_INDEX_DEGRES = 0.1;

export const valeursSurTerritoire = (
  map: MaplibreMap,
  sourceId: string,
  sourceLayer: string,
  territoireGeometry: Geometry
): ValeursTerritoire => {
  if (territoireGeometry.type !== 'Polygon' && territoireGeometry.type !== 'MultiPolygon') return null;
  const territoire = turf.feature(territoireGeometry);

  const index = new Map<string, { geometry: Polygon | MultiPolygon; valeur: number }[]>();
  for (const feature of map.querySourceFeatures(sourceId, { sourceLayer })) {
    const valeur = feature.properties?.valeur;
    const geometry = feature.geometry;
    if (typeof valeur !== 'number') continue;
    if (geometry.type !== 'Polygon' && geometry.type !== 'MultiPolygon') continue;
    const [minX, minY, maxX, maxY] = turf.bbox(geometry);
    for (let x = Math.floor(minX / PAS_INDEX_DEGRES); x <= Math.floor(maxX / PAS_INDEX_DEGRES); x++) {
      for (let y = Math.floor(minY / PAS_INDEX_DEGRES); y <= Math.floor(maxY / PAS_INDEX_DEGRES); y++) {
        const cle = `${x}:${y}`;
        const mailles = index.get(cle);
        if (mailles) mailles.push({ geometry, valeur });
        else index.set(cle, [{ geometry, valeur }]);
      }
    }
  }

  const valeurAuPoint = (point: Position): number | null => {
    const cle = `${Math.floor(point[0] / PAS_INDEX_DEGRES)}:${Math.floor(point[1] / PAS_INDEX_DEGRES)}`;
    const maille = index.get(cle)?.find(({ geometry }) => turf.booleanPointInPolygon(point, geometry));
    return maille ? maille.valeur : null;
  };

  const points = turf
    .pointGrid(turf.bbox(territoire), PAS_ECHANTILLONNAGE_KM, { units: 'kilometers', mask: territoire })
    .features.map((point) => point.geometry.coordinates);
  if (!points.length) points.push(turf.pointOnFeature(territoire).geometry.coordinates);

  const valeurs = points.map(valeurAuPoint).filter((valeur): valeur is number => valeur !== null);
  if (!valeurs.length) return null;
  return {
    moyenne: valeurs.reduce((somme, valeur) => somme + valeur, 0) / valeurs.length,
    max: Math.max(...valeurs)
  };
};
