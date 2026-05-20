import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const response = NextResponse.redirect(new URL('/proconnect-test', request.url));
  response.cookies.delete('pc_session');
  return response;
}
