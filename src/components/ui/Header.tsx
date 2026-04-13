'use client';

import maisonIcon from '@/assets/icons/maison_icon_black.svg';
import MonCompteIcone from '@/assets/icons/mon-compte-icon-green.svg';
import { getLastTerritory } from '@/components/searchbar/fonctions';
import { Body } from '@/design-system/base/Textes';
import { handleRedirection } from '@/hooks/Redirections';
import useWindowDimensions from '@/hooks/windowDimensions';
import Header from '@codegouvfr/react-dsfr/Header';
import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { usePostHog } from 'posthog-js/react';
import { useEffect, useState } from 'react';
import { useStyles } from 'tss-react/dsfr';
import { Brand } from '../Brand';
import HeaderRechercheTerritoire from '../searchbar/header/HeaderRechercheTerritoire';

const HeaderComp = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const posthog = usePostHog();
  const params = usePathname();
  const urlCode = searchParams.get('code');
  const urlLibelle = searchParams.get('libelle');
  const urlType = searchParams.get('type') as "epci" | "commune" | "departement" | "ept" | "petr" | "pnr" | null;
  const [displayCode, setDisplayCode] = useState<string | null>(urlCode);
  const [displayLibelle, setDisplayLibelle] = useState<string | null>(urlLibelle);
  const [displayType, setDisplayType] = useState<"epci" | "commune" | "departement" | "ept" | "petr" | "pnr" | null>(urlType);
  const { css } = useStyles();
  const windowDimensions = useWindowDimensions();
  const lastTerritory = getLastTerritory();

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
      quickAccessItems={
        params === "/" && !displayType
          ? [
            <button
              key="mon-compte"
              className='flex flex-row items-center'
              onClick={() => {
                posthog.capture(
                  "click_bouton_mon_compte_header",
                  {
                    date: new Date(),
                  }
                );
                router.push('/mon-compte')
              }}
            >
              <Image
                src={MonCompteIcone}
                alt="Mon compte"
                width={windowDimensions.width && windowDimensions.width > 992 ? 16 : 24}
                height={windowDimensions.width && windowDimensions.width > 992 ? 16 : 24}
              />
              {
                windowDimensions.width && windowDimensions.width > 992 &&
                <Body style={{ marginLeft: "0.5rem", color: "var(--principales-vert)" }}>
                  Mon compte
                </Body>
              }
            </button>
          ]
          : windowDimensions.width && windowDimensions.width < 992 && displayType && params !== "/"
            ? []
            : displayType && params !== "/"
              ? [
                <HeaderRechercheTerritoire
                  key="recherche-territoire"
                  libelle={displayLibelle ?? ''}
                  code={displayCode ?? ''}
                  type={displayType}
                />
              ] : []
      }
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
