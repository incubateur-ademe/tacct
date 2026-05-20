import { prisma } from '@/lib/queries/db';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

interface ProConnectSession {
  email: string;
}

interface TacctUser {
  email: string;
  username: string;
}

export async function GET() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('pc_session')?.value;

  if (!sessionCookie) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
  }

  let session: ProConnectSession;
  try {
    session = jwt.verify(sessionCookie, process.env.NEXTAUTH_SECRET ?? '') as ProConnectSession;
  } catch {
    return NextResponse.json({ error: 'Session expirée' }, { status: 401 });
  }

  const rows = await prisma.$queryRawUnsafe<TacctUser[]>(
    `SELECT email, username FROM tacct."user" WHERE email = $1`,
    session.email
  );

  if (rows.length === 0) {
    return NextResponse.json({ error: 'Utilisateur non trouvé dans tacct' }, { status: 404 });
  }

  return NextResponse.json(rows[0]);
}
