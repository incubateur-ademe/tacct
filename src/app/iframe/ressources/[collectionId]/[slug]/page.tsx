import { Block } from "@/app/(main)/types";
import { ScrollToTop } from "@/components/interactions/ScrollToTop";
import { ClientOnly } from "@/components/utils/ClientOnly";
import { NewContainer } from "@/design-system/layout";
import { getBlocks, getPageBySlug } from "@/lib/queries/notion/notion";
import { groupAndRenderBlocks } from "@/lib/ressources/bulletListContent";
import { toutesLesRessources } from "@/lib/ressources/toutesRessources";
import { normalizeText } from "@/lib/utils/reusableFunctions/NormalizeTexts";
import Breadcrumb from "@codegouvfr/react-dsfr/Breadcrumb";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { CollectionsData } from "../collectionsData";
import { ArticlesMemeCollection, ArticlesMemeCollectionResponsive } from "./BlocArticlesMemeCollection";
import { SommaireClient } from "./SommaireClient";
import styles from './articles.module.scss';
import { MetaArticleResponsive } from "./metaArticle";

interface ArticlePageProps {
  params: Promise<{
    collectionId: string;
    slug: string;
  }>;
}

export const revalidate = 3600;

export async function generateStaticParams() {
  return toutesLesRessources.map((article) => {
    const collection = CollectionsData.find(c => article.collections.includes(c.titre));
    return {
      collectionId: collection?.slug || '',
      slug: article.slug || '',
    };
  });
}

export const generateMetadata = async (
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> => {
  const { slug } = await params;
  const article = toutesLesRessources.find(a => a.slug === slug);
  if (!article) return {};
  return {
    title: article.metadata?.title,
    description: article.metadata?.description,
    openGraph: {
      title: article.metadata?.title,
      description: article.metadata?.description,
    },
  };
}

const ArticleRessourcePage = async ({ params }: ArticlePageProps) => {
  const { slug, collectionId } = await params;
  const article = toutesLesRessources.find(a => a.slug === slug);
  if (!article) {
    notFound();
  }
  const page = await getPageBySlug(slug);
  if (!page) {
    notFound();
  }
  const getBlocksContent = await getBlocks(page.id) as Block[];

  const titrePrincipal = getBlocksContent.find(block => block.type === 'heading_1');
  const contentWithoutH1 = getBlocksContent.filter(block => block.type !== 'heading_1');
  const headings = contentWithoutH1
    .filter(block => block.type === 'heading_2')
    .map(block => {
      const richText = block.heading_2?.rich_text || [];
      return normalizeText(richText.map(rt => rt.plain_text || rt.text.content).join(''));
    });
  const pageContent = await groupAndRenderBlocks(contentWithoutH1);
  const collection = CollectionsData.find(c => c.slug === collectionId);
  const collectionSlug = CollectionsData.find(c => c.titre === article?.collections[0])?.slug || collectionId;
  const pageTitle = titrePrincipal?.heading_1?.rich_text?.[0]?.plain_text || '';

  return (
    <>
      <ScrollToTop />
      <NewContainer size="xl" style={{ paddingTop: 0 }}>
        <div className={styles.breadcrumbWrapper}>
          <ClientOnly>
            <Breadcrumb
              currentPageLabel={pageTitle}
              homeLinkProps={{ href: '/iframe' }}
              segments={[
                { label: 'Boîte à outils', linkProps: { href: '/iframe/ressources' } },
                { label: collection?.titre, linkProps: { href: `/iframe/ressources/${collectionSlug}` } }
              ]}
            />
          </ClientOnly>
        </div>
        <MetaArticleResponsive getBlocksContent={getBlocksContent} slug={slug} />
        <div className={styles.articleContent}>
          <div className={styles.sommaire}>
            <SommaireClient headings={headings} />
          </div>
          <div className={styles.article}>
            {pageContent}
          </div>
        </div>
      </NewContainer>
      <div className={styles.desktopOnly}>
        <ArticlesMemeCollection />
      </div>
      <div className={styles.mobileOnly}>
        <ArticlesMemeCollectionResponsive />
      </div>
    </>
  )
  // } catch (error) {
  //   return (
  //     <NewContainer size="xl" style={{ padding: "32px 0" }}>
  //       <div className="max-w-4xl mx-auto">
  //         <p className="text-red-600">
  //           ❌ Erreur lors de la récupération de l&apos;article : {error instanceof Error ? error.message : 'Erreur inconnue'}
  //         </p>
  //       </div>
  //     </NewContainer>
  //   );
  // }
};

export default ArticleRessourcePage;
