import { fr } from '@codegouvfr/react-dsfr';
import { CookiesPolicy } from '@incubateur-ademe/legal-pages-react/CookiesPolicy';
import { type Metadata } from 'next';
import { Suspense } from 'react';
import { sharedMetadata } from '../shared-metadata';
import { CookieConsentButton } from '../CookieConsentButton';

const title = 'Politique des cookies';
const url = '/politique-des-cookies';

export const metadata: Metadata = {
  ...sharedMetadata,
  title,
  openGraph: {
    ...sharedMetadata.openGraph,
    title,
    url
  },
  alternates: {
    canonical: url
  }
};

const CookiePolicyPage = () => {
  return (
    <div className={fr.cx('fr-container', 'fr-my-4w')}>
      {/* Le fallback réserve la hauteur pour que le pied de page ne s'affiche
          pas en haut d'écran avant l'arrivée du contenu (décalage de mise en page). */}
      <Suspense fallback={<div style={{ minHeight: '100dvh' }} />}>
        <CookiesPolicy
          analyticTool={{
            name: 'Posthog',
            cookieListUrl: 'https://posthog.com/docs/privacy/gdpr-compliance',
            policyUrl: ''
          }}
          cookieConsentButton={<CookieConsentButton />}
          siteName="TACCT"
        />
      </Suspense>
    </div>
  );
};

export default CookiePolicyPage;
