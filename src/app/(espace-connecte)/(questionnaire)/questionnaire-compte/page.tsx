import { QuestionnaireFlow } from '@/components/questionnaire-de-connexion/QuestionnaireFlow';
import { getCurrentUser } from '@/lib/auth/getCurrentUser';
import { etapeDeReprise } from '@/lib/questionnaire-de-connexion/types';
import { chargerQuestionnaire } from '@/lib/queries/questionnaire-de-connexion/questionnaire';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = { title: 'Création de votre espace TACCT' };

const PageQuestionnaire = async () => {
  const user = await getCurrentUser();
  if (!user) redirect('/api/proconnect/login');
  if (user.questionnaire_validated) redirect('/mon-espace');

  const etat = await chargerQuestionnaire();
  if (!etat) redirect('/api/proconnect/login');

  return (
    <QuestionnaireFlow
      etatInitial={etat}
      etapeInitiale={etapeDeReprise(etat)}
    />
  );
};

export default PageQuestionnaire;
