'use client';

import { useEffect } from 'react';

// Console intégrée pour debugger sur mobile (notamment iOS Safari, où le Web
// Inspector de Safari n'est pas accessible depuis Windows). Active en dev et en
// preprod (pour débugger un bug visible seulement sur l'environnement déployé).
// Jamais en prod.
export const ErudaDevConsole = () => {
  useEffect(() => {
    const enabled =
      process.env.NODE_ENV === 'development' ||
      process.env.NEXT_PUBLIC_ENV === 'preprod';
    if (!enabled) return;
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
