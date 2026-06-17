"use client";
import { DonneesIndisponiblesOutreMer } from '@/components/DonneesIndisponiblesOutreMer';
import { useSearchParams } from 'next/navigation';
import type { PropsWithChildren } from 'react';

export function ThematiquesLayoutClient({ children }: PropsWithChildren) {
  const searchParams = useSearchParams();
  const code = searchParams.get('code')!;
  if (code && (code.startsWith("987") || code.startsWith("988") || code.startsWith("978") || code.startsWith("977"))) {
    return (
      <div className="py-12">
        <DonneesIndisponiblesOutreMer />;
      </div>
    );
  }

  return <>{children}</>;
}
