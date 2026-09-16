import { CollectionsData } from '@/app/(main)/ressources/[collectionId]/collectionsData';
import { toutesLesRessources } from '@/lib/ressources/toutesRessources';
import { CRITERIA } from '@/lib/tacctoscope/content/criteria';
import { isPublicCriterion } from '@/lib/tacctoscope/keys';
import type { MetadataRoute } from 'next';

const sitemap = (): MetadataRoute.Sitemap => {
  const baseUrl = 'https://tacct.ademe.fr';
  const articles = toutesLesRessources
    .map((article) => {
      const collection = CollectionsData.find((c) =>
        article.collections.includes(c.titre)
      );
      return { article, collection };
    })
    // Un article sans collection résoluble produirait une URL cassée.
    .filter(({ article, collection }) => collection?.slug && article.slug)
    .map(({ article, collection }) => ({
      url: `${baseUrl}/ressources/${collection!.slug}/${article.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7
    }));
  // Les autres critères et la feuille de route exigent un compte : les indexer
  // enverrait le robot sur une page verrouillée.
  const criteresTacctoscope = CRITERIA.filter((criterion) =>
    isPublicCriterion(criterion.slug)
  ).map((criterion) => ({
    url: `${baseUrl}/tacctoscope/${criterion.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7
  }));
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1
    },
    {
      url: `${baseUrl}/tacctoscope`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8
    },
    ...criteresTacctoscope,
    ...articles
  ];
};

export default sitemap;
