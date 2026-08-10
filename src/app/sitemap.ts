import { CollectionsData } from '@/app/(main)/ressources/[collectionId]/collectionsData';
import { toutesLesRessources } from '@/lib/ressources/toutesRessources';
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
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1
    },
    ...articles
  ];
};

export default sitemap;
