import { getCurrentUser } from '@/lib/auth/getCurrentUser';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { MonCompteClient } from './MonCompteClient';

export const metadata: Metadata = { title: 'Mon compte' };

export default async function MonComptePage() {
  const user = await getCurrentUser();
  if (user) redirect('/mon-espace');
  return <MonCompteClient />;
}
