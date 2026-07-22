import { AncienEspaceCard } from '@/components/mon-espace/AncienEspaceCard';
import { EspaceMenu, EspaceMenuItem } from '@/components/mon-espace/EspaceMenu';
import { HautDePage } from '@/components/mon-espace/HautDePage';
import { ProfilCard } from '@/components/mon-espace/ProfilCard';
import { SuggestionsBanner } from '@/components/mon-espace/SuggestionsBanner';
import { TacctoscopeCard } from '@/components/mon-espace/TacctoscopeCard';
import { SousTitre1 } from '@/design-system/base/Textes';
import { NewContainer } from '@/design-system/layout';
import { decodeUserSession, sessionCookieName } from '@/lib/auth/proconnect';
import { prisma } from '@/lib/queries/db';
import { getUserAnswers } from '@/lib/queries/tacctoscope';
import { CRITERIA } from '@/lib/tacctoscope/content/criteria';
import { getAllProgress } from '@/lib/tacctoscope/progress';
import { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import styles from './monEspace.module.scss';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = { title: 'Mon espace' };

const MENU_ITEMS: EspaceMenuItem[] = [
  { anchor: 'profil', label: 'Profil' },
  { anchor: 'outils', label: 'Outils' },
  // { anchor: 'communaute', label: 'Communauté' },
  { anchor: 'suggestions', label: 'Suggestions' }
];

const TitreSection = ({ children }: { children: string }) => (
  <div className={styles.sectionTitle}>
    <SousTitre1
      htmlTag="h2"
      color="#666666"
      style={{ fontWeight: 700, lineHeight: '2rem' }}
    >
      {children}
    </SousTitre1>
  </div>
);

const MonEspace = async () => {
  const cookieStore = await cookies();
  const raw = cookieStore.get(sessionCookieName())?.value;
  const session = raw ? await decodeUserSession(raw) : null;
  if (!session) redirect('/mon-compte');

  const user = await prisma.user.findUnique({
    where: { id: session.sub },
    select: { firstname: true, lastname: true, email: true, validated: true }
  });
  if (!user) redirect('/mon-compte');

  const answers = await getUserAnswers();
  const progress = getAllProgress(answers);
  const completed = progress.filter(
    (criterion) => criterion.total > 0 && criterion.answered === criterion.total
  ).length;
  const started = progress.filter((criterion) => criterion.answered > 0).length;

  return (
    <NewContainer size="xl">
      <div className={styles.body}>
        <EspaceMenu items={MENU_ITEMS} />

        <div className={styles.content}>
          <section id="profil" aria-label="Profil" className={styles.section}>
            <ProfilCard
              firstname={user.firstname}
              lastname={user.lastname}
              email={user.email}
            />
          </section>

          <section id="outils" className={styles.section}>
            <TitreSection>Outils</TitreSection>
            <div className={styles.sectionInner}>
              <TacctoscopeCard
                hasAnswers={started > 0}
                completed={completed}
                started={started}
                total={CRITERIA.length}
              />
              <AncienEspaceCard validated={user.validated} />
            </div>
          </section>

          {/* <section id="communaute" className={styles.section}>
            <TitreSection>Communauté adaptation</TitreSection>
            <CommunauteCards />
          </section> */}

          <section id="suggestions" className={styles.section}>
            <TitreSection>Suggestions</TitreSection>
            <SuggestionsBanner />
          </section>

          <HautDePage />
        </div>
      </div>
    </NewContainer>
  );
};

export default MonEspace;
