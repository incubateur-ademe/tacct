import { type NextRequest } from 'next/server';

// Hôtes autorisés à être relayés (liste blanche pour éviter un proxy ouvert / SSRF).
// Pas de wildcard : n'importe qui peut créer un bucket <nom>.s3.fr-par.scw.cloud.
// Le bucket Scaleway de l'environnement est déduit de NEXT_PUBLIC_SCALEWAY_BUCKET_URL.
const ALLOWED_HOSTS = new Set([
  'data.geopf.fr',
  'openmaptiles.github.io',
  'openmaptiles.geo.data.gouv.fr',
  'lcz-generator.rub.de',
  'cartagene.cerema.fr'
]);

const bucketUrl = process.env.NEXT_PUBLIC_SCALEWAY_BUCKET_URL;
if (bucketUrl) {
  try {
    ALLOWED_HOSTS.add(new URL(bucketUrl).hostname);
  } catch {
    console.error('[map-proxy] NEXT_PUBLIC_SCALEWAY_BUCKET_URL invalide');
  }
}

// Types d'images raster attendus des sprites, tuiles et WMS. Le SVG est exclu :
// servi depuis notre origine, il pourrait embarquer du script.
const ALLOWED_CONTENT_TYPES = new Set([
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
  'image/gif',
  'image/avif'
]);

const MAX_REDIRECTIONS = 3;

const isAllowed = (url: URL): boolean =>
  url.protocol === 'https:' && ALLOWED_HOSTS.has(url.hostname);

interface ReponseAmont {
  reponse: Response;
  abandonner: () => void;
}

// Les redirections sont suivies à la main : chaque destination repasse par l'allowlist.
// Chaque saut a son propre AbortController : c'est le seul moyen fiable de libérer
// une connexion dont on ne lira pas le corps (le fetch patché par Next bloque sur
// body.cancel()).
const fetchAvecRedirectionsControlees = async (url: URL): Promise<ReponseAmont> => {
  let courante = url;
  for (let saut = 0; saut <= MAX_REDIRECTIONS; saut++) {
    const controller = new AbortController();
    const reponse = await fetch(courante, {
      headers: { Accept: 'image/*,*/*' },
      redirect: 'manual',
      signal: controller.signal
    });
    const location = reponse.headers.get('location');
    if (reponse.status < 300 || reponse.status >= 400 || !location) {
      return { reponse, abandonner: () => controller.abort() };
    }
    controller.abort();
    const suivante = new URL(location, courante);
    if (!isAllowed(suivante)) {
      throw new Error('Redirection vers un hôte non autorisé');
    }
    courante = suivante;
  }
  throw new Error('Trop de redirections');
};

/**
 * Relais same-origin pour les ressources images des cartes (sprite, tuiles
 * raster, WMS). Servir ces images depuis notre propre domaine évite que le
 * canvas WebGL de MapLibre soit « taché » sur Safari, ce qui bloque l'export PNG.
 *
 * Seules les images sont relayées : la réponse étant servie depuis notre
 * origine, tout autre type (HTML, JSON...) s'exécuterait dans notre contexte.
 */
export async function GET(request: NextRequest) {
  const target = request.nextUrl.searchParams.get('u');
  if (!target) {
    return new Response('Missing "u" parameter', { status: 400 });
  }

  let url: URL;
  try {
    url = new URL(target);
  } catch {
    return new Response('Invalid URL', { status: 400 });
  }

  if (!isAllowed(url)) {
    return new Response('Host not allowed', { status: 403 });
  }

  let amont: ReponseAmont;
  try {
    amont = await fetchAvecRedirectionsControlees(url);
  } catch {
    return new Response('Upstream fetch failed', { status: 502 });
  }
  const { reponse: upstream, abandonner } = amont;

  if (!upstream.ok || !upstream.body) {
    abandonner();
    return new Response('Upstream error', { status: upstream.status || 502 });
  }

  const contentType = upstream.headers.get('content-type') ?? '';
  const mimeType = contentType.split(';')[0].trim().toLowerCase();
  if (!ALLOWED_CONTENT_TYPES.has(mimeType)) {
    abandonner();
    return new Response('Upstream content type not allowed', { status: 502 });
  }

  const headers = new Headers();
  headers.set('Content-Type', contentType);
  headers.set('Cache-Control', 'public, max-age=86400, immutable');

  return new Response(upstream.body, { status: 200, headers });
}
