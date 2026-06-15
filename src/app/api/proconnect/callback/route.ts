import { randomUUID } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import {
  encodeUserSession,
  getClientId,
  getDiscovery,
  getRedirectUri,
  sessionCookieName,
  USERS_SESSION_MAX_AGE,
  verifyIdToken,
  verifyUserinfo
} from '@/lib/auth/proconnect';
import { prisma } from '@/lib/queries/db';

interface TokenResponse {
  access_token?: string;
  id_token?: string;
  error?: string;
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const oidcError = searchParams.get('error');

  const fail = (reason: string) =>
    NextResponse.redirect(
      new URL(`/proconnect-espace?error=${encodeURIComponent(reason)}`, request.url)
    );

  if (oidcError) return fail(oidcError);

  const storedState = request.cookies.get('pc_state')?.value;
  const storedNonce = request.cookies.get('pc_nonce')?.value;

  if (!code || !state || !storedState || state !== storedState) {
    return fail('invalid_state');
  }

  try {
    const discovery = await getDiscovery();

    const tokenRes = await fetch(discovery.token_endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: getRedirectUri(),
        client_id: getClientId(),
        client_secret: process.env.PROCONNECT_CLIENT_SECRET ?? ''
      })
    });
    const tokens = (await tokenRes.json()) as TokenResponse;
    if (tokens.error || !tokens.id_token || !tokens.access_token) {
      return fail(tokens.error ?? 'token_exchange_failed');
    }

    const idClaims = await verifyIdToken(tokens.id_token);
    if (!storedNonce || idClaims.nonce !== storedNonce) {
      return fail('invalid_nonce');
    }

    const userinfoRes = await fetch(discovery.userinfo_endpoint, {
      headers: { Authorization: `Bearer ${tokens.access_token}` }
    });
    const claims = await verifyUserinfo(await userinfoRes.text());
    if (claims.sub !== idClaims.sub) {
      return fail('sub_mismatch');
    }

    const sub = idClaims.sub;
    let user = await prisma.user.findFirst({
      where: { authenticated_id: sub }
    });
    if (!user) {
      const now = new Date();
      user = await prisma.user.create({
        data: {
          id: randomUUID(),
          authenticated_id: sub,
          email: claims.email ?? '',
          username: claims.email ?? '',
          firstname: claims.given_name ?? '',
          lastname: claims.usual_name ?? '',
          roles: JSON.stringify(['ROLE_USER']),
          validated: true,
          validated_terms_of_use: true,
          commune_id: null,
          study_office_id: null,
          created_at: now,
          updated_at: now
        }
      });
    }

    const sessionJwt = await encodeUserSession({
      sub: user.id,
      id_token: tokens.id_token
    });

    const response = NextResponse.redirect(
      new URL('/proconnect-espace', request.url)
    );
    response.cookies.set(sessionCookieName(), sessionJwt, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: USERS_SESSION_MAX_AGE
    });
    response.cookies.delete('pc_state');
    response.cookies.delete('pc_nonce');

    return response;
  } catch (err) {
    console.error('[ProConnect callback]', err);
    return fail('callback_failed');
  }
}
