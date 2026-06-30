'use client';

import { useEffect } from 'react';

const ScrollToHash = ({
  ancre
}: {
  ancre?: string;
}) => {
  useEffect(() => {
    const scrollToHash = () => {
      if (window.location.hash) {
        console.log('Scrolling to hash:', window.location.hash);
        const element = document.getElementById(decodeURIComponent(window.location.hash.substring(1)));
        if (element) {
          // Attendre que les images et graphiques soient chargés
          if (document.readyState === 'complete') {
            element.scrollIntoView({ behavior: 'smooth' });
          } else {
            window.addEventListener('load', () => {
              element.scrollIntoView({ behavior: 'smooth' });
            }, { once: true });
          }
        } else {
          setTimeout(scrollToHash, 100);
        }
      }
    };
    // Retarder légèrement pour laisser le DOM se stabiliser 
    // Les sécheresses passées dépendent du bloc débroussaillement pour le scroll, d'où un délai plus long
    const timer = setTimeout(scrollToHash, window.location.hash === "#S%C3%A9cheresses-pass%C3%A9es" ? 600 : 250);
    return () => clearTimeout(timer);
  }, []);

  return null;
};

export default ScrollToHash;
