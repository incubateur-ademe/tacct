import 'server-only';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/getCurrentUser';

export const CHEMIN_QUESTIONNAIRE = '/questionnaire-compte';

export const requireQuestionnaireValide = async () => {
  const user = await getCurrentUser();
  if (!user) redirect('/mon-compte');
  if (!user.questionnaire_validated) redirect(CHEMIN_QUESTIONNAIRE);
  return user;
};
