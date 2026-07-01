import { Body } from '@/design-system/base/Textes';
import { decodeUserSession, sessionCookieName } from '@/lib/auth/proconnect';
import { prisma } from '@/lib/queries/db';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const linkStyle: React.CSSProperties = {
  display: 'inline-block',
  padding: '10px 20px',
  borderRadius: 4,
  textDecoration: 'none',
  fontWeight: 600
};

const MonEspace = async () => {
  const cookieStore = await cookies();
  const raw = cookieStore.get(sessionCookieName())?.value;
  const session = raw ? await decodeUserSession(raw) : null;
  if (!session) redirect('/mon-compte');

  const user = await prisma.user.findUnique({
    where: { id: session.sub },
    select: { firstname: true, lastname: true, email: true, validated: true }
  });
  if (!user) redirect('/mon-compte');

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '3rem 1.5rem' }}>
      <h1>Mon espace</h1>
      <p style={{ fontSize: '1.25rem' }}>
        Bonjour {user.firstname} {user.lastname}
      </p>
      <p>Connecté avec {user.email}</p>
      <Body>
          Statut du user : {user.validated ? 'validé' : 'non validé'}
        </Body>
      <div style={{ display: 'flex', gap: 16, marginTop: 24, flexWrap: 'wrap' }}>
        <a
          href="/workspace-tacct"
          style={{ ...linkStyle, background: '#038278', color: '#fff' }}
        >
          Accéder à l’outil TACCT
        </a>
        <a
          href="/tacctoscope"
          style={{ ...linkStyle, background: '#038278', color: '#fff' }}
        >
          Accéder au TACCToscope
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

export default MonEspace;
