import 'server-only';
import { createRemoteJWKSet, jwtVerify, type JWTPayload } from 'jose';
import type { ProconnectDiscovery } from './proconnect';

export {
  getBaseUrl,
  getRedirectUri,
  sessionCookieName,
  encodeUserSession,
  decodeUserSession,
  USERS_SESSION_MAX_AGE
} from './proconnect';

export const MON_COMPTE_ADEME_SCOPES = 'openid profile email';

export interface AdemeIdTokenClaims extends JWTPayload {
  sub: string;
  nonce?: string;
  email?: string;
  email_verified?: boolean;
  given_name?: string;
  family_name?: string;
}

let discoveryCache: ProconnectDiscovery | null = null;
let jwksCache: ReturnType<typeof createRemoteJWKSet> | null = null;

function getEndpoint(): string {
  const endpoint = process.env.MON_COMPTE_ADEME_ENDPOINT;
  if (!endpoint) throw new Error('MON_COMPTE_ADEME_ENDPOINT non configuré');
  return endpoint;
}

export function getClientId(): string {
  const id = process.env.MON_COMPTE_ADEME_CLIENT_ID;
  if (!id) throw new Error('MON_COMPTE_ADEME_CLIENT_ID non configuré');
  return id;
}

export function getClientSecret(): string {
  const secret = process.env.MON_COMPTE_ADEME_SECRET;
  if (!secret) throw new Error('MON_COMPTE_ADEME_SECRET non configuré');
  return secret;
}

export async function getDiscovery(): Promise<ProconnectDiscovery> {
  if (discoveryCache) return discoveryCache;
  const res = await fetch(getEndpoint(), { cache: 'no-store' });
  if (!res.ok) throw new Error(`Discovery MonCompteAdeme HTTP ${res.status}`);
  discoveryCache = (await res.json()) as ProconnectDiscovery;
  return discoveryCache;
}

async function getJwks(): Promise<ReturnType<typeof createRemoteJWKSet>> {
  if (jwksCache) return jwksCache;
  const { jwks_uri } = await getDiscovery();
  jwksCache = createRemoteJWKSet(new URL(jwks_uri));
  return jwksCache;
}

export async function verifyIdToken(idToken: string): Promise<AdemeIdTokenClaims> {
  const { issuer } = await getDiscovery();
  const { payload } = await jwtVerify(idToken, await getJwks(), {
    issuer,
    audience: getClientId(),
    algorithms: ['RS256']
  });
  return payload as AdemeIdTokenClaims;
}
