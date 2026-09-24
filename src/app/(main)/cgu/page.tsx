import { type Metadata } from 'next';

import { anchorHeadingMDXComponents } from '@/mdx-components';

import { Suspense } from 'react';
import CguContent from '../../../../content/cgu.mdx';
import { Container } from '../../../design-system/server';
import styles from '../pagesLegales.module.scss';
import { sharedMetadata } from '../shared-metadata';

const title = "Conditions générales d'utilisation";
const url = '/cgu';

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

const Cgu = () => (
  <Container my="4w">
    <div className={styles.contenu}>
      <Suspense>
        <CguContent components={anchorHeadingMDXComponents} />
      </Suspense>
    </div>
  </Container>
);

export default Cgu;
