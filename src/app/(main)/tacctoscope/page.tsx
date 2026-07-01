import { HubGrid, HubItem } from '@/components/tacctoscope/criterion/HubGrid';
import { Body, H1 } from '@/design-system/base/Textes';
import { NewContainer } from '@/design-system/layout';
import { getCurrentUser } from '@/lib/auth/getCurrentUser';
import { getUserAnswers } from '@/lib/queries/tacctoscope';
import { CRITERIA } from '@/lib/tacctoscope/content/criteria';
import { isPublicCriterion } from '@/lib/tacctoscope/keys';
import { getCriterionProgress } from '@/lib/tacctoscope/progress';
import Breadcrumb from '@codegouvfr/react-dsfr/Breadcrumb';
import { Metadata } from 'next';
import styles from './tacctoscope.module.scss';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = { title: 'Le TACCToscope' };

const TacctoscopePage = async () => {
  const user = await getCurrentUser();

  const answers = await getUserAnswers();

  const items: HubItem[] = CRITERIA.map((criterion) => {
    const { answered, total } = getCriterionProgress(criterion, answers);
    return {
      criterion,
      answered,
      total,
      locked: !user && !isPublicCriterion(criterion.slug)
    };
  });

  return (
    <>
      <NewContainer size="xl" style={{ padding: 0 }}>
        <div className={styles.breadcrumbWrapper}>
          <Breadcrumb
            currentPageLabel="TACCToscope"
            homeLinkProps={{ href: '/' }}
            segments={[{ label: 'Boîte à outils', linkProps: { href: '/ressources' } }]}
          />
        </div>
      </NewContainer>
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
