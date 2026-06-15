import { randomBytes } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import {
  decodeUserSession,
  getDiscovery,
  sessionCookieName
} from '@/lib/auth/proconnect';

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
    clearSession(NextResponse.redirect(new URL('/mon-compte', request.url)));

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
    endSessionUrl.searchParams.set(
      'post_logout_redirect_uri',
      `${process.env.NEXTAUTH_URL}/mon-compte`
    );
    endSessionUrl.searchParams.set('state', randomBytes(16).toString('hex'));
    return clearSession(NextResponse.redirect(endSessionUrl.toString()));
  } catch {
    return toMonCompte();
  }
}
