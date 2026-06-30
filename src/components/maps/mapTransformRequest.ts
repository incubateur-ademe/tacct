import { type RequestParameters, type ResourceType } from 'maplibre-gl';

const isVectorTile = (url: string): boolean => /\.(pbf|mvt)(\?|$)/i.test(url);

/**
 * À passer en `transformRequest` lors de la création d'une carte MapLibre.
 *
 * Réécrit uniquement les ressources IMAGES (sprite, tuiles raster, WMS) vers un
 * proxy same-origin (/api/map-proxy). Une image servie depuis notre propre
 * domaine ne « tache » jamais le canvas WebGL — ce qui permet l'export PNG sur
 * Safari/iOS. Les tuiles vecteur et les glyphs (l'essentiel du trafic) restent
 * en direct, car elles ne tachent pas le canvas.
 */
export const mapTransformRequest = (
  url: string,
  resourceType?: ResourceType
): RequestParameters => {
  const isImage =
    resourceType === 'SpriteImage' ||
    resourceType === 'Image' ||
    (resourceType === 'Tile' && !isVectorTile(url));

  if (isImage && /^https:\/\//i.test(url)) {
    return { url: `/api/map-proxy?u=${encodeURIComponent(url)}` };
  }
  return { url };
};
