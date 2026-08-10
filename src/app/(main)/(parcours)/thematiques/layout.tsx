import type { Metadata } from 'next';
import { Suspense, type PropsWithChildren } from 'react';
import { ThematiquesLayoutClient } from './ThematiquesLayoutClient';

export const metadata: Metadata = { title: 'Vue systémique' };

export default function Layout({ children }: PropsWithChildren) {
  return (
    <Suspense>
      <ThematiquesLayoutClient>{children}</ThematiquesLayoutClient>
    </Suspense>
  );
}
