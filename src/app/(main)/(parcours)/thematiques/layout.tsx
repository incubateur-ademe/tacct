import type { Metadata } from 'next';
import { Suspense, type PropsWithChildren } from 'react';
import { ThematiquesLayoutClient } from './ThematiquesLayoutClient';

export const metadata: Metadata = { title: 'Roue des thématiques' };

// useSearchParams (ThematiquesLayoutClient) impose un rendu côté client : le
// fallback réserve la hauteur pour que le pied de page ne s'affiche pas en haut
// d'écran le temps du rendu (décalage de mise en page).
export default function Layout({ children }: PropsWithChildren) {
  return (
    <Suspense fallback={<div style={{ minHeight: '100dvh' }} />}>
      <ThematiquesLayoutClient>{children}</ThematiquesLayoutClient>
    </Suspense>
  );
}
