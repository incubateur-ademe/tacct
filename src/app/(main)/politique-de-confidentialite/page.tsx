import { type MDXComponents } from 'mdx/types';
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

// Les tableaux défilent horizontalement (pagesLegales.module.scss) :
// ils doivent être atteignables au clavier.
const composantsMDX: MDXComponents = {
  ...anchorHeadingMDXComponents,
  table: (props) => <table tabIndex={0} {...props} />
};

// Le fallback réserve la hauteur pour que le pied de page ne s'affiche pas en
// haut d'écran avant l'arrivée du contenu (décalage de mise en page).
const PolitiqueConfidentialite = () => (
  <Container my="4w">
    <div className={styles.contenu}>
      <Suspense fallback={<div style={{ minHeight: '100dvh' }} />}>
        <PolitiqueConfidentialiteContent components={composantsMDX} />
      </Suspense>
    </div>
  </Container>
);

export default PolitiqueConfidentialite;
