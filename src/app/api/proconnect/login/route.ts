import { randomBytes } from 'crypto';
import { NextResponse } from 'next/server';

interface OidcDiscovery {
  authorization_endpoint: string;
}

export async function GET() {
  const domain = process.env.PROCONNECT_DOMAIN;
  if (!domain) {
    return NextResponse.json({ error: 'PROCONNECT_DOMAIN non configuré' }, { status: 500 });
  }

  let discovery: OidcDiscovery;
  try {
    const discoveryRes = await fetch(
      `https://${domain}/api/v2/.well-known/openid-configuration`,
      { cache: 'no-store' }
    );
    if (!discoveryRes.ok) {
      console.error(`[ProConnect login] Discovery endpoint HTTP ${discoveryRes.status}`);
      return NextResponse.json({ error: `Discovery endpoint HTTP ${discoveryRes.status}` }, { status: 502 });
    }
    discovery = (await discoveryRes.json()) as OidcDiscovery;
  } catch (err) {
    console.error('[ProConnect login] Impossible de joindre le serveur ProConnect :', err);
    return NextResponse.json(
      { error: 'Impossible de joindre le serveur ProConnect', detail: String(err) },
      { status: 502 }
    );
  }

  const state = randomBytes(32).toString('hex');
  const nonce = randomBytes(32).toString('hex');

  const redirectUri = `${process.env.NEXTAUTH_URL}/api/proconnect/callback`;

  const authUrl = new URL(discovery.authorization_endpoint);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('client_id', process.env.PROCONNECT_CLIENT_ID ?? '');
  authUrl.searchParams.set('redirect_uri', redirectUri);
  authUrl.searchParams.set('scope', 'openid given_name usual_name email');
  authUrl.searchParams.set('state', state);
  authUrl.searchParams.set('nonce', nonce);

  const isSecure = process.env.NODE_ENV === 'production';
  const response = NextResponse.redirect(authUrl.toString());
  response.cookies.set('pc_state', state, { httpOnly: true, sameSite: 'lax', secure: isSecure, maxAge: 300 });
  response.cookies.set('pc_nonce', nonce, { httpOnly: true, sameSite: 'lax', secure: isSecure, maxAge: 300 });

  return response;
}
