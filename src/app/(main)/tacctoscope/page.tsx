import { HubGrid, HubItem } from '@/components/tacctoscope/criterion/HubGrid';
import { Body, H1 } from '@/design-system/base/Textes';
import { NewContainer } from '@/design-system/layout';
import { getCurrentUser } from '@/lib/auth/getCurrentUser';
import { getUserAnswers } from '@/lib/queries/tacctoscope';
import { CRITERIA } from '@/lib/tacctoscope/content/criteria';
import { getCriterionProgress } from '@/lib/tacctoscope/progress';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import styles from './tacctoscope.module.scss';

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
    <>
      <div className={styles.introOuter}>
        <NewContainer size="xl" style={{ position: "relative", zIndex: 1 }}>
          <header className={styles.intro}>
            <H1
              style={{
                fontSize: '1.75rem',
                fontWeight: 700,
                color: '#038278',
                margin: 0
              }}
            >
              Le TACCToscope
            </H1>
            <Body style={{ fontSize: '1rem', color: '#038278' }}>
              Votre diagnostic de vulnérabilité répond-il à ces 5 critères essentiels ?
            </Body>
            <Body
              style={{
                fontSize: '0.9375rem',
                lineHeight: 1.6,
                color: '#3d3d3d',
                maxWidth: '760px'
              }}
            >
              Optimisez le temps et les ressources consacrés au diagnostic de
              vulnérabilité en capitalisant sur le travail réalisé précédemment.
            </Body>
          </header>
        </NewContainer>
      </div>

      <NewContainer size="xl">
        <HubGrid items={items} />
      </NewContainer>
    </>
  );
};

export default TacctoscopePage;
