import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { decodeUserSession, sessionCookieName } from '@/lib/auth/proconnect';
import { prisma } from '@/lib/queries/db';

const linkStyle: React.CSSProperties = {
  display: 'inline-block',
  padding: '10px 20px',
  borderRadius: 4,
  textDecoration: 'none',
  fontWeight: 600
};

export default async function MonEspace() {
  const cookieStore = await cookies();
  const raw = cookieStore.get(sessionCookieName())?.value;
  const session = raw ? await decodeUserSession(raw) : null;
  if (!session) redirect('/mon-compte');

  const user = await prisma.user.findUnique({
    where: { id: session.sub },
    select: { firstname: true, lastname: true, email: true }
  });
  if (!user) redirect('/mon-compte');

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '3rem 1.5rem' }}>
      <h1>Mon espace</h1>
      <p style={{ fontSize: '1.25rem' }}>
        Bonjour {user.firstname} {user.lastname}
      </p>
      <p>Connecté avec {user.email}</p>
      <div style={{ display: 'flex', gap: 16, marginTop: 24, flexWrap: 'wrap' }}>
        <a
          href="/workspace-tacct"
          style={{ ...linkStyle, background: '#038278', color: '#fff' }}
        >
          Accéder à l’outil TACCT
        </a>
        <a
          href="/api/proconnect/logout"
          style={{ ...linkStyle, background: '#f0f0f0', color: '#161616' }}
        >
          Se déconnecter
        </a>
      </div>
    </div>
  );
}
