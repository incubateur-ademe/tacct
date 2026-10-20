import './global.css';

import { ErudaDevConsole } from '@/components/dev/ErudaDevConsole';
import { DefilementVersAncre } from '@/components/utils/DefilementVersAncre';
import { DsfrProvider, StartDsfrOnHydration } from '@/design-system';
import { DsfrHead, getHtmlAttributes } from '@/design-system/server-only-index';
import { cx } from '@codegouvfr/react-dsfr/tools/cx';
import { type PropsWithChildren } from 'react';
import { PHProvider } from './providers';
import styles from './root.module.scss';

const RootLayout = ({ children }: PropsWithChildren) => {
  return (
    <html
      lang="fr"
      {...getHtmlAttributes({ lang: 'fr' })}
      className={cx(styles.app)}
      title=""
      data-scroll-behavior="smooth"
    >
      <head>
        <DsfrHead
          preloadFonts={[
            'Marianne-Regular',
            "Marianne-Medium",
            "Marianne-Bold"
          ]}
        />
        <link rel="preconnect" href="https://metabase.tacct.ademe.fr" />
      </head>
      <PHProvider>
        <body>
          <DsfrProvider lang="fr">
            <StartDsfrOnHydration />
            <ErudaDevConsole />
            {children}
            <DefilementVersAncre />
          </DsfrProvider>
        </body>
      </PHProvider>
    </html>
  );
};

export default RootLayout;
