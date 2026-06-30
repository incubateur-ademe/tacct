'use client';

import { sommaireImpacts, sommaireThematiques } from '@/app/(main)/(parcours)/thematiques/constantes/textesThematiques';
import retourIcon from '@/assets/icons/retour_icon_black.svg';
import { Body, H2, SousTitre2 } from '@/design-system/base/Textes';
import { handleRedirection, handleRedirectionThematique } from '@/hooks/Redirections';
import { GetErosionCotiere } from '@/lib/queries/postgis/cartographie';
import Image from 'next/image';
import { usePathname, useSearchParams } from 'next/navigation';
import { usePostHog } from 'posthog-js/react';
import { useEffect, useState } from 'react';
import styles from '../components.module.scss';

export const MenuMobileDrawer = () => {
  const searchParams = useSearchParams();
  const posthog = usePostHog();
  const params = usePathname();
  const code = searchParams.get('code')!;
  const libelle = searchParams.get('libelle')!;
  const type = searchParams.get('type')!;
  const thematique = searchParams.get('thematique') as "Confort thermique" | "Gestion des risques" | "Aménagement" | "Eau" | "Biodiversité" | "Agriculture";

  const [openEtape1, setOpenEtape1] = useState<boolean>(true);
  const [openEtape2, setOpenEtape2] = useState<boolean>(false);
  const [activeAnchorEtape1, setActiveAnchorEtape1] = useState<string>('');
  const [activeAnchorEtape2, setActiveAnchorEtape2] = useState<string>('');
  const [isErosionCotiere, setIsErosionCotiere] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const ongletsMenuEtape1 = sommaireThematiques[thematique];
  const ongletsMenuEtape2 = sommaireImpacts[thematique];

  const redirectionRetour = handleRedirection({
    searchCode: code || '',
    searchLibelle: libelle || '',
    typeTerritoire: type as 'epci' | 'commune' | 'pnr' | 'petr' | 'departement',
    page: 'thematiques'
  });

  useEffect(() => {
    void (async () => {
      const erosionCotiere = await GetErosionCotiere(code, libelle, type);
      setIsErosionCotiere(erosionCotiere.length > 0 && Array.isArray(erosionCotiere[0]) && erosionCotiere[0].length > 0);
    })();
  }, [libelle]);

  useEffect(() => {
    if (ongletsMenuEtape1 === undefined) return;
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;
      if (params === '/donnees') {
        const allAnchors = ongletsMenuEtape1.thematiquesLiees.flatMap(s => s.sousCategories);
        allAnchors.push('Érosion côtière');
        for (const item of allAnchors) {
          const el = document.getElementById(toAnchorId(item));
          if (el) {
            const top = el.offsetTop;
            if (scrollPosition >= top && scrollPosition < top + el.offsetHeight) {
              setActiveAnchorEtape1(toAnchorId(item));
              break;
            }
          }
        }
      } else if (params === '/impacts') {
        for (const item of ongletsMenuEtape2.map(i => i.id)) {
          const el = document.getElementById(item);
          if (el) {
            const top = el.offsetTop;
            if (scrollPosition >= top && scrollPosition < top + el.offsetHeight) {
              setActiveAnchorEtape2(item);
              break;
            }
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [openEtape1, openEtape2]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!ongletsMenuEtape1) return null;

  const toAnchorId = (s: string) => s.replace(/\s+/g, '-');

  const scrollToAnchor = (anchor: string) => {
    const el = document.getElementById(decodeURIComponent(anchor));
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleItemClickEtape1 = (item: string) => {
    if (params !== '/donnees') {
      window.location.href = handleRedirectionThematique({
        code, libelle,
        type: type as 'epci' | 'commune' | 'pnr' | 'petr' | 'departement',
        page: 'donnees', thematique, anchor: item ? toAnchorId(item) : ''
      });
    } else {
      setActiveAnchorEtape2('');
      scrollToAnchor(toAnchorId(item));
    }
    setIsOpen(false);
  };

  const handleItemClickEtape2 = (item: { id: string; titre: string }) => {
    if (params !== '/impacts') {
      posthog.capture('clic_diagnostic_impact_menu', { thematique });
      window.location.href = handleRedirectionThematique({
        code, libelle,
        type: type as 'epci' | 'commune' | 'pnr' | 'petr' | 'departement',
        page: 'impacts', thematique, anchor: item ? item.id : ''
      });
    } else {
      setActiveAnchorEtape1('');
      scrollToAnchor(item.id);
    }
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={styles.menuMobileFab}
        aria-label="Ouvrir la navigation"
      >
        <span aria-hidden="true">☰</span>
        Navigation
      </button>

      {isOpen && (
        <div
          className={styles.menuMobileBackdrop}
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      <div
        className={`${styles.menuMobileDrawer} ${isOpen ? styles.menuMobileDrawerOpen : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation dans la page"
      >
        <div className={styles.menuMobileDrawerHeader}>
          <div className="flex items-center justify-between">
            <a
              href={redirectionRetour}
              className="flex items-center gap-2"
              style={{ backgroundImage: 'none' }}
            >
              <Image src={retourIcon} alt="" />
              <Body size='sm' weight='bold'>Retour aux thématiques</Body>
            </a>
            <button
              onClick={() => setIsOpen(false)}
              className={styles.menuMobileClose}
              aria-label="Fermer la navigation"
            >
              ✕
            </button>
          </div>
          <H2 style={{ fontSize: '1.25rem', margin: '12px 0 0' }}>{thematique}</H2>
        </div>

        <div className={styles.menuMobileDrawerContent}>
          <button
            type="button"
            onClick={() => setOpenEtape1(!openEtape1)}
            className={styles.BoutonEtapes}
            aria-expanded={openEtape1}
          >
            {openEtape1 ? (
              <span className={styles['chevron-right-green']} style={{ transform: 'rotate(90deg)', transition: 'transform 0.2s ease-in-out' }} />
            ) : (
              <span className={styles['chevron-right-black']} style={{ transform: 'rotate(0deg)', transition: 'transform 0.2s ease-in-out' }} />
            )}
            <Body size='lg' weight='bold' htmlTag="span" style={{ color: openEtape1 ? 'var(--principales-vert)' : 'black' }}>
              {thematique === 'Confort thermique' ? <>Étape 1. <br />Données de votre territoire</> : 'Données de votre territoire'}
            </Body>
          </button>

          <div className={thematique === 'Confort thermique' ? styles.menuEtapeDonnees : styles.menuEtapeDonneesSansImpact}>
            {openEtape1 && ongletsMenuEtape1.thematiquesLiees.map((them, id) => (
              <div key={id} className="mb-4">
                <SousTitre2 style={{ color: 'var(--principales-rouge)', padding: '0 0 0.5rem' }}>
                  {them.icone} {them.thematique}
                </SousTitre2>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {them.sousCategories.map((item) => (
                    <li key={item}>
                      <button
                        type="button"
                        onClick={() => handleItemClickEtape1(item)}
                        aria-current={activeAnchorEtape1 === toAnchorId(item) ? 'location' : undefined}
                        className={`block w-full text-left p-2 text-sm rounded-md transition-colors ${activeAnchorEtape1 === toAnchorId(item) ? styles.itemSurligne : styles.itemNonSurligne}`}
                      >
                        <Body size='sm' htmlTag="span">{item}</Body>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            {isErosionCotiere && thematique === 'Gestion des risques' && (
              <>
                <SousTitre2 style={{ color: 'var(--principales-rouge)', padding: '0.5rem 0 0.5rem' }}>
                  🏗️ Aménagement
                </SousTitre2>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  <li>
                    <button
                      type="button"
                      onClick={() => handleItemClickEtape1('Érosion côtière')}
                      aria-current={activeAnchorEtape1 === 'Érosion-côtière' ? 'location' : undefined}
                      className={`block w-full text-left p-2 text-sm rounded-md transition-colors ${activeAnchorEtape1 === 'Érosion-côtière' ? styles.itemSurligne : styles.itemNonSurligne}`}
                    >
                      <Body size='sm' htmlTag="span">Érosion côtière</Body>
                    </button>
                  </li>
                </ul>
              </>
            )}
          </div>

          {(thematique === 'Confort thermique' || thematique === 'Agriculture') && (
            <>
              <button
                type="button"
                onClick={() => setOpenEtape2(!openEtape2)}
                className={styles.BoutonEtapes}
                aria-expanded={openEtape2}
              >
                {openEtape2 ? (
                  <span className={styles['chevron-right-green']} style={{ transform: 'rotate(90deg)', transition: 'transform 0.2s ease-in-out' }} />
                ) : (
                  <span className={styles['chevron-right-black']} style={{ transform: 'rotate(0deg)', transition: 'transform 0.2s ease-in-out' }} />
                )}
                <Body size='lg' weight='bold' htmlTag="span" style={{ color: openEtape2 ? 'var(--principales-vert)' : 'black' }}>
                  Étape 2. <br />Diagnostiquez les impacts
                </Body>
              </button>
              <ul className={styles.menuEtapeImpacts} style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {openEtape2 && ongletsMenuEtape2.map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => handleItemClickEtape2(item)}
                      aria-current={activeAnchorEtape2 === item.id ? 'location' : undefined}
                      className={`block w-full text-left ${activeAnchorEtape2 === item.id ? styles.itemSurligne : styles.itemNonSurligne}`}
                    >
                      <Body size='sm' htmlTag="span">{item.titre}</Body>
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </>
  );
};
