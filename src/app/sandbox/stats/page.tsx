import { Body, H1 } from '@/design-system/base/Textes';
import { NewContainer } from '@/design-system/layout';
import { auth } from '@/lib/auth/authOptions';
import { redirect } from 'next/navigation';
import DisconnectButton from './DisconnectButton';
import OngletsDashboards from './ongletsDashboards';

const SandboxUserPage = async () => {
  const session = await auth();
  if (!session) {
    redirect('/');
  }
  return (
    <NewContainer size="xl" style={{ padding: "3rem 1rem" }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <DisconnectButton />
      </div>
      <H1 style={{ margin: "1rem 0 1.5rem" }}>Bienvenue dans l'espace privé TACCT</H1>
      <Body>
        <i>
          Cette page présente les statistiques d’utilisation du site TACCT.
        </i>
      </Body>
      <OngletsDashboards />
    </NewContainer>
  );
}

export default SandboxUserPage;
