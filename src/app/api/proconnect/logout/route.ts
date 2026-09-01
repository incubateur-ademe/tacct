import { randomBytes } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import {
  decodeUserSession,
  getBaseUrl,
  getDiscovery,
  sessionCookieName
} from '@/lib/auth/moncompteademe';

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

  const versAccueil = () =>
    clearSession(NextResponse.redirect(`${getBaseUrl()}/`));

  const raw = request.cookies.get(cookieName)?.value;
  if (!raw) return versAccueil();

  let idToken: string | undefined;
  try {
    const session = await decodeUserSession(raw);
    idToken = session?.id_token || undefined;
  } catch {
    return versAccueil();
  }

  if (!idToken) return versAccueil();

  try {
    const discovery = await getDiscovery();
    const endSessionUrl = new URL(discovery.end_session_endpoint);
    endSessionUrl.searchParams.set('id_token_hint', idToken);
    endSessionUrl.searchParams.set(
      'post_logout_redirect_uri',
      getBaseUrl()
    );
    endSessionUrl.searchParams.set('state', randomBytes(16).toString('hex'));
    console.log('[ProConnect logout] paramètres envoyés', {
      end_session_endpoint: discovery.end_session_endpoint,
      post_logout_redirect_uri: getBaseUrl(),
      has_id_token_hint: Boolean(idToken)
    });
    return clearSession(NextResponse.redirect(endSessionUrl.toString()));
  } catch {
    return versAccueil();
  }
}
