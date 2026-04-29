import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import DisconnectButton from './DisconnectButton';
import MetabaseComponent from './metabaseComponent';

const SandboxUserPage = async () => {
  const session = await getServerSession();
  if (!session) {
    redirect('/');
  }
  return (
    <div className="p-8">
      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '1rem' }}>
        <DisconnectButton />
      </div>
      <h1>Bienvenue dans l'espace privé TACCT</h1>
      <MetabaseComponent />
    </div>
  );
}

export default SandboxUserPage;
