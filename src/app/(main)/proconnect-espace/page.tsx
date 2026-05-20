import { prisma } from '@/lib/queries/db';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

interface ProConnectSession {
  sub: string;
  name: string;
  email: string;
}

interface TacctUser {
  email: string;
  username: string;
}

export default async function ProConnectEspacePage() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('pc_session')?.value;

  if (!sessionCookie) {
    redirect('/proconnect-test');
  }

  let session: ProConnectSession;
  try {
    session = jwt.verify(sessionCookie, process.env.NEXTAUTH_SECRET ?? '') as ProConnectSession;
  } catch {
    redirect('/proconnect-test?error=session_expirée');
  }

  const rows = await prisma.$queryRawUnsafe<TacctUser[]>(
    `SELECT email, username FROM tacct."user" WHERE email = $1`,
    session.email
  );
  const tacctUser = rows[0] ?? null;

  return (
    <div className="fr-container fr-my-8w">
      <h1>Espace ProConnect</h1>
      <p>Bienvenue, {session.name || session.email}.</p>
      {tacctUser ? (
        <div>
          <p>Email : {tacctUser.email}</p>
          <p>Username : {tacctUser.username}</p>
        </div>
      ) : (
        <p>Aucun user trouvé avec l&apos;adresse mail {session.email}</p>
      )}
      <a href="/api/proconnect/logout" className="fr-btn fr-btn--secondary fr-mt-4w">
        Se déconnecter
      </a>
    </div>
  );
}
