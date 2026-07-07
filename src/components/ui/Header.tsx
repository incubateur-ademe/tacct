'use client';

import maisonIcon from '@/assets/icons/maison_icon_black.svg';
import MonCompteIcone from '@/assets/icons/mon-compte-icon-green.svg';
import { getLastTerritory } from '@/components/searchbar/fonctions';
import { Body } from '@/design-system/base/Textes';
import { handleRedirection } from '@/hooks/Redirections';
import useWindowDimensions from '@/hooks/windowDimensions';
import Header from '@codegouvfr/react-dsfr/Header';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { usePostHog } from 'posthog-js/react';
import { useEffect, useState } from 'react';
import { useStyles } from 'tss-react/dsfr';
import { Brand } from '../Brand';
import HeaderRechercheTerritoire from '../searchbar/header/HeaderRechercheTerritoire';
import styles from './Header.module.scss';

const HeaderComp = () => {
  const posthog = usePostHog();
  const searchParams = useSearchParams();
  const router = useRouter();
  const params = usePathname();
  const urlCode = searchParams.get('code');
  const urlLibelle = searchParams.get('libelle');
  const urlType = searchParams.get('type') as "epci" | "commune" | "departement" | "ept" | "petr" | "pnr" | null;
  const [displayCode, setDisplayCode] = useState<string | null>(urlCode);
  const [displayLibelle, setDisplayLibelle] = useState<string | null>(urlLibelle);
  const [displayType, setDisplayType] = useState<"epci" | "commune" | "departement" | "ept" | "petr" | "pnr" | null>(urlType);
  const [user, setUser] = useState<
    null | { username: string; email: string; firstname: string; lastname: string }
  >(null);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);

  useEffect(() => {
    fetch('/api/proconnect/me')
      .then((r) => r.json())
      .then((d) => setUser(d.user))
      .catch(() => setUser(null));
  }, []);

  useEffect(() => {
    if (params === "/") {
      setDisplayCode(null);
      setDisplayLibelle(null);
      setDisplayType(null);
    } else if (!urlCode && !urlLibelle && !urlType) {
      const lastTerritory = getLastTerritory();
      if (lastTerritory) {
        setDisplayCode(lastTerritory.code);
        setDisplayLibelle(lastTerritory.libelle);
        setDisplayType(lastTerritory.type as "epci" | "commune" | "departement" | "ept" | "petr" | "pnr");
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
    typeTerritoire: displayType as 'epci' | 'commune' | 'departement' | 'ept' | 'petr' | 'pnr',
    page: displayType && displayLibelle ? 'patch4c' : 'recherche-territoire-patch4'
  });

  const redirectionExplorerMesDonnees = handleRedirection({
    searchCode: displayCode || '',
    searchLibelle: displayLibelle || '',
    typeTerritoire: displayType || '',
    page: lastTerritory?.thematique ? 'donnees' : displayType ? 'thematiques' : 'recherche-territoire',
    thematique: lastTerritory?.thematique
  });

  const wide = !!windowDimensions.width && windowDimensions.width > 992;

  const accountItem = user ? (
    <div key="account-name" className={styles.accountWrapper}>
      <button
        type="button"
        className={styles.accountButton}
        aria-haspopup="menu"
        aria-expanded={accountMenuOpen}
        onClick={() => setAccountMenuOpen((value) => !value)}
      >
        <Image
          src={MonCompteIcone}
          alt=""
          width={wide ? 16 : 24}
          height={wide ? 16 : 24}
        />
        {wide && (
          <Body style={{ marginLeft: '0.5rem', color: 'var(--principales-vert)' }}>
            {`${user.firstname} ${user.lastname}`}
          </Body>
        )}
      </button>
      {accountMenuOpen && (
        <>
          <div
            className={styles.accountBackdrop}
            onClick={() => setAccountMenuOpen(false)}
            aria-hidden="true"
          />
          <div className={styles.accountMenu} role="menu">
            <Link
              href="/mon-espace"
              role="menuitem"
              className={styles.accountMenuItem}
              onClick={() => setAccountMenuOpen(false)}
            >
              <span aria-hidden="true">→</span>
              Accéder à mon espace
            </Link>
            <a
              href="/api/proconnect/logout"
              role="menuitem"
              className={styles.accountMenuItem}
              onClick={() => setAccountMenuOpen(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={wide ? 16 : 24}
                height={wide ? 16 : 24}
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M4 15H6V20H18V4H6V9H4V3C4 2.73478 4.10536 2.48043 4.29289 2.29289C4.48043 2.10536 4.73478 2 5 2H19C19.2652 2 19.5196 2.10536 19.7071 2.29289C19.8946 2.48043 20 2.73478 20 3V21C20 21.2652 19.8946 21.5196 19.7071 21.7071C19.5196 21.8946 19.2652 22 19 22H5C4.73478 22 4.48043 21.8946 4.29289 21.7071C4.10536 21.5196 4 21.2652 4 21V15ZM10 11V8L15 12L10 16V13H2V11H10Z"
                  fill="#161616"
                />
              </svg>
              Se déconnecter
            </a>
          </div>
        </>
      )}
    </div>
  ) : (
    <button
      className="flex flex-row items-center"
      onClick={() => {
        posthog.capture('click_bouton_mon_compte_header', { date: new Date() });
        router.push('/mon-compte');
      }}
      key="mon-compte-header"
      aria-label="Mon compte"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={wide ? 16 : 24}
        height={wide ? 16 : 24}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M4 15H6V20H18V4H6V9H4V3C4 2.73478 4.10536 2.48043 4.29289 2.29289C4.48043 2.10536 4.73478 2 5 2H19C19.2652 2 19.5196 2.10536 19.7071 2.29289C19.8946 2.48043 20 2.73478 20 3V21C20 21.2652 19.8946 21.5196 19.7071 21.7071C19.5196 21.8946 19.2652 22 19 22H5C4.73478 22 4.48043 21.8946 4.29289 21.7071C4.10536 21.5196 4 21.2652 4 21V15ZM10 11V8L15 12L10 16V13H2V11H10Z"
          fill="#038278"
        />
      </svg>
      {wide && (
        <Body style={{ marginLeft: '0.5rem', color: 'var(--principales-vert)' }}>
          Se connecter
        </Body>
      )}
    </button>
  );

  const territorySearchItems =
    displayType &&
      params !== "/" &&
      !(windowDimensions.width && windowDimensions.width < 992)
      ? [
        <HeaderRechercheTerritoire
          key="recherche-territoire"
          libelle={displayLibelle ?? ''}
          code={displayCode ?? ''}
          type={displayType}
        />
      ]
      : [];

  const quickAccess = [...territorySearchItems, accountItem];

  return (
    <Header
      className={css({
        zIndex: '500',
        '.fr-container': windowDimensions.width && windowDimensions.width > 992 && displayType ? {
          marginRight: "1.5rem",
          maxWidth: '85dvw',
        } : {},
        '.fr-container-sm, .fr-container-md, .fr-container-lg': {
          maxWidth: '78rem'
        },
        '.fr-header__navbar': {
          display: 'none',
        },
        '.fr-header__brand': {
          filter: windowDimensions.width && windowDimensions.width > 992 ? 'drop-shadow(var(--raised-shadow))' : 'unset',
        },
        '.fr-nav__link[aria-current]': {
          color: 'var(--principales-vert)',
          ':before': {
            backgroundColor: 'var(--principales-vert)',
          }
        },
        '.fr-header__service-title': {
          fontSize: "16px",
          fontWeight: 500,
        },
        '.fr-btns-group': {
          margin: "0"
        },
        '.fr-header__tools': {
          padding: "0 1.5rem"
        },
        '.fr-header__tools-links': {
          display: 'flex'
        }
      })}
      brandTop={<Brand />}
      serviceTitle={
        (windowDimensions.width && windowDimensions.width > 992 && (params === "/" || params == "/mon-compte")) ? "Trajectoires d’Adaptation au Changement Climatique des Territoires" : undefined
      }
      homeLinkProps={{
        href: '/',
        title: `Accueil - TACCT`
      }}
      operatorLogo={{
        alt: "Logo de l'ADEME",
        imgUrl: '/logo-ademe-tacct-sans-titre.png',
        orientation: 'horizontal'
      }}
      quickAccessItems={quickAccess}
      navigation={(params !== "/" && params !== "/mon-compte") ? [
        {
          linkProps: {
            href: '/',
            target: '_self'
          },
          text: <Image src={maisonIcon} alt="Accueil" width={20} height={20} title="Accueil" />
        },
        {
          isActive: [
            '/donnees-territoriales',
            '/recherche-territoire',
            '/thematiques',
            '/explorer-mes-donnees',
            '/donnees',
            '/impacts'
          ].includes(params) ? true : false,
          linkProps: {
            href: redirectionExplorerMesDonnees,
            target: '_self'
          },
          text: 'Explorer les données de mon territoire'
        },
        {
          isActive: [
            '/patch4c',
            '/recherche-territoire-patch4'
          ].includes(params),
          linkProps: {
            href: redirectionPatch4,
            target: '_self'
          },
          text: 'Patch 4°C'
        },
        {
          isActive: params.includes('/ressources') ? true : false,
          linkProps: {
            href: '/ressources',
            target: '_self'
          },
          text: 'Boîte à outils'
        },
        {
          linkProps: {
            href: 'https://tally.so/r/n0LrEZ',
            target: '_blank'
          },
          text: 'Communauté'
        }
      ] : []}
    />
  );
};

export default HeaderComp;
