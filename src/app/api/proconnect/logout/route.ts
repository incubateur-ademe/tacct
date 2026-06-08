import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';

interface OidcDiscovery {
  end_session_endpoint: string;
}

interface SessionPayload {
  id_token?: string;
}

export async function GET(request: NextRequest) {
  const fallbackResponse = NextResponse.redirect(
    new URL('/proconnect-test', request.url)
  );
  fallbackResponse.cookies.delete('pc_session');

  const sessionCookie = request.cookies.get('pc_session')?.value;
  if (!sessionCookie) {
    return fallbackResponse;
  }

  let idToken: string | undefined;
  try {
    const session = jwt.decode(sessionCookie) as SessionPayload;
    idToken = session?.id_token;
  } catch {
    return fallbackResponse;
  }

  const domain = process.env.PROCONNECT_DOMAIN;
  if (!domain || !idToken) {
    return fallbackResponse;
  }

  try {
    const discoveryRes = await fetch(
      `https://${domain}/api/v2/.well-known/openid-configuration`,
      { cache: 'no-store' }
    );
    const discovery = (await discoveryRes.json()) as OidcDiscovery;

    const postLogoutRedirectUri = `${process.env.NEXTAUTH_URL ?? 'http://localhost:3000'}/proconnect-test`;

    const endSessionUrl = new URL(discovery.end_session_endpoint);
    endSessionUrl.searchParams.set('id_token_hint', idToken);
    endSessionUrl.searchParams.set(
      'post_logout_redirect_uri',
      postLogoutRedirectUri
    );
    endSessionUrl.searchParams.set('state', 'logout');

    const response = NextResponse.redirect(endSessionUrl.toString());
    response.cookies.delete('pc_session');
    return response;
  } catch {
    return fallbackResponse;
  }
}
