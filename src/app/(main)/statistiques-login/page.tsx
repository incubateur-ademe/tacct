import { H1 } from '@/design-system/base/Textes';
import { NewContainer } from '@/design-system/layout';
import { auth } from '@/lib/auth/authOptions';
import { redirect } from 'next/navigation';
import LoginForm from './loginForm';

export default async function MainLoginPage() {
  const session = await auth();
  if (session) {
    redirect('/sandbox/stats');
  }
  return (
    <NewContainer size="sm" style={{ padding: "4rem 1rem" }}>
      <div
        style={{
          padding: "2.5rem 2rem",
          border: "1px solid var(--gris-medium)",
          borderRadius: "1rem",
          backgroundColor: "white"
        }}
      >
        <H1 style={{ margin: "0 0 2rem" }}>
          Connexion à l'espace protégé
        </H1>
        <LoginForm />
      </div>
    </NewContainer>
  );
}
