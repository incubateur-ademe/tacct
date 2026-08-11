import {
  decodeUserSession,
  getBaseUrl,
  getDiscovery,
  sessionCookieName
} from '@/lib/auth/moncompteademe';
import { randomBytes } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const cookieName = sessionCookieName();

  const clearSession = (res: NextResponse) => {
    res.cookies.set(cookieName, '', {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 0
    });
    return res;
  };

  const toMonCompte = () =>
    clearSession(NextResponse.redirect(`${getBaseUrl()}/mon-compte`));

  const raw = request.cookies.get(cookieName)?.value;
  if (!raw) return toMonCompte();

  let idToken: string | undefined;
  try {
    const session = await decodeUserSession(raw);
    idToken = session?.id_token || undefined;
  } catch {
    return toMonCompte();
  }

  if (!idToken) return toMonCompte();

  try {
    const discovery = await getDiscovery();
    const endSessionUrl = new URL(discovery.end_session_endpoint);
    endSessionUrl.searchParams.set('id_token_hint', idToken);
    // TODO MEP août 2026 — à réactiver dès que l'équipe technique ADEME aura
    // ajouté https://tacct.ademe.fr aux "Valid post logout redirect URIs" du
    // client prod-tacct-incu (realm master de moncompte.ademe.fr).
    // Aujourd'hui seule l'URL de callback y figure : Keycloak rejette la racine
    // du site avec « L'URI de redirection est invalide », et l'utilisateur —
    // pourtant déconnecté — reste bloqué sur une page d'erreur ADEME.
    // Sans ce paramètre (optionnel dans la spec OIDC RP-Initiated Logout),
    // Keycloak répond 200 et affiche sa propre page « Déconnexion ».
    // endSessionUrl.searchParams.set(
    //   'post_logout_redirect_uri',
    //   getBaseUrl()
    // );
    endSessionUrl.searchParams.set('state', randomBytes(16).toString('hex'));
    console.log('[ProConnect logout] paramètres envoyés', {
      end_session_endpoint: discovery.end_session_endpoint,
      // post_logout_redirect_uri: getBaseUrl(),
      post_logout_redirect_uri: 'non envoyé — voir TODO ci-dessus',
      has_id_token_hint: Boolean(idToken)
    });
    return clearSession(NextResponse.redirect(endSessionUrl.toString()));
  } catch {
    return toMonCompte();
  }
}
