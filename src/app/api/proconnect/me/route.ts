import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/getCurrentUser';

// Données personnelles : jamais mises en cache, ni par le navigateur ni par un proxy.
const headers = { 'Cache-Control': 'no-store' };

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ user: null }, { status: 200, headers });
  }
  return NextResponse.json({ user }, { headers });
}
