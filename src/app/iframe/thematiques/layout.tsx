import type { Metadata } from 'next';
import type { PropsWithChildren } from 'react';

export const metadata: Metadata = { title: 'Vue systémique' };

export default function Layout({ children }: PropsWithChildren) {
  return <>{children}</>;
}
