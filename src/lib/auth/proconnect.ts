import 'server-only';
import { decode, encode } from 'next-auth/jwt';

export const USERS_SESSION_MAX_AGE = 60 * 60 * 12;

// Forme de la découverte OIDC, partagée avec moncompteademe.ts.
export interface ProconnectDiscovery {
  issuer: string;
  authorization_endpoint: string;
  token_endpoint: string;
  userinfo_endpoint: string;
  jwks_uri: string;
  end_session_endpoint: string;
}

export function getBaseUrl(): string {
  return (process.env.NEXTAUTH_URL ?? '').replace(/\/+$/, '');
}

// Chemin enregistré côté Keycloak ADEME : ne pas renommer sans mise à jour de leur configuration.
export function getRedirectUri(): string {
  return `${getBaseUrl()}/api/proconnect/callback`;
}

export function sessionCookieName(): string {
  return process.env.NODE_ENV === 'production'
    ? '__Secure-authjs.session-token'
    : 'authjs.session-token';
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

export interface UserSessionToken {
  sub: string;
  id_token: string;
}

export async function decodeUserSession(
  cookieValue: string
): Promise<UserSessionToken | null> {
  const secret = process.env.AUTH_TACCT_SECRET;
  if (!secret) throw new Error('AUTH_TACCT_SECRET non configuré');
  const token = await decode({
    token: cookieValue,
    salt: sessionCookieName(),
    secret
  });
  if (!token?.sub) return null;
  return {
    sub: token.sub,
    id_token: typeof token.id_token === 'string' ? token.id_token : ''
  };
}
