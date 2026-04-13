import { fr } from '@codegouvfr/react-dsfr';
import { LegalNotice } from '@incubateur-ademe/legal-pages-react/LegalNotice';

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
