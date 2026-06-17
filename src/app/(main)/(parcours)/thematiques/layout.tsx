import type { Metadata } from 'next';
import type { PropsWithChildren } from 'react';
import { ThematiquesLayoutClient } from './ThematiquesLayoutClient';

export const metadata: Metadata = { title: 'Vue systémique' };

export default function Layout({ children }: PropsWithChildren) {
  return <ThematiquesLayoutClient>{children}</ThematiquesLayoutClient>;
}
