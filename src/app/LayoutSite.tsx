import HeaderComp from '@/components/ui/Header';
import { ClientOnly } from '@/components/utils/ClientOnly';
import AppFooter from '@/design-system/layout/Footer';
import SkipLinks from '@codegouvfr/react-dsfr/SkipLinks';
import { type Metadata } from 'next';
import dynamic from 'next/dynamic';
import { Suspense, type PropsWithChildren } from 'react';
import { NextAppDirEmotionCacheProvider } from 'tss-react/next/appDir';
import { config } from '../config';
import { CookieBanner } from './(main)/cookieBanner';
import { sharedMetadata } from './(main)/shared-metadata';

export const metadataSite: Metadata = {
  metadataBase: new URL(config.host),
  ...sharedMetadata,
  openGraph: {
    ...sharedMetadata.openGraph
  },
  description: config.description
};

const PostHogPageView = dynamic(() => import('./PostHogPageView'));

/**
 * `epure` retire le pied de page et les liens d'évitement : réservé au
 * questionnaire de connexion, dont on ne doit pas pouvoir sortir par la page.
 */
export const LayoutSite = ({
  children,
  variante = 'complet'
}: PropsWithChildren<{ variante?: 'complet' | 'epure' }>) => {
  const complet = variante === 'complet';

  return (
    <NextAppDirEmotionCacheProvider options={{ key: 'css' }}>
      <Suspense>
        <PostHogPageView />
      </Suspense>
      {complet && (
        <SkipLinks
          links={[
            { anchor: '#contenu', label: 'Accéder au contenu' },
            { anchor: '#footer', label: 'Accéder au pied de page' }
          ]}
        />
      )}
      <ClientOnly>
        <HeaderComp />
      </ClientOnly>
      <main id="contenu" tabIndex={-1}>
        {children}
      </main>
      {complet && (
        <>
          <AppFooter />
          <CookieBanner />
        </>
      )}
    </NextAppDirEmotionCacheProvider>
  );
};
