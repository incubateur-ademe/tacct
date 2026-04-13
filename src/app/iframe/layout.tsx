import { ClientOnly } from '@/components/utils/ClientOnly';
import { StartDsfrOnHydration } from '@/design-system';
import '@iframe-resizer/child';
import dynamic from 'next/dynamic';
import { Suspense, type PropsWithChildren } from 'react';
import { NextAppDirEmotionCacheProvider } from 'tss-react/next/appDir';
import '../global.css';

const PostHogPageView = dynamic(() => import('../PostHogPageView'));
const RootLayoutIframe = ({ children }: PropsWithChildren) => {
  return (
    <NextAppDirEmotionCacheProvider options={{ key: 'css' }}>
      <StartDsfrOnHydration />
      <Suspense>
        <PostHogPageView />
      </Suspense>
      <ClientOnly>
        <main>{children}</main>
      </ClientOnly>
    </NextAppDirEmotionCacheProvider>
  );
};

export default RootLayoutIframe;
