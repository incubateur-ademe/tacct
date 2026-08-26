import HeaderComp from '@/components/ui/Header';
import { ClientOnly } from '@/components/utils/ClientOnly';
import { type Metadata } from 'next';
import dynamicImport from 'next/dynamic';
import { Suspense, type PropsWithChildren } from 'react';
import { NextAppDirEmotionCacheProvider } from 'tss-react/next/appDir';
import { sharedMetadata } from '../../(main)/shared-metadata';
import { config } from '../../../config';

export const metadata: Metadata = {
  metadataBase: new URL(config.host),
  ...sharedMetadata,
  openGraph: {
    ...sharedMetadata.openGraph
  },
  description: config.description
};

const PostHogPageView = dynamicImport(() => import('../../PostHogPageView'));

const LayoutQuestionnaire = ({ children }: PropsWithChildren) => {
  return (
    <NextAppDirEmotionCacheProvider options={{ key: 'css' }}>
      <Suspense>
        <PostHogPageView />
      </Suspense>
      <ClientOnly>
        <HeaderComp />
      </ClientOnly>
      <main id="contenu" tabIndex={-1}>
        {children}
      </main>
    </NextAppDirEmotionCacheProvider>
  );
};

export default LayoutQuestionnaire;
