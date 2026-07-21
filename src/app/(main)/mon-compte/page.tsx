import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/getCurrentUser';
import { MonCompteClient } from './MonCompteClient';

export default async function MonComptePage() {
  const user = await getCurrentUser();
  if (user) redirect('/mon-espace');
  return <MonCompteClient />;
}
