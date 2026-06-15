import 'server-only';
import { createRemoteJWKSet, jwtVerify, type JWTPayload } from 'jose';
import { encode } from 'next-auth/jwt';

export const USERS_SESSION_MAX_AGE = 60 * 60 * 12;

export const PROCONNECT_SCOPES = 'openid given_name usual_name email';

export interface ProconnectDiscovery {
  issuer: string;
  authorization_endpoint: string;
  token_endpoint: string;
  userinfo_endpoint: string;
  jwks_uri: string;
  end_session_endpoint: string;
}

export interface IdTokenClaims extends JWTPayload {
  sub: string;
  nonce?: string;
}

export interface UserinfoClaims extends JWTPayload {
  sub: string;
  given_name?: string;
  usual_name?: string;
  email?: string;
}

let discoveryCache: ProconnectDiscovery | null = null;
let jwksCache: ReturnType<typeof createRemoteJWKSet> | null = null;

function getDomain(): string {
  const domain = process.env.PROCONNECT_DOMAIN;
  if (!domain) throw new Error('PROCONNECT_DOMAIN non configuré');
  return domain;
}

export function getClientId(): string {
  const id = process.env.PROCONNECT_CLIENT_ID;
  if (!id) throw new Error('PROCONNECT_CLIENT_ID non configuré');
  return id;
}

export function getRedirectUri(): string {
  return `${process.env.NEXTAUTH_URL}/api/proconnect/callback`;
}

export function sessionCookieName(): string {
  return process.env.NODE_ENV === 'production'
    ? '__Secure-authjs.session-token'
    : 'authjs.session-token';
}

export async function getDiscovery(): Promise<ProconnectDiscovery> {
  if (discoveryCache) return discoveryCache;
  const res = await fetch(
    `https://${getDomain()}/api/v2/.well-known/openid-configuration`,
    { cache: 'no-store' }
  );
  if (!res.ok) throw new Error(`Discovery ProConnect HTTP ${res.status}`);
  discoveryCache = (await res.json()) as ProconnectDiscovery;
  return discoveryCache;
}

async function getJwks(): Promise<ReturnType<typeof createRemoteJWKSet>> {
  if (jwksCache) return jwksCache;
  const { jwks_uri } = await getDiscovery();
  jwksCache = createRemoteJWKSet(new URL(jwks_uri));
  return jwksCache;
}

export async function verifyIdToken(idToken: string): Promise<IdTokenClaims> {
  const { issuer } = await getDiscovery();
  const { payload } = await jwtVerify(idToken, await getJwks(), {
    issuer,
    audience: getClientId(),
    algorithms: ['RS256']
  });
  return payload as IdTokenClaims;
}

export async function verifyUserinfo(userinfoJwt: string): Promise<UserinfoClaims> {
  const { issuer } = await getDiscovery();
  const { payload } = await jwtVerify(userinfoJwt, await getJwks(), {
    issuer,
    algorithms: ['RS256']
  });
  return payload as UserinfoClaims;
}

export async function encodeUserSession(token: {
  sub: string;
  id_token: string;
}): Promise<string> {
  const secret = process.env.AUTH_TACCT_SECRET;
  if (!secret) throw new Error('AUTH_TACCT_SECRET non configuré');
  return encode({
    token,
    salt: sessionCookieName(),
    secret,
    maxAge: USERS_SESSION_MAX_AGE
  });
}
