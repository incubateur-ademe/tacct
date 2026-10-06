import { type Metadata } from 'next';

import { anchorHeadingMDXComponents } from '@/mdx-components';

import { Suspense } from 'react';
import MentionsLegalesContent from '../../../../content/mentions-legales.mdx';
import { Container } from '../../../design-system/server';
import styles from '../pagesLegales.module.scss';
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

const MentionsLegales = () => (
  <Container my="4w">
    <div className={styles.contenu}>
      <Suspense>
        <MentionsLegalesContent components={anchorHeadingMDXComponents} />
      </Suspense>
    </div>
  </Container>
);

export default MentionsLegales;
