import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  if (
    process.env.NEXT_PUBLIC_ENV === 'preprod' ||
    process.env.NEXT_PUBLIC_ENV === 'development'
  ) {
    return {
      rules: {
        userAgent: '*',
        disallow: '/'
      }
    };
  }
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/*', '/sandbox/*', '/iframe/*', '/iframe']
    },
    sitemap: 'https://tacct.ademe.fr/sitemap.xml'
  };
}
