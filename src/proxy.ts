import type { JWT } from 'next-auth/jwt';
import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

interface MiddlewareTokenOptions {
  req: NextRequest;
}

/**
 * Protection contre les open redirects : bloque toutes les redirections externes
 * Vérifie tous les paramètres d'URL suspects qui pourraient être utilisés pour des redirections
 */
function checkForExternalRedirects(req: NextRequest): NextResponse | null {
  const suspiciousParams = [
    'redirect',
    'redirectUrl',
    'redirect_url',
    'returnUrl',
    'return_url',
    'returnTo',
    'return_to',
    'callback',
    'callbackUrl',
    'callback_url',
    'next',
    'url',
    'destination',
    'continue',
    'goto',
    'target'
  ];

  const currentOrigin = new URL(req.url).origin;

  for (const param of suspiciousParams) {
    const value = req.nextUrl.searchParams.get(param);

    if (value) {
      try {
        // Tenter de parser comme URL absolue
        const redirectUrl = new URL(value);

        // Si c'est une URL absolue avec un origin différent, bloquer
        if (redirectUrl.origin !== currentOrigin) {
          console.warn(
            `[Security] Blocked external redirect attempt: ${param}=${value}`
          );
          return NextResponse.redirect(new URL('/', req.url));
        }
      } catch {
        // Si ce n'est pas une URL valide, vérifier les patterns dangereux
        if (
          value.startsWith('//') || // Protocol-relative URL
          value.startsWith('http://') ||
          value.startsWith('https://') ||
          value.includes('://') // Autres protocoles
        ) {
          console.warn(
            `[Security] Blocked suspicious redirect pattern: ${param}=${value}`
          );
          return NextResponse.redirect(new URL('/', req.url));
        }
      }
    }
  }

  return null;
}

export async function proxy(req: NextRequest): Promise<NextResponse> {
  // Protection globale contre les open redirects
  const redirectBlock = checkForExternalRedirects(req);
  if (redirectBlock) {
    return redirectBlock;
  }

  // Redirect /ressources/articles?title=... to /ressources
  if (
    req.nextUrl.pathname === '/ressources/articles' &&
    req.nextUrl.searchParams.has('title')
  ) {
    return NextResponse.redirect(new URL('/ressources', req.url));
  }

  if (req.nextUrl.pathname === '/donnees-territoriales') {
    const newUrl = new URL(req.url);
    newUrl.pathname = '/donnees';
    return NextResponse.redirect(newUrl);
  }
  // Only protect /sandbox/* routes
  if (req.nextUrl.pathname.startsWith('/sandbox/')) {
    const token: JWT | null = await getToken({ req } as MiddlewareTokenOptions);
    if (!token) {
      // Redirect unauthenticated users to the home page
      return NextResponse.redirect(new URL('/', req.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Pages à protéger
    '/api/ressources',
    '/sandbox/',
    '/ressources/articles',
    '/donnees-territoriales',
    // Protection globale sur toutes les routes
    '/((?!_next/static|_next/image|favicon.ico).*)'
  ]
};
