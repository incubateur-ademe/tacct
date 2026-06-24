import { getCurrentUser } from '@/lib/auth/getCurrentUser';
import {
  getUserAnswers,
  getUserFeedbacks
} from '@/lib/queries/tacctoscope';
import {
  buildQuestionKey,
  getCriterionBySlug,
  getNextCriterionSlug,
  isCriterionSlug
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
  const user = await getCurrentUser();
  if (!user) redirect('/mon-compte');

  const { critere } = await params;
  if (!isCriterionSlug(critere)) notFound();

  const criterion = getCriterionBySlug(critere);
  if (!criterion) notFound();

  const [allAnswers, feedbacks] = await Promise.all([
    getUserAnswers(),
    getUserFeedbacks()
  ]);

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
      feedback={feedbacks[criterion.slug] ?? null}
      nextSlug={getNextCriterionSlug(criterion.slug)}
    />
  );
};

export default CriterionPage;
