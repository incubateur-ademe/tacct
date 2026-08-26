import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/getCurrentUser';
import { CHEMIN_QUESTIONNAIRE } from '@/lib/auth/requireQuestionnaireValide';
import { MonCompteClient } from './MonCompteClient';

export default async function MonComptePage() {
  const user = await getCurrentUser();
  if (user?.questionnaire_validated) redirect('/mon-espace');
  if (user) redirect(CHEMIN_QUESTIONNAIRE);
  return <MonCompteClient />;
}
