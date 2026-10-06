import { getCurrentUserValide } from '@/lib/auth/getCurrentUser';
import { getUserAnswers } from '@/lib/queries/tacctoscope';
import { estProfilDeverrouille } from '@/lib/segmentation';
import {
  buildQuestionKey,
  getCriterionBySlug,
  getNextCriterionSlug,
  isCriterionSlug,
  isPublicCriterion
} from '@/lib/tacctoscope/keys';
import { AnswerMap } from '@/lib/tacctoscope/types';
import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { CriteresView } from './CriteresView';

export const dynamic = 'force-dynamic';

type Params = { params: Promise<{ critere: string }> };

export async function generateMetadata({
  params
}: Params): Promise<Metadata> {
  const { critere } = await params;
  const criterion = getCriterionBySlug(critere);
  return { title: criterion ? criterion.title : 'TACCToscope' };
}

const CriterionPage = async ({ params }: Params) => {
  const user = await getCurrentUserValide();

  const { critere } = await params;
  if (!isCriterionSlug(critere)) notFound();

  const criterion = getCriterionBySlug(critere);
  if (!criterion) notFound();

  if (!user && !isPublicCriterion(criterion.slug)) redirect('/api/proconnect/login');

  const allAnswers = await getUserAnswers();

  const answers: AnswerMap = {};
  for (const question of criterion.questions) {
    const key = buildQuestionKey(criterion.slug, question.id);
    const value = allAnswers[key];
    if (value != null) answers[key] = value;
  }

  return (
    <CriteresView
      criterion={criterion}
      answers={answers}
      nextSlug={getNextCriterionSlug(criterion.slug)}
      isAuthenticated={estProfilDeverrouille(user?.profil)}
    />
  );
};

export default CriterionPage;
