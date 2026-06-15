import 'server-only';
import { cookies } from 'next/headers';
import { cache } from 'react';
import { decodeUserSession, sessionCookieName } from '@/lib/auth/proconnect';
import { prisma } from '@/lib/queries/db';

export const getCurrentUser = cache(async () => {
  const cookieStore = await cookies();
  const raw = cookieStore.get(sessionCookieName())?.value;
  if (!raw) return null;

  const session = await decodeUserSession(raw);
  if (!session) return null;

  return prisma.user.findUnique({
    where: { id: session.sub },
    select: {
      id: true,
      username: true,
      email: true,
      firstname: true,
      lastname: true
    }
  });
});
