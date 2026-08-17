import { Body, H1 } from '@/design-system/base/Textes';
import { NewContainer } from '@/design-system/layout';
import jwt from 'jsonwebtoken';
import { type Metadata } from 'next';
import styles from './statistiques.module.scss';
import { IndicateurExclusion } from './indicateurExclusion';
import { sharedMetadata } from '../shared-metadata';

const title = 'Statistiques';
const url = '/statistiques';

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

const generateMetabaseUrl = (dashboardId: number): string => {
  const METABASE_URL = process.env.METABASE_URL!;
  const METABASE_EMBEDDING_KEY = process.env.METABASE_EMBEDDING_KEY!;

  const exp = Math.floor(Date.now() / 1000) + (3600 * 24 * 30); // 30 days expiration
  const payload = {
    resource: { dashboard: dashboardId },
    params: {},
    exp
  };

  const token = jwt.sign(payload, METABASE_EMBEDDING_KEY);
  return `${METABASE_URL}/embed/dashboard/${token}#theme=transparent&bordered=false&titled=false`;
};

const Page = async () => {
  const embedUrl = generateMetabaseUrl(4);

  return (
    <NewContainer size="xl">
      <H1>Statistiques</H1>
      <Body>Cette page présente les statistiques d’utilisation du service TACCT.</Body>
      <IndicateurExclusion />
      <div className={styles.iframeContainer}>
        <iframe
          src={embedUrl}
          title="Tableau de bord stats"
          width="100%"
          height="2000"
          className={styles.iframe}
        />
      </div>
    </NewContainer>
  );
};

export default Page;
