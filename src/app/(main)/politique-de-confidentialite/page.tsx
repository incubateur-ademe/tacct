import { type Metadata } from 'next';

import { anchorHeadingMDXComponents } from '@/mdx-components';

import { Suspense } from 'react';
import PolitiqueConfidentialiteContent from '../../../../content/politique-de-confidentialite.mdx';
import { Container } from '../../../design-system/server';
import styles from '../pagesLegales.module.scss';
import { sharedMetadata } from '../shared-metadata';

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

const PolitiqueConfidentialite = () => (
  <Container my="4w">
    <div className={styles.contenu}>
      <Suspense>
        <PolitiqueConfidentialiteContent components={anchorHeadingMDXComponents} />
      </Suspense>
    </div>
  </Container>
);

export default PolitiqueConfidentialite;
