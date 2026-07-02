import productLaunch from '@/assets/images/product-launch.png';
import { ExportPdfButton } from '@/components/tacctoscope/roadmap/ExportPdfButton';
import { FeuilleDeRouteView } from '@/components/tacctoscope/roadmap/FeuilleDeRouteView';
import { NewContainer } from '@/design-system/layout';
import { getCurrentUser } from '@/lib/auth/getCurrentUser';
import { getUserAnswers } from '@/lib/queries/tacctoscope';
import Breadcrumb from '@codegouvfr/react-dsfr/Breadcrumb';
import { Metadata } from 'next';
import Image from 'next/image';
import styles from './roadmap.module.scss';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = { title: 'Ma feuille de route - TACCToscope' };

const FeuilleDeRoutePage = async () => {
  const user = await getCurrentUser();
  const answers = user ? await getUserAnswers() : {};

  return (
    <>
      <NewContainer size="xl" style={{ padding: 0, position: "relative", zIndex: 1 }}>
        <div className={styles.breadcrumbWrapper}>
          <Breadcrumb
            currentPageLabel="Feuille de route"
            homeLinkProps={{ href: '/' }}
            segments={[
              { label: 'Boîte à outils', linkProps: { href: '/ressources' } },
              { label: 'TACCToscope', linkProps: { href: '/tacctoscope' } }
            ]}
          />
        </div>
      </NewContainer>

      <div className={styles.bannerOuter}>
        <NewContainer size="xl" style={{ padding: 0, position: "relative", zIndex: 1 }}>
          <header className={styles.banner}>
            <div className={styles.bannerText}>
              <h1 className={styles.bannerTitle}>
                Votre feuille de route pour améliorer votre diagnostic
              </h1>
              <p className={styles.bannerSubtitle}>
                Voici l’ensemble des recommandations alimentées par vos réponses
                dans chacun des 5 critères d’analyse. Améliorez votre diagnostic
                de vulnérabilité à votre rythme !
              </p>
              <ExportPdfButton />
            </div>
            <Image
              src={productLaunch}
              alt=""
              className={styles.bannerIllustration}
            />
          </header>
        </NewContainer>
      </div>

      <FeuilleDeRouteView answers={answers} isAuthenticated={!!user} />
    </>
  );
};

export default FeuilleDeRoutePage;
