import { fr } from '@codegouvfr/react-dsfr';
import { LegalNotice } from '@incubateur-ademe/legal-pages-react/LegalNotice';
import { type Metadata } from 'next';
import { sharedMetadata } from '../shared-metadata';

const title = 'Mentions légales';
const url = '/mentions-legales';

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

const LegalNoticePage = () => {
  return (
    <div className={fr.cx('fr-container', 'fr-my-4w')}>
      <LegalNotice
        includeBetaGouv
        siteName="TACCT"
        siteUrl={process.env.NEXT_PUBLIC_SITE_URL!}
        licenceUrl="https://github.com/incubateur-ademe/tacct/blob/main/LICENSE"
        privacyPolicyUrl="/politique-de-confidentialite"
        siteHost={{
          name: 'Scalingo',
          address: '13 rue Jacques Peirotes, 67000 Strasbourg',
          country: 'France',
          email: 'hello@scalingo.com'
        }}
        contactEmail=""
      />
    </div>
  );
};

export default LegalNoticePage;
