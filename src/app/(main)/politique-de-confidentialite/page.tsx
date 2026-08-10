import { fr } from '@codegouvfr/react-dsfr';
import { PrivacyPolicy } from '@incubateur-ademe/legal-pages-react/PrivacyPolicy';
import { type Metadata } from 'next';

import { Suspense } from 'react';
import { sharedMetadata } from '../shared-metadata';
import { CookieConsentButton } from '../CookieConsentButton';

const title = 'Politique de confidentialité';
const url = '/politique-de-confidentialite';

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

const PrivacyPolicyPage = () => {
  return (
    <div className={fr.cx('fr-container', 'fr-my-4w')}>
      <Suspense>
        <PrivacyPolicy
          includeBetaGouv
          cookieConsentButton={<CookieConsentButton />}
          siteName="TACCT"
          cookies={[]}
          thirdParties={[
            {
              name: 'Scalingo',
              country: 'France',
              hostingCountry: 'France - Paris',
              serviceType: 'Hébergement',
              policyUrl: 'https://scalingo.com/data-processing-agreement'
            }
          ]}
        />
      </Suspense>
    </div>
  );
};

export default PrivacyPolicyPage;
