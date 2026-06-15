import { auth } from '@/lib/auth/authOptions';
import { redirect } from 'next/navigation';
import DisconnectButton from '../stats/DisconnectButton';

type SegmentParams<T extends object = any> = T extends Record<string, any>
  ? { [K in keyof T]: T[K] extends string ? string | string[] | undefined : never }
  : T

const SandboxUserPage = async ({ params }: { params: Promise<SegmentParams> }) => {
  const session = await auth();
  const resolvedParams = await params;
  const user = resolvedParams.user as string;
  // If the session user does not match the URL param, redirect to home
  if (!session || session.user?.name !== user) {
    redirect('/');
  }
  return (
    <div className="p-8">
      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '1rem' }}>
        <DisconnectButton />
      </div>
      <h1>Bienvenue dans l'espace protégé de {user}</h1>
      <p>Contenu réservé à {user}.</p>
    </div>
  );
}

export default SandboxUserPage;
