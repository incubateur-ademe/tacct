import { AncienEspaceCard } from '@/components/mon-espace/AncienEspaceCard';
import { BlocAutre } from '@/components/mon-espace/BlocAutre';
import { BlocElu } from '@/components/mon-espace/BlocElu';
import { BlocEntreprise } from '@/components/mon-espace/BlocEntreprise';
import { BlocServiceTacct } from '@/components/mon-espace/BlocServiceTacct';
import {
  EntreprisePlateformeAgir,
  EntrepriseRessourcesAdeme
} from '@/components/mon-espace/BlocsRessourcesEntreprise';
import {
  BeAccompagnementEntreprises,
  BeFormation
} from '@/components/mon-espace/BlocsBureauEtudes';
import { CommunauteAdaptationCards } from '@/components/mon-espace/CommunauteAdaptationCards';
import { EluPourAgir } from '@/components/mon-espace/EluPourAgir';
import { EspaceMenu, EspaceMenuItem } from '@/components/mon-espace/EspaceMenu';
import { HautDePage } from '@/components/mon-espace/HautDePage';
import { ProfilCard } from '@/components/mon-espace/ProfilCard';
import { SuggestionsBanner } from '@/components/mon-espace/SuggestionsBanner';
import { TacctoscopeCard } from '@/components/mon-espace/TacctoscopeCard';
import { SousTitre1 } from '@/design-system/base/Textes';
import { NewContainer } from '@/design-system/layout';
import { requireQuestionnaireValide } from '@/lib/auth/requireQuestionnaireValide';
import { prisma } from '@/lib/queries/db';
import { getUserAnswers } from '@/lib/queries/tacctoscope';
import {
  estProfilAdminEtat,
  estProfilAutre,
  estProfilBe,
  estProfilElu,
  estProfilEntreprise,
  SectionEspace,
  sectionsEspace
} from '@/lib/segmentation';
import { CRITERIA } from '@/lib/tacctoscope/content/criteria';
import { getRecommendationCount } from '@/lib/tacctoscope/content/roadmapResources';
import { getAllProgress } from '@/lib/tacctoscope/progress';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react';
import styles from './monEspace.module.scss';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = { title: 'Mon espace' };

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
  const compte = await requireQuestionnaireValide();

  const user = await prisma.user.findUnique({
    where: { id: compte.id },
    select: {
      firstname: true,
      lastname: true,
      email: true,
      validated: true,
      profil: true,
      membre_communaute: true,
      territoire_type: true,
      territoire_libelle: true,
      territoire_autre: true
    }
  });
  if (!user) redirect('/api/proconnect/login');

  const answers = await getUserAnswers();
  const progress = getAllProgress(answers);
  const completed = progress.filter(
    (criterion) => criterion.total > 0 && criterion.answered === criterion.total
  ).length;
  const started = progress.filter((criterion) => criterion.answered > 0).length;
  const isComplete = completed === CRITERIA.length;
  const recommendationCount = isComplete ? getRecommendationCount(answers) : 0;

  const sections = sectionsEspace(user.profil);

  const SECTIONS: Record<
    SectionEspace,
    { titre: string; labelMenu: string; contenu: ReactNode }
  > = {
    outils: {
      titre: 'Outils',
      labelMenu: 'Outils',
      contenu: (
        <div className={styles.sectionInner}>
          {!estProfilBe(user.profil) && (
            <TacctoscopeCard
              hasAnswers={started > 0}
              isComplete={isComplete}
              recommendationCount={recommendationCount}
              completed={completed}
              started={started}
              total={CRITERIA.length}
            />
          )}
          <AncienEspaceCard validated={user.validated} />
        </div>
      )
    },
    communaute: {
      titre: 'Communauté adaptation',
      labelMenu: 'Communauté',
      contenu: (
        <CommunauteAdaptationCards
          membreCommunaute={user.membre_communaute}
        />
      )
    },
    'liens-utiles': {
      titre: 'Liens utiles',
      labelMenu: 'Liens utiles',
      contenu: (
        <div className={styles.sectionInner}>
          {estProfilElu(user.profil) && <EluPourAgir />}
          {estProfilBe(user.profil) && (
            <>
              <BeAccompagnementEntreprises />
              <BeFormation />
            </>
          )}
          {estProfilAdminEtat(user.profil) && <BlocServiceTacct />}
          {estProfilEntreprise(user.profil) && (
            <>
              <EntreprisePlateformeAgir />
              <EntrepriseRessourcesAdeme />
            </>
          )}
          {estProfilAutre(user.profil) && <BeFormation />}
        </div>
      )
    },
    suggestions: {
      titre: 'Suggestions',
      labelMenu: 'Suggestions',
      contenu: <SuggestionsBanner />
    }
  };

  const menuItems: EspaceMenuItem[] = [
    { anchor: 'profil', label: 'Profil' },
    ...sections.map((cle) => ({ anchor: cle, label: SECTIONS[cle].labelMenu }))
  ];

  return (
    <NewContainer size="xl">
      <div className={styles.body}>
        <EspaceMenu items={menuItems} />

        <div className={styles.content}>
          <section id="profil" aria-label="Profil" className={styles.section}>
            <div className={styles.sectionInner}>
              <ProfilCard
                firstname={user.firstname}
                lastname={user.lastname}
                email={user.email}
                profil={user.profil}
                territoireType={user.territoire_type}
                territoireLibelle={user.territoire_libelle}
                territoireAutre={user.territoire_autre}
              />
              {(estProfilElu(user.profil) ||
                estProfilAdminEtat(user.profil)) && (
                <BlocElu profil={user.profil} />
              )}
              {estProfilEntreprise(user.profil) && <BlocEntreprise />}
              {estProfilAutre(user.profil) && <BlocAutre />}
            </div>
          </section>

          {sections.map((cle) => (
            <section key={cle} id={cle} className={styles.section}>
              <TitreSection>{SECTIONS[cle].titre}</TitreSection>
              {SECTIONS[cle].contenu}
            </section>
          ))}

          <HautDePage />
        </div>
      </div>
    </NewContainer>
  );
};

export default MonEspace;
