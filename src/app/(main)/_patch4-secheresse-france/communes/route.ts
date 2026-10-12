import { prisma } from '@/lib/queries/db';
import { listeArrondissements } from '@/lib/territoireData/arrondissements';
import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

// Pas de la grille (en degrés) sur laquelle sont alignés les sommets. Les sommets
// d'une frontière partagée tombent sur les mêmes points : pas d'interstice entre communes.
// Plus fin pour une région, car chaque pixel de l'export y couvre une zone plus petite.
const GRILLE_DEGRES_FRANCE = 0.001;
const GRILLE_DEGRES_REGION = 0.0002;

export const GET = async (request: NextRequest) => {
  const regionParam = request.nextUrl.searchParams.get('region');
  const region = regionParam && /^\d{2}$/.test(regionParam) ? Number(regionParam) : null;
  const grille = region === null ? GRILLE_DEGRES_FRANCE : GRILLE_DEGRES_REGION;

  const result = await prisma.$queryRaw<Array<{ geojson: string }>>`
    SELECT json_build_object(
      'type', 'FeatureCollection',
      'features', COALESCE(json_agg(json_build_object(
        'type', 'Feature',
        'properties', json_build_object('code_geographique', code_geographique),
        'geometry', ST_AsGeoJSON(geom, 4)::json
      )), '[]'::json)
    )::text AS geojson
    FROM (
      SELECT code_geographique, ST_SnapToGrid(geometry, ${grille}::float8) AS geom
      FROM postgis_v2."communes_drom"
      WHERE code_geographique IS NOT NULL
        AND code_geographique NOT LIKE '97%'
        AND code_geographique NOT LIKE '98%'
        AND NOT (code_geographique = ANY(${listeArrondissements}))
        AND (${region}::int IS NULL OR region = ${region}::int)
    ) communes
    WHERE geom IS NOT NULL AND NOT ST_IsEmpty(geom)
  `;
  return new Response(result[0]?.geojson ?? '{"type":"FeatureCollection","features":[]}', {
    headers: { 'Content-Type': 'application/json' }
  });
};
