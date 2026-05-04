import styles from '@/app/(main)/ressources/[collectionId]/[slug]/articles.module.scss';
import { ScrollToTop } from '@/components/interactions/ScrollToTop';
import { H1 } from '@/design-system/base/Textes';
import { NewContainer } from '@/design-system/layout';
import { getFaqItems, type FaqItem } from '@/lib/queries/notion/notion';
import { collectionsCartes } from '@/lib/ressources/cartes';
import { normalizeText } from '@/lib/utils/reusableFunctions/NormalizeTexts';
import Breadcrumb from '@codegouvfr/react-dsfr/Breadcrumb';
import { Metadata } from 'next';
import { BlocCollections, BlocCollectionsResponsive } from '../blocs/blocCollections';
import { FaqAllGroups } from './FaqAccordionGroup';
import { SommaireFAQ } from './Sommaire';

export const metadata: Metadata = {
  title: 'FAQ',
  description: 'Foire aux questions TACCT'
};

const FaqPage = async () => {
  const items = await getFaqItems();

  const grouped = items.reduce<Record<string, FaqItem[]>>((acc, item) => {
    const cat = item.categorie || 'Autres';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  const headings = Object.keys(grouped).map((cat) => normalizeText(cat));

  return (
    <>
      <ScrollToTop />
      <NewContainer size="xl" style={{ padding: "0 1rem" }}>
        <div className={styles.breadcrumbWrapper}>
          <Breadcrumb
            currentPageLabel={"FAQ"}
            homeLinkProps={{ href: '/' }}
            segments={[{ label: 'Boîte à outils', linkProps: { href: '/ressources' } }]}
          />
        </div>
        <H1 style={{ margin: '2rem 0 3.5rem', color: "var(--principales-vert)" }}>
          Questions fréquentes
        </H1>
        <div className={styles.articleContent}>
          <div className={styles.sommaire}>
            <SommaireFAQ headings={headings} />
          </div>
          <div className={styles.article} style={{ paddingTop: "0rem" }}>
            <FaqAllGroups grouped={grouped} />
          </div>
        </div>
      </NewContainer>
      <div className={styles.desktopOnly}>
        <BlocCollections collectionsCartes={collectionsCartes} />
      </div>
      <div className={styles.mobileOnly}>
        <BlocCollectionsResponsive collectionsCartes={collectionsCartes} />
      </div>
    </>
  );
};

export default FaqPage;
