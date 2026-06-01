'use client';

import { useEffect } from 'react';

// Console intégrée pour debugger sur mobile (notamment iOS Safari, où le Web
// Inspector de Safari n'est pas accessible depuis Windows). Active uniquement
// en développement : aucun chunk eruda n'est chargé en production.
export const ErudaDevConsole = () => {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;
    const w = window as Window & { __erudaInit?: boolean };
    if (w.__erudaInit) return;
    import('eruda').then(({ default: eruda }) => {
      if (w.__erudaInit) return;
      eruda.init();
      w.__erudaInit = true;
    });
  }, []);

  return null;
};
