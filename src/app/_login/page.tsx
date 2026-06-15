import { auth } from '@/lib/auth/authOptions';
// import { redirect } from "next/navigation";
import LoginForm from './form';

export default async function SignIn() {
  const session = await auth();
  console.log('session', session);
  if (session) {
    // redirect("/api/ressources");
  }
  return (
    <div className="h-screen flex items-center justify-center">
      <div className="w-[600px]">
        {session ? <div>{JSON.stringify(session)}</div> : 'déconnecté'}
        <LoginForm />
      </div>
    </div>
  );
}
