import { RoadmapCriterion } from '@/components/tacctoscope/roadmap/RoadmapCriterion';
import { getCurrentUser } from '@/lib/auth/getCurrentUser';
import { getUserAnswers } from '@/lib/queries/tacctoscope';
import { buildRoadmap } from '@/lib/tacctoscope/roadmap';
import { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import styles from './page.module.scss';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = { title: 'Ma feuille de route - TACCToscope' };

const FeuilleDeRoutePage = async () => {
  const user = await getCurrentUser();
  if (!user) redirect('/mon-compte');

  const answers = await getUserAnswers();
  const roadmap = buildRoadmap(answers);

  return (
    <div className={styles.page}>
      <header className={styles.intro}>
        <h1 className={styles.title}>Votre feuille de route personnalisée</h1>
        <p className={styles.text}>
          Retrouvez vos pistes d’amélioration, organisées par critère, au fil de
          vos réponses.
        </p>
      </header>

      <div className={styles.list}>
        {roadmap.map((item) => (
          <RoadmapCriterion key={item.slug} item={item} />
        ))}
      </div>

      <Link href="/tacctoscope" className={styles.back}>
        Retour aux critères
      </Link>
    </div>
  );
};

export default FeuilleDeRoutePage;
