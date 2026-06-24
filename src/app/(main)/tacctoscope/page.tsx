import { HubGrid, HubItem } from '@/components/tacctoscope/hub/HubGrid';
import { getCurrentUser } from '@/lib/auth/getCurrentUser';
import { getUserAnswers } from '@/lib/queries/tacctoscope';
import { CRITERIA } from '@/lib/tacctoscope/content/criteria';
import { getCriterionProgress } from '@/lib/tacctoscope/progress';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import styles from './page.module.scss';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = { title: 'Le TACCToscope' };

const TacctoscopePage = async () => {
  const user = await getCurrentUser();
  if (!user) redirect('/mon-compte');

  const answers = await getUserAnswers();

  const items: HubItem[] = CRITERIA.map((criterion) => {
    const { answered, total } = getCriterionProgress(criterion, answers);
    return { criterion, answered, total };
  });

  return (
    <div className={styles.page}>
      <header className={styles.intro}>
        <h1 className={styles.title}>Le TACCToscope</h1>
        <p className={styles.subtitle}>
          Votre diagnostic de vulnérabilité répond-il à ces 5 critères essentiels ?
        </p>
        <p className={styles.text}>
          Optimisez le temps et les ressources consacrés au diagnostic de
          vulnérabilité en capitalisant sur le travail réalisé précédemment.
        </p>
      </header>

      <HubGrid items={items} />
    </div>
  );
};

export default TacctoscopePage;
