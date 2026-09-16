import { randomBytes } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import {
  getClientId,
  getDiscovery,
  getRedirectUri,
  MON_COMPTE_ADEME_SCOPES,
  RETURN_TO_COOKIE,
  sanitizeReturnTo
} from '@/lib/auth/moncompteademe';

export async function GET(request: NextRequest) {
  let discovery;
  try {
    discovery = await getDiscovery();
  } catch (err) {
    console.error('[MonCompteAdeme login]', err);
    return NextResponse.json(
      { error: 'Impossible de joindre le serveur MonCompteAdeme' },
      { status: 502 }
    );
  }

  const state = randomBytes(32).toString('hex');
  const nonce = randomBytes(32).toString('hex');

  const authUrl = new URL(discovery.authorization_endpoint);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('client_id', getClientId());
  authUrl.searchParams.set('redirect_uri', getRedirectUri());
  authUrl.searchParams.set('scope', MON_COMPTE_ADEME_SCOPES);
  authUrl.searchParams.set('state', state);
  authUrl.searchParams.set('nonce', nonce);

  const isSecure = process.env.NODE_ENV === 'production';
  const response = NextResponse.redirect(authUrl.toString());
  response.cookies.set('pc_state', state, {
    httpOnly: true,
    sameSite: 'lax',
    secure: isSecure,
    maxAge: 300
  });
  response.cookies.set('pc_nonce', nonce, {
    httpOnly: true,
    sameSite: 'lax',
    secure: isSecure,
    maxAge: 300
  });

  const returnTo = sanitizeReturnTo(
    request.nextUrl.searchParams.get('returnTo')
  );
  if (returnTo) {
    response.cookies.set(RETURN_TO_COOKIE, returnTo, {
      httpOnly: true,
      sameSite: 'lax',
      secure: isSecure,
      maxAge: 300
    });
  }

  return response;
}
