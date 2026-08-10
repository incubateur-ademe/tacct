import { fr } from '@codegouvfr/react-dsfr';
import { CookiesPolicy } from '@incubateur-ademe/legal-pages-react/CookiesPolicy';
import { type Metadata } from 'next';
import { Suspense } from 'react';
import { CookieConsentButton } from '../CookieConsentButton';
import { sharedMetadata } from '../shared-metadata';

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
      <Suspense>
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
