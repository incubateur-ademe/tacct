import { randomUUID } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import {
  encodeUserSession,
  getBaseUrl,
  getClientId,
  getClientSecret,
  getDiscovery,
  getRedirectUri,
  sessionCookieName,
  USERS_SESSION_MAX_AGE,
  verifyIdToken
} from '@/lib/auth/moncompteademe';
import { blindIndex, encryptField } from '@/lib/crypto/user-crypto';
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
      `${getBaseUrl()}/mon-compte?error=${encodeURIComponent(reason)}`
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
        client_secret: getClientSecret()
      })
    });
    const tokens = (await tokenRes.json()) as TokenResponse;
    if (tokens.error || !tokens.id_token) {
      return fail(tokens.error ?? 'token_exchange_failed');
    }

    const idClaims = await verifyIdToken(tokens.id_token);
    if (!storedNonce || idClaims.nonce !== storedNonce) {
      return fail('invalid_nonce');
    }

    const sub = idClaims.sub;
    const email = idClaims.email ?? '';

    console.log('[ProConnect callback] claims reçus', {
      claim_keys: Object.keys(idClaims),
      has_sub: Boolean(sub),
      has_email: Boolean(email),
      email_verified: idClaims.email_verified,
      email_verified_type: typeof idClaims.email_verified
    });

    let user = await prisma.user.findFirst({
      where: { authenticated_id_bidx: blindIndex(sub) }
    });

    console.log('[ProConnect callback] recherche par sub', {
      found: Boolean(user)
    });

    if (!user && email && idClaims.email_verified) {
      const existing = await prisma.user.findFirst({
        where: { email_bidx: blindIndex(email) }
      });
      console.log('[ProConnect callback] recherche par email (branche active)', {
        found: Boolean(existing)
      });
      if (existing) {
        user = await prisma.user.update({
          where: { id: existing.id },
          data: {
            authenticated_id: encryptField(sub),
            authenticated_id_bidx: blindIndex(sub),
            updated_at: new Date()
          }
        });
      }
    } else if (!user) {
      console.log('[ProConnect callback] branche email SAUTÉE', {
        has_email: Boolean(email),
        email_verified: idClaims.email_verified
      });
    }

    if (!user) {
      console.log('[ProConnect callback] aucun user résolu → tentative de create');
      const now = new Date();
      user = await prisma.user.create({
        data: {
          id: randomUUID(),
          authenticated_id: encryptField(sub),
          authenticated_id_bidx: blindIndex(sub),
          email: encryptField(email),
          email_bidx: blindIndex(email),
          username: encryptField(email),
          firstname: encryptField(idClaims.given_name ?? ''),
          lastname: encryptField(idClaims.family_name ?? ''),
          encryption_version: 1,
          roles: JSON.stringify(['ROLE_USER']),
          validated: false,
          validated_terms_of_use: true,
          commune_id: null,
          study_office_id: null,
          created_at: now,
          updated_at: now
        }
      });
      console.log('[ProConnect callback] create réussi', { user_id: user.id });
    }

    console.log('[ProConnect callback] user résolu → pose de session', {
      user_id: user.id
    });

    const sessionJwt = await encodeUserSession({
      sub: user.id,
      id_token: tokens.id_token
    });

    const response = NextResponse.redirect(`${getBaseUrl()}/mon-espace`);
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
    const prismaErr =
      err && typeof err === 'object'
        ? (err as { code?: string; meta?: unknown })
        : null;
    console.error('[ProConnect callback] échec', {
      message: err instanceof Error ? err.message : String(err),
      prisma_code: prismaErr?.code,
      prisma_meta: prismaErr?.meta
    });
    return fail('callback_failed');
  }
}
