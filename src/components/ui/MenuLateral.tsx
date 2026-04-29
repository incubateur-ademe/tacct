'use client';

import { sommaireImpacts, sommaireThematiques } from '@/app/(main)/(parcours)/thematiques/constantes/textesThematiques';
import { ErrorDisplay } from '@/app/ErrorDisplay';
import DoubleChevronIcon from '@/assets/icons/double_chevron_icon_black.svg';
import retourIcon from '@/assets/icons/retour_icon_black.svg';
import { Body, H2, SousTitre2 } from '@/design-system/base/Textes';
import { handleRedirection, handleRedirectionThematique } from '@/hooks/Redirections';
import { GetErosionCotiere } from '@/lib/queries/postgis/cartographie';
import Image from 'next/image';
import { usePathname, useSearchParams } from 'next/navigation';
import { usePostHog } from 'posthog-js/react';
import { useEffect, useRef, useState } from 'react';
import styles from '../components.module.scss';

export const MenuLateral = ({ isCollapsed, onToggleCollapse }: { isCollapsed: boolean; onToggleCollapse: (collapsed: boolean) => void }) => {
  const searchParams = useSearchParams();
  const posthog = usePostHog();
  const params = usePathname();
  const code = searchParams.get('code')!;
  const libelle = searchParams.get('libelle')!;
  const type = searchParams.get('type')!;
  const thematique = searchParams.get('thematique') as "Confort thermique" | "Gestion des risques" | "Aménagement" | "Eau" | "Biodiversité" | "Agriculture";
  const [topPosition, setTopPosition] = useState<number>(173);
  const [navigationHeight, setNavigationHeight] = useState<number>(0);
  const [openEtape1, setOpenEtape1] = useState<boolean>(params === "/donnees" ? true : false);
  const [openEtape2, setOpenEtape2] = useState<boolean>(params === "/impacts" ? true : false);
  const navigationRef = useRef<HTMLDivElement>(null);
  const ongletsMenuEtape1 = sommaireThematiques[thematique];
  const ongletsMenuEtape2 = sommaireImpacts[thematique];
  const [activeAnchorEtape1, setActiveAnchorEtape1] = useState<string>('');
  const [activeAnchorEtape2, setActiveAnchorEtape2] = useState<string>('');
  const [urlAnchor, setUrlAnchor] = useState<string | null>(null);
  const [isErosionCotiere, setIsErosionCotiere] = useState<boolean>(false);
  const [isContentVisible, setIsContentVisible] = useState<boolean>(!isCollapsed);

  const redirectionRetour = handleRedirection({
    searchCode: code || '',
    searchLibelle: libelle || '',
    typeTerritoire: type as 'epci' | 'commune' | 'pnr' | 'petr' | 'departement',
    page: 'thematiques'
  });

  useEffect(() => {
    if (window.location.hash) {
      const anchor = decodeURIComponent(window.location.hash.substring(1));
      setUrlAnchor(anchor);
      requestAnimationFrame(() => scrollToAnchor(anchor));
    }
    void (async () => {
      const erosionCotiere = await GetErosionCotiere(code, libelle, type);
      if (erosionCotiere.length && erosionCotiere[0].length > 0) {
        setIsErosionCotiere(true);
      } else setIsErosionCotiere(false);
    })()
  }, [libelle]);

  // Mesurer la hauteur de la div de navigation
  useEffect(() => {
    const measureHeight = () => {
      if (navigationRef.current) {
        const height = navigationRef.current.offsetHeight;
        setNavigationHeight(height);
      }
    };
    measureHeight();
    const timeoutId = setTimeout(measureHeight, 50);
    return () => clearTimeout(timeoutId);
  }, [openEtape1, openEtape2, isErosionCotiere]);

  // Fonction pour gérer le scroll et mettre en surbrillance l'élément actuel
  useEffect(() => {
    if (ongletsMenuEtape1 === undefined) return;
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const headerHeight = 173;
      const footerHeight = 330;
      const documentHeight = document.documentElement.scrollHeight;
      const windowHeight = window.innerHeight;
      let newTopPosition = Math.max(0, headerHeight - scrollY);
      const distanceFromBottom = documentHeight - (scrollY + windowHeight);
      const screenHeightAboveFooter = windowHeight + (distanceFromBottom - footerHeight)
      if (distanceFromBottom <= footerHeight &&
        screenHeightAboveFooter < (navigationHeight + 101)
      ) {
        newTopPosition = (screenHeightAboveFooter - (navigationHeight + 150));
      }
      setTopPosition(newTopPosition);

      // Gestion du surlignage des éléments selon l'étape active
      const scrollPosition = scrollY + 200; // Offset pour la détection
      if (params === "/donnees") {
        const allAnchors = ongletsMenuEtape1.thematiquesLiees.flatMap(section => section.sousCategories);
        allAnchors.push("Érosion côtière");
        for (const item of allAnchors) {
          const element = document.getElementById(toAnchorId(item));
          if (element) {
            const elementTop = element.offsetTop;
            const elementBottom = elementTop + element.offsetHeight;
            if (scrollPosition >= elementTop && scrollPosition < elementBottom) {
              setActiveAnchorEtape1(toAnchorId(item));
              break;
            }
          }
        }
      } else if (params === "/impacts") {
        const allAnchors = ongletsMenuEtape2.map(item => item.id);
        for (const itemId of allAnchors) {
          const element = document.getElementById(itemId);
          if (element) {
            const elementTop = element.offsetTop;
            const elementBottom = elementTop + element.offsetHeight;
            if (scrollPosition >= elementTop && scrollPosition < elementBottom) {
              setActiveAnchorEtape2(itemId);
              break;
            }
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [navigationHeight, openEtape1, openEtape2]);

  // Handle content visibility with delay for smooth animation
  useEffect(() => {
    if (!isCollapsed) {
      const timer = setTimeout(() => setIsContentVisible(true), 500);
      return () => clearTimeout(timer);
    } else {
      setIsContentVisible(false);
    }
  }, [isCollapsed]);

  const toAnchorId = (s: string) => s.replace(/\s+/g, '-');

  const scrollToAnchor = (anchor: string) => {
    const decodedAnchor = decodeURIComponent(anchor);
    const element = document.getElementById(decodedAnchor);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const handleItemClickEtape1 = (item: string) => {
    if (params !== "/donnees") {
      window.location.href = handleRedirectionThematique({
        code: code || '',
        libelle: libelle || '',
        type: type as 'epci' | 'commune' | 'pnr' | 'petr' | 'departement',
        page: 'donnees',
        thematique: thematique,
        anchor: item ? toAnchorId(item) : ""
      });
      return;
    }
    setUrlAnchor(item);
    setActiveAnchorEtape2('');
    scrollToAnchor(toAnchorId(item));
  };
  const handleItemClickEtape2 = (item: { id: string; titre: string }) => {
    if (params !== "/impacts") {
      posthog.capture('clic_diagnostic_impact_menu', {
        thematique: thematique
      });

      window.location.href = handleRedirectionThematique({
        code: code || '',
        libelle: libelle || '',
        type: type as 'epci' | 'commune' | 'pnr' | 'petr' | 'departement',
        page: 'impacts',
        thematique: thematique,
        anchor: item ? item.id : ""
      });
      return;
    }
    setUrlAnchor(item.id);
    setActiveAnchorEtape1('');
    scrollToAnchor(item.id);
  };
  const handleEtape1Toggle = () => {
    setOpenEtape1(!openEtape1);
  };
  const handleEtape2Toggle = () => {
    setOpenEtape2(!openEtape2);
  };

  return (
    <>
      {ongletsMenuEtape1 ? (
        <nav
          className={styles.sidebarContainer}
          style={{
            top: `${topPosition}px`,
            height: `calc(100vh - ${topPosition}px)`,
            borderRight: '1px solid var(--gris-medium)',
            padding: isCollapsed ? "0" : "1.5rem 1.25rem",
            zIndex: 50,
            width: isCollapsed ? '50px' : '322px',
            transition: 'width 0.5s ease-in-out, padding 0.5s ease-in-out'
          }}
          aria-label="Navigation dans la page"
          role="navigation"
        >
          <button
            onClick={() => onToggleCollapse(!isCollapsed)}
            className={styles.toggle_button}
            title={!isCollapsed ? "Réduire le menu" : "Ouvrir le menu"}
          >
            <Image
              src={DoubleChevronIcon}
              alt={isCollapsed ? "Ouvrir le menu" : "Réduire le menu"}
              className={`${isCollapsed ? styles.toggle_icon_collapsed : styles.toggle_icon_expanded}`}
              style={{
                width: '16px',
                height: '16px',
                transform: isCollapsed ? 'rotate(0deg)' : 'rotate(180deg)',
                transition: 'transform 0.2s',
              }}
            />
          </button>
          {isContentVisible && (
            <>
              <div>
                {/* Bouton de retour */}
                <div
                  style={{ borderBottom: '1px solid var(--gris-medium)' }}
                >
                  <a
                    href={redirectionRetour}
                    className="flex items-center gap-2"
                    style={{ backgroundImage: 'none' }}
                  >
                    <Image src={retourIcon} alt="" />
                    <Body size='sm' weight='bold'>Retour aux thématiques</Body>
                  </a>

                  {/* Titre principal */}
                  <H2 style={{ fontSize: '1.25rem', margin: "18px 0" }}>
                    {thematique}
                  </H2>
                </div>
              </div>
              {/* Navigation */}
              <div className="flex flex-col" ref={navigationRef}>
                <button
                  type="button"
                  onClick={handleEtape1Toggle}
                  className={styles.BoutonEtapes}
                  aria-expanded={openEtape1}
                  aria-current={params === "/donnees" ? "page" : undefined}
                >
                  {openEtape1 ? (
                    <span
                      className={styles['chevron-right-green']}
                      style={{ transform: 'rotate(90deg)', transition: 'transform 0.2s ease-in-out' }}
                    />
                  ) : (
                    <span
                      className={styles['chevron-right-black']}
                      style={{ transform: 'rotate(0deg)', transition: 'transform 0.2s ease-in-out' }}
                    />
                  )}
                  <Body size='lg' weight='bold' htmlTag="span" style={{ color: openEtape1 ? "var(--principales-vert)" : "black" }}>
                    {thematique === "Confort thermique" ? <>Étape 1. <br />Données de votre territoire</> : "Données de votre territoire"}
                  </Body>
                </button>
                <div className={thematique === "Confort thermique" ? styles.menuEtapeDonnees : styles.menuEtapeDonneesSansImpact}>
                  {openEtape1 && ongletsMenuEtape1?.thematiquesLiees.map((thematique, id) => (
                    <div key={id} className="mb-4">
                      <SousTitre2
                        style={{
                          color: "var(--principales-rouge)",
                          padding: "0 0 0.5rem"
                        }}
                      >
                        {thematique.icone}{" "}{thematique.thematique}
                      </SousTitre2>
                      <div className="">
                        {thematique.sousCategories.map((item) => (
                          <button
                            key={item}
                            type="button"
                            onClick={() => handleItemClickEtape1(item)}
                            aria-current={activeAnchorEtape1 === toAnchorId(item) ? "location" : undefined}
                            className={`block w-full text-left p-2 text-sm rounded-md transition-colors ${activeAnchorEtape1 === toAnchorId(item)
                              ? styles.itemSurligne
                              : styles.itemNonSurligne
                              }`}
                          >
                            <Body size='sm' htmlTag="span">{item}</Body>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                  {
                    isErosionCotiere && thematique === "Gestion des risques" && (
                      <>
                        <SousTitre2
                          style={{
                            color: "var(--principales-rouge)",
                            padding: "0.5rem 0 0.5rem"
                          }}
                        >
                          🏗️ Aménagement
                        </SousTitre2>
                        <div className="">
                          <button
                            key={"Érosion"}
                            type="button"
                            onClick={() => handleItemClickEtape1("Érosion côtière")}
                            aria-current={activeAnchorEtape1 === "Érosion-côtière" ? "location" : undefined}
                            className={`block w-full text-left p-2 text-sm rounded-md transition-colors ${activeAnchorEtape1 === "Érosion-côtière"
                              ? styles.itemSurligne
                              : styles.itemNonSurligne
                              }`}
                          >
                            <Body size='sm' htmlTag="span">Érosion côtière</Body>
                          </button>
                        </div>
                      </>
                    )
                  }
                </div>
                {thematique === "Confort thermique" || thematique === "Agriculture" ? (
                  <>
                    <button
                      type="button"
                      onClick={handleEtape2Toggle}
                      className={styles.BoutonEtapes}
                      aria-expanded={openEtape2}
                      aria-current={params === "/impacts" ? "page" : undefined}
                    >
                      {openEtape2 ? (
                        <span
                          className={styles['chevron-right-green']}
                          style={{ transform: 'rotate(90deg)', transition: 'transform 0.2s ease-in-out' }}
                        />
                      ) : (
                        <span
                          className={styles['chevron-right-black']}
                          style={{ transform: 'rotate(0deg)', transition: 'transform 0.2s ease-in-out' }}
                        />
                      )}
                      <Body size='lg' weight='bold' htmlTag="span" style={{ color: openEtape2 ? "var(--principales-vert)" : "black" }}>
                        Étape 2. <br />Diagnostiquez les impacts
                      </Body>
                    </button>
                    <div className={styles.menuEtapeImpacts}>
                      {
                        openEtape2 && ongletsMenuEtape2.map((item) => (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => handleItemClickEtape2(item)}
                            aria-current={activeAnchorEtape2 === item.id ? "location" : undefined}
                            className={`block w-full text-left ${activeAnchorEtape2 === item.id
                              ? styles.itemSurligne
                              : styles.itemNonSurligne
                              }`}
                          >
                            <Body size='sm' htmlTag="span">{item.titre}</Body>
                          </button>
                        ))
                      }
                    </div>
                  </>
                ) : ""
                }
                {/* {thematique === "Agriculture" && (
                  <>
                    <button
                      onClick={handleEtape2Toggle}
                      className={styles.BoutonEtapes}
                    >
                      {openEtape2 ? (
                        <span
                          className={styles['chevron-right-green']}
                          style={{ transform: 'rotate(90deg)', transition: 'transform 0.2s ease-in-out' }}
                        />
                      ) : (
                        <span
                          className={styles['chevron-right-black']}
                          style={{ transform: 'rotate(0deg)', transition: 'transform 0.2s ease-in-out' }}
                        />
                      )}
                      <Body size='lg' weight='bold' htmlTag="span" style={{ color: openEtape2 ? "var(--principales-vert)" : "black" }}>
                        Étape 2. <br />Diagnostiquez les impacts
                      </Body>
                    </button>
                    <div className={styles.menuEtapeImpacts}>
                      {
                        openEtape2 && ongletsMenuEtape2.map((item) => (
                          <button
                            key={item.id}
                            onClick={() => handleItemClickEtape2(item)}
                            className={`block w-full text-left ${activeAnchorEtape2 === item.id
                              ? styles.itemSurligne
                              : styles.itemNonSurligne
                              }`}
                          >
                            <Body size='sm' htmlTag="span">{item.titre}</Body>
                          </button>
                        ))
                      }
                    </div>
                  </>
                )} */}
              </div>
            </>
          )}
        </nav>
      ) : <ErrorDisplay code="404" />
      }
    </>
  )
};
