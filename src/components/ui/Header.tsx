'use client';

import { getLastTerritory } from '@/components/searchbar/fonctions';
import { handleRedirection } from '@/hooks/Redirections';
import useWindowDimensions from '@/hooks/windowDimensions';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { type ReactNode, useEffect, useState } from 'react';
import { useStyles } from 'tss-react/dsfr';
import { Brand } from '../Brand';
import HeaderRechercheTerritoire from '../searchbar/header/HeaderRechercheTerritoire';
import { Toast } from '../utils/Toast';
import styles from './Header.module.scss';
import { accountItemComp } from './HeaderMonCompteMenu';

const menuModalId = 'header-menu-modal-fr-header';
const menuButtonId = 'fr-header-menu-button';
const menuCloseButtonId = 'fr-header-mobile-overlay-button-close';

const CheckIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
      fill="#fafafa"
    />
  </svg>
);

type NavLink = {
  isActive: boolean;
  href: string;
  text: string;
};

type NavItem =
  | {
    type: 'link';
    isActive: boolean;
    href: string;
    target: string;
    text: ReactNode;
  }
  | {
    type: 'menu';
    isActive: boolean;
    text: string;
    links: NavLink[];
  };

const HeaderComp = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const params = usePathname();
  const urlCode = searchParams.get('code');
  const urlLibelle = searchParams.get('libelle');
  const urlType = searchParams.get('type') as
    | 'epci'
    | 'commune'
    | 'departement'
    | 'ept'
    | 'petr'
    | 'pnr'
    | null;
  const [displayCode, setDisplayCode] = useState<string | null>(urlCode);
  const [displayLibelle, setDisplayLibelle] = useState<string | null>(
    urlLibelle
  );
  const [displayType, setDisplayType] = useState<
    'epci' | 'commune' | 'departement' | 'ept' | 'petr' | 'pnr' | null
  >(urlType);
  const [user, setUser] = useState<null | {
    username: string;
    email: string;
    firstname: string;
    lastname: string;
  }>(null);
  const [showLoginToast, setShowLoginToast] = useState(false);
  const isQuestionnaire = params === '/questionnaire-compte';

  useEffect(() => {
    fetch('/api/proconnect/me')
      .then((r) => r.json())
      // Un compte dont le questionnaire n'est pas validé n'ouvre encore aucun accès.
      .then((d) => setUser(d.user?.questionnaire_validated ? d.user : null))
      .catch(() => setUser(null));
  }, []);

  useEffect(() => {
    const login = searchParams.get('login') === 'success';
    if (!login) return;
    setShowLoginToast(true);
    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.delete('login');
    const query = nextParams.toString();
    router.replace(query ? `${params}?${query}` : params, { scroll: false });
  }, [searchParams, params, router]);

  useEffect(() => {
    if (params === '/') {
      setDisplayCode(null);
      setDisplayLibelle(null);
      setDisplayType(null);
    } else if (!urlCode && !urlLibelle && !urlType) {
      const lastTerritory = getLastTerritory();
      if (lastTerritory) {
        setDisplayCode(lastTerritory.code);
        setDisplayLibelle(lastTerritory.libelle);
        setDisplayType(
          lastTerritory.type as
          | 'epci'
          | 'commune'
          | 'departement'
          | 'ept'
          | 'petr'
          | 'pnr'
        );
      }
    } else {
      setDisplayCode(urlCode);
      setDisplayLibelle(urlLibelle);
      setDisplayType(urlType);
    }
  }, [urlCode, urlLibelle, urlType, params]);

  const { css } = useStyles();
  const windowDimensions = useWindowDimensions();
  const lastTerritory = getLastTerritory();

  const redirectionPatch4 = handleRedirection({
    searchCode: displayCode ?? '',
    searchLibelle: displayLibelle ?? '',
    typeTerritoire: displayType as
      | 'epci'
      | 'commune'
      | 'departement'
      | 'ept'
      | 'petr'
      | 'pnr',
    page:
      displayType && displayLibelle ? 'patch4c' : 'recherche-territoire-patch4'
  });

  const redirectionExplorerMesDonnees = handleRedirection({
    searchCode: displayCode || '',
    searchLibelle: displayLibelle || '',
    typeTerritoire: displayType || '',
    page: lastTerritory?.thematique
      ? 'donnees'
      : displayType
        ? 'thematiques'
        : 'recherche-territoire',
    thematique: lastTerritory?.thematique
  });

  const wide = !!windowDimensions.width && windowDimensions.width > 768;

  const territorySearchItems =
    displayType &&
      params !== '/' &&
      !isQuestionnaire &&
      !(windowDimensions.width && windowDimensions.width < 768)
      ? [
        <HeaderRechercheTerritoire
          key="recherche-territoire"
          libelle={displayLibelle ?? ''}
          code={displayCode ?? ''}
          type={displayType}
        />
      ]
      : [];

  const showServiceTitle = !!(
    wide &&
    (params === '/' || isQuestionnaire)
  );

  const isActiveDonneesTerritoire = [
    '/donnees-territoriales',
    '/recherche-territoire',
    '/thematiques',
    '/explorer-mes-donnees',
    '/donnees',
    '/impacts'
  ].includes(params);

  const isActivePatch4 = ['/patch4c', '/recherche-territoire-patch4'].includes(
    params
  );

  const navigationItems: NavItem[] =
    params !== '/' && !isQuestionnaire
      ? [
        // {
        //   type: 'link',
        //   isActive: false,
        //   href: '/',
        //   target: '_self',
        //   text: (
        //     <Image
        //       src={maisonIcon}
        //       alt="Accueil"
        //       width={20}
        //       height={20}
        //       title="Accueil"
        //     />
        //   )
        // },
        {
          type: 'menu',
          isActive: isActiveDonneesTerritoire || isActivePatch4,
          text: 'Données de mon territoire',
          links: [
            {
              isActive: isActiveDonneesTerritoire,
              href: redirectionExplorerMesDonnees,
              text: 'Indicateurs socio-économiques'
            },
            {
              isActive: isActivePatch4,
              href: redirectionPatch4,
              text: 'Patch 4°C'
            }
          ]
        },
        {
          type: 'link',
          isActive: params.includes('/ressources'),
          href: '/ressources',
          target: '_self',
          text: 'Boîte à outils'
        },
        {
          type: 'link',
          isActive: false,
          href: 'https://tally.so/r/n0LrEZ',
          target: '_blank',
          text: 'Communauté'
        }
      ]
      : [];

  const accountItem = accountItemComp(user)
  
  return (
    <>
      <header
        role="banner"
        id="fr-header"
        className={`fr-header ${css({
          zIndex: '500',
          '.fr-container':
            windowDimensions.width &&
              windowDimensions.width > 1024 &&
              displayType
              ? {
                marginRight: '1.5rem',
                maxWidth: '85dvw'
              }
              : {},
          '.fr-container-sm, .fr-container-md, .fr-container-lg': {
            maxWidth: '78rem'
          },
          '.fr-header__navbar': {
            display: 'none'
          },
          '.fr-header__brand': {
            filter:
              windowDimensions.width && windowDimensions.width > 992
                ? 'drop-shadow(var(--raised-shadow))'
                : 'unset'
          },
          '.fr-nav__link[aria-current], .fr-nav__btn[aria-current]': {
            color: 'var(--principales-vert)',
            ':before': {
              backgroundColor: 'var(--principales-vert)'
            }
          },
          '.fr-header__service-title': {
            fontSize: '16px',
            fontWeight: 500
          },
          '.fr-btns-group': {
            margin: '0'
          },
          '.fr-header__tools': {
            padding: '0 1.5rem'
          },
          '.fr-header__tools-links': {
            display: 'flex'
          }
        })}`}
      >
        <div className="fr-header__body">
          <div className="fr-container">
            <div className="fr-header__body-row">
              <div className="fr-header__brand fr-enlarge-link">
                <div className="fr-header__brand-top">
                  <div className="fr-header__logo">
                    {showServiceTitle ? (
                      <p className="fr-logo">
                        <Brand />
                      </p>
                    ) : (
                      <Link href="/" title="Accueil - TACCT">
                        <p className="fr-logo">
                          <Brand />
                        </p>
                      </Link>
                    )}
                  </div>
                  <div className="fr-header__operator">
                    <img
                      className="fr-responsive-img"
                      style={{ maxWidth: '9.0625rem' }}
                      src="/logo-ademe-tacct-sans-titre.png"
                      alt="Logo de l'ADEME"
                    />
                  </div>
                  <div className="fr-header__navbar">
                    <button
                      className="fr-btn--menu fr-btn"
                      data-fr-opened="false"
                      aria-controls={menuModalId}
                      aria-haspopup="menu"
                      id={menuButtonId}
                      title="Menu"
                    >
                      Menu
                    </button>
                  </div>
                </div>
                {showServiceTitle && (
                  <div className="fr-header__service">
                    <Link href="/" title="Accueil - TACCT">
                      <p className="fr-header__service-title">
                        Trajectoires d’Adaptation au Changement Climatique des
                        Territoires
                      </p>
                    </Link>
                  </div>
                )}
              </div>
              <div className="fr-header__tools">
                <div className="fr-header__tools-links">
                  <ul className="fr-btns-group">
                    {!isQuestionnaire && (
                      <li key="account-desktop">{accountItem}</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className="fr-header__menu fr-modal"
          id={menuModalId}
          aria-labelledby={menuButtonId}
        >
          <div className="fr-container">
            <button
              id={menuCloseButtonId}
              className="fr-btn--close fr-btn"
              aria-controls={menuModalId}
              title="Fermer"
            >
              Fermer
            </button>
            <div className="fr-header__menu-links">
              <ul className="fr-btns-group">
                {!isQuestionnaire && (
                  <li key="account-mobile">{accountItem}</li>
                )}
              </ul>
            </div>
            {navigationItems.length > 0 && (
              <div className={styles.navWithSearch}>
                <nav
                  id="fr-header-main-navigation"
                  className="fr-nav"
                  role="navigation"
                  aria-label="Menu principal"
                >
                  <ul className="fr-nav__list">
                    {navigationItems.map((item, i) => (
                      <li key={i} className="fr-nav__item">
                        {item.type === 'link' ? (
                          <Link
                            href={item.href}
                            target={item.target}
                            id={`fr-header-main-navigation-link-${i}`}
                            className="fr-nav__link"
                            {...(item.isActive
                              ? { 'aria-current': 'page' }
                              : {})}
                          >
                            {item.text}
                          </Link>
                        ) : (
                          <>
                            <button
                              className="fr-nav__btn"
                              aria-expanded={false}
                              aria-controls={`fr-header-main-navigation-menu-${i}`}
                              id={`fr-header-main-navigation-button-${i}`}
                              {...(item.isActive
                                ? { 'aria-current': true }
                                : {})}
                            >
                              {item.text}
                            </button>
                            <div
                              className="fr-menu fr-collapse"
                              id={`fr-header-main-navigation-menu-${i}`}
                            >
                              <ul className="fr-menu__list">
                                {item.links.map((link, j) => (
                                  <li key={j}>
                                    <Link
                                      href={link.href}
                                      id={`fr-header-main-navigation-menu-${i}-link-${j}`}
                                      className="fr-nav__link"
                                      {...(link.isActive
                                        ? { 'aria-current': 'page' }
                                        : {})}
                                    >
                                      {link.text}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                </nav>
                <div className={styles.searchWrapper}>
                  {territorySearchItems}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
      <Toast
        open={showLoginToast}
        onClose={() => setShowLoginToast(false)}
        icon={<CheckIcon />}
        text="Vous êtes connecté·e"
      />
    </>
  );
};

export default HeaderComp;
