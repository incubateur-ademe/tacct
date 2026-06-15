import { auth } from '@/lib/auth/authOptions';
import { redirect } from 'next/navigation';
import LoginForm from './loginForm';

export default async function MainLoginPage() {
  const session = await auth();
  if (session) {
    redirect('/');
  }
  return (
    <div className="h-screen flex items-center justify-center">
      <div className="w-[400px]">
        <h2>Connexion à l'espace protégé</h2>
        <LoginForm />
      </div>
    </div>
  );
}
