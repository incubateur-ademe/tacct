'use client';

import { usePathname } from 'next/navigation';
import { useLayoutEffect, useRef } from 'react';

const FRAMES_STABLES = 10;
const FRAMES_MAX = 300;

// Navigation vers une autre page avec ancre : on part du haut de la page, puis
// on descend en défilement animé vers l'ancre une fois sa position stabilisée.
// Monté après le contenu pour passer après le défilement natif de Next.js.
export const DefilementVersAncre = () => {
  const pathname = usePathname();
  const pathnamePrecedent = useRef<string | null>(null);

  useLayoutEffect(() => {
    const estNavigation =
      pathnamePrecedent.current !== null && pathnamePrecedent.current !== pathname;
    pathnamePrecedent.current = pathname;
    const ancre = decodeURIComponent(window.location.hash.slice(1));
    if (!estNavigation || !ancre) return;

    window.scrollTo({ top: 0, behavior: 'instant' });

    let handle = 0;
    let frames = 0;
    let framesStables = 0;
    let positionPrecedente: number | null = null;

    const annuler = () => {
      cancelAnimationFrame(handle);
      window.removeEventListener('wheel', annuler);
      window.removeEventListener('touchstart', annuler);
      window.removeEventListener('keydown', annuler);
    };

    const attendreCible = () => {
      const cible = document.getElementById(ancre);
      if (cible) {
        const position = cible.getBoundingClientRect().top + window.scrollY;
        framesStables =
          positionPrecedente !== null && Math.abs(position - positionPrecedente) < 1
            ? framesStables + 1
            : 0;
        positionPrecedente = position;
        if (framesStables >= FRAMES_STABLES || frames >= FRAMES_MAX) {
          annuler();
          // Sans `behavior` : suit le `scroll-behavior` CSS, et donc la
          // préférence « réduire les animations » (RGAA 13.8).
          cible.scrollIntoView({ block: 'start' });
          return;
        }
      }
      frames += 1;
      if (frames > FRAMES_MAX) {
        annuler();
        return;
      }
      handle = requestAnimationFrame(attendreCible);
    };

    handle = requestAnimationFrame(attendreCible);
    window.addEventListener('wheel', annuler, { passive: true });
    window.addEventListener('touchstart', annuler, { passive: true });
    window.addEventListener('keydown', annuler);

    return annuler;
  }, [pathname]);

  return null;
};
