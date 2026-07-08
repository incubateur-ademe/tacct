// import AccessibiliteContent from "@__content/accessibilite.mdx";
import { type Metadata } from 'next';

import { anchorHeadingMDXComponents } from '@/mdx-components';

import { Suspense } from 'react';
import BudgetContent from '../../../../content/budget.mdx';
import { Container } from '../../../design-system/server';
import { sharedMetadata } from '../shared-metadata';

const title = 'Budget';
const url = '/budget';
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

const Budget = () => (
  <Container my="4w">
    <Suspense>
      <BudgetContent components={anchorHeadingMDXComponents} />
    </Suspense>
  </Container>
);

export default Budget;
