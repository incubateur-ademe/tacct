'use client';

import { LegendCompColor } from '@/components/maps/legends/legendComp';
import type { CarteParCommune } from '@/components/maps/mapPartParCommune';
import { Loader } from '@/components/ui/loader';
import { Body } from '@/design-system/base/Textes';
import { lazy, Suspense } from 'react';

const MapPartParCommune = lazy(() =>
  import('@/components/maps/mapPartParCommune').then((m) => ({
    default: m.MapPartParCommune
  }))
);

export const CarteParCommuneAvecLegende = ({
  carte
}: {
  carte: CarteParCommune;
}) => (
  <Suspense
    fallback={
      <div className="flex justify-center w-full">
        <Loader height="500px" />
      </div>
    }
  >
    <div className="w-full">
      <MapPartParCommune carte={carte} />
    </div>
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
        padding: '0.75rem',
        textAlign: 'center'
      }}
    >
      <Body weight="bold">- {carte.titreLegende} -</Body>
      <LegendCompColor
        legends={carte.classes.map(({ value, color }) => ({ value, color }))}
      />
    </div>
  </Suspense>
);
