import { type NextRequest } from 'next/server';

// Hôtes autorisés à être relayés (liste blanche pour éviter un proxy ouvert / SSRF).
const ALLOWED_HOSTS = new Set([
  'data.geopf.fr',
  'openmaptiles.github.io',
  'openmaptiles.geo.data.gouv.fr',
  'lcz-generator.rub.de',
  'cartagene.cerema.fr'
]);

const isAllowed = (hostname: string): boolean =>
  ALLOWED_HOSTS.has(hostname) || hostname.endsWith('.scw.cloud');

/**
 * Relais same-origin pour les ressources images des cartes (sprite, tuiles
 * raster, WMS). Servir ces images depuis notre propre domaine évite que le
 * canvas WebGL de MapLibre soit « taché » sur Safari, ce qui bloque l'export PNG.
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

  if (url.protocol !== 'https:' || !isAllowed(url.hostname)) {
    return new Response('Host not allowed', { status: 403 });
  }

  let upstream: Response;
  try {
    upstream = await fetch(url, { headers: { Accept: 'image/*,*/*' } });
  } catch {
    return new Response('Upstream fetch failed', { status: 502 });
  }

  if (!upstream.ok || !upstream.body) {
    return new Response('Upstream error', { status: upstream.status || 502 });
  }

  const headers = new Headers();
  const contentType = upstream.headers.get('content-type');
  if (contentType) headers.set('Content-Type', contentType);
  headers.set('Cache-Control', 'public, max-age=86400, immutable');

  return new Response(upstream.body, { status: 200, headers });
}
