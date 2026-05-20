import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';

interface OidcDiscovery {
  token_endpoint: string;
  userinfo_endpoint: string;
}

interface TokenResponse {
  access_token: string;
  id_token: string;
  error?: string;
}

interface IdTokenPayload {
  sub: string;
  nonce?: string;
}

interface UserinfoPayload {
  sub: string;
  given_name?: string;
  usual_name?: string;
  email?: string;
}

function decodeJwtPayload<T>(token: string): T {
  const payload = Buffer.from(token.split('.')[1], 'base64url').toString('utf-8');
  return JSON.parse(payload) as T;
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');

  if (error) {
    return NextResponse.redirect(
      new URL(`/proconnect-test?error=${encodeURIComponent(error)}`, request.url)
    );
  }

  const storedState = request.cookies.get('pc_state')?.value;
  const storedNonce = request.cookies.get('pc_nonce')?.value;

  if (!code || !state || !storedState || state !== storedState) {
    return NextResponse.redirect(
      new URL('/proconnect-test?error=invalid_state', request.url)
    );
  }

  const domain = process.env.PROCONNECT_DOMAIN;
  if (!domain) {
    return NextResponse.redirect(
      new URL('/proconnect-test?error=misconfiguration', request.url)
    );
  }

  try {
    const discoveryRes = await fetch(
      `https://${domain}/api/v2/.well-known/openid-configuration`,
      { cache: 'no-store' }
    );
    const discovery = (await discoveryRes.json()) as OidcDiscovery;

    const redirectUri = `${process.env.NEXTAUTH_URL}/api/proconnect/callback`;

    const tokenRes = await fetch(discovery.token_endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
        client_id: process.env.PROCONNECT_CLIENT_ID ?? '',
        client_secret: process.env.PROCONNECT_CLIENT_SECRET ?? ''
      })
    });

    const tokens = (await tokenRes.json()) as TokenResponse;

    if (tokens.error) {
      return NextResponse.redirect(
        new URL(`/proconnect-test?error=${encodeURIComponent(tokens.error)}`, request.url)
      );
    }

    const idTokenPayload = decodeJwtPayload<IdTokenPayload>(tokens.id_token);

    if (storedNonce && idTokenPayload.nonce !== storedNonce) {
      return NextResponse.redirect(
        new URL('/proconnect-test?error=invalid_nonce', request.url)
      );
    }

    const userinfoRes = await fetch(discovery.userinfo_endpoint, {
      headers: { Authorization: `Bearer ${tokens.access_token}` }
    });

    const contentType = userinfoRes.headers.get('content-type') ?? '';
    let userinfo: UserinfoPayload;
    if (contentType.includes('application/json')) {
      userinfo = (await userinfoRes.json()) as UserinfoPayload;
    } else {
      const userinfoJwt = await userinfoRes.text();
      userinfo = decodeJwtPayload<UserinfoPayload>(userinfoJwt);
    }

    const sessionPayload = {
      sub: userinfo.sub,
      name: [userinfo.given_name, userinfo.usual_name].filter(Boolean).join(' '),
      email: userinfo.email ?? '',
      id_token: tokens.id_token
    };

    const sessionToken = jwt.sign(sessionPayload, process.env.NEXTAUTH_SECRET ?? '', {
      expiresIn: '1h'
    });

    const isSecure = process.env.NODE_ENV === 'production';
    const response = NextResponse.redirect(new URL('/proconnect-espace', request.url));
    response.cookies.set('pc_session', sessionToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: isSecure,
      maxAge: 3600
    });
    response.cookies.delete('pc_state');
    response.cookies.delete('pc_nonce');

    return response;
  } catch (err) {
    console.error('[ProConnect callback]', err);
    return NextResponse.redirect(
      new URL('/proconnect-test?error=callback_failed', request.url)
    );
  }
}
