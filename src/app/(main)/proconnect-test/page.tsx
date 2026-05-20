import { ProConnectSignIn } from './ProConnectButton';

interface PageProps {
  searchParams: Promise<{ error?: string }>;
}

export default async function ProConnectTestPage({ searchParams }: PageProps) {
  const { error } = await searchParams;

  return (
    <div className="fr-container fr-my-8w">
      <h1>Connexion ProConnect</h1>
      <p className="fr-text--lead">Cliquez sur le bouton ci-dessous pour vous identifier via ProConnect.</p>

      {error && (
        <div className="fr-alert fr-alert--error fr-mb-4w">
          <p>Erreur : {error}</p>
        </div>
      )}

      <ProConnectSignIn />
    </div>
  );
}
