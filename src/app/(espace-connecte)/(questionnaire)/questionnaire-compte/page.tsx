import { QuestionnaireFlow } from '@/components/questionnaire-de-connexion/QuestionnaireFlow';
import { getCurrentUser } from '@/lib/auth/getCurrentUser';
import { sanitizeReturnTo } from '@/lib/auth/moncompteademe';
import { etapeDeReprise } from '@/lib/questionnaire-de-connexion/types';
import { chargerQuestionnaire } from '@/lib/queries/questionnaire-de-connexion/questionnaire';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = { title: 'Création de votre espace TACCT' };

const PageQuestionnaire = async (props: {
  searchParams: Promise<{ returnTo?: string }>;
}) => {
  const { returnTo } = await props.searchParams;
  const retourApresQuestionnaire = sanitizeReturnTo(returnTo ?? null);

  const user = await getCurrentUser();
  if (!user) redirect('/api/proconnect/login');
  if (user.questionnaire_validated) {
    redirect(retourApresQuestionnaire ?? '/mon-espace');
  }

  const etat = await chargerQuestionnaire();
  if (!etat) redirect('/api/proconnect/login');

  return (
    <QuestionnaireFlow
      etatInitial={etat}
      etapeInitiale={etapeDeReprise(etat)}
      retourApresQuestionnaire={retourApresQuestionnaire ?? '/mon-espace'}
    />
  );
};

export default PageQuestionnaire;
