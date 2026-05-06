'use client';

import Notice from '@codegouvfr/react-dsfr/Notice';
import { useEffect, useState } from 'react';
import { useStyles } from 'tss-react/dsfr';
import { DemarcheBloc } from './(home)/DemarcheBloc';
import { HeroBloc } from './(home)/HeroBloc';
import { HeroBlocMobile } from './(home)/HeroBlocMobile';
import styles from './(home)/home.module.scss';
import { PatchEtRessourcesBloc } from './(home)/PatchEtRessourcesBloc';
import { TacctBloc } from './(home)/TacctBloc';
import { VerbatimBloc } from './(home)/VerbatimBloc';
import Link from 'next/link';

const NOTICE_KEY = 'notice-tacct-evolution-fermee';
const NOTICE_START = new Date('2026-05-06');
const NOTICE_END = new Date('2026-05-22T23:59:59');

const Home = () => {
  const { css } = useStyles();
  const [noticeClosed, setNoticeClosed] = useState(true);
  const isWithinNoticePeriod =
    Date.now() >= NOTICE_START.getTime() && Date.now() <= NOTICE_END.getTime();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('dernierTerritoireRecherché');
      setNoticeClosed(localStorage.getItem(NOTICE_KEY) === 'true');
    }
  }, []);

  const handleCloseNotice = () => {
    localStorage.setItem(NOTICE_KEY, 'true');
    setNoticeClosed(true);
  };

  return (
    <div>
      {isWithinNoticePeriod && !noticeClosed && (
        <Notice
          className={css({
            backgroundColor: '#FFD1B4',
            color: '#903700'
          })}
          isClosable={true}
          onClose={handleCloseNotice}
          title={'Patch 4°C :'}
          description={
            <>
              découvrez{' '}
              <Link
                href="https://tacct.ademe.fr/ressources/evaluer-impacts-changement-climatique/patch4-integrer-tracc"
                target="_blank"
              >
                comment intégrer la TRACC dans votre diagnostic
              </Link>
               ! Et pour les Outre-mers, consultez votre {" "}
              <Link
                href="https://tacct.ademe.fr/recherche-territoire-patch4"
                target="_blank"
              >
                projection de référence spécifique
              </Link>
              {" "}(disponible pour la Guyane, Mayotte et La Réunion).
              <br></br>
              Autre nouveauté : TACCT vous propose désormais une {" "}
              <Link
                href="https://tacct.ademe.fr/ressources/faq"
                target="_blank"
              >
                FAQ
              </Link>
              {" "}ainsi qu’un article spécial {" "}
              <Link
                href="https://tacct.ademe.fr/ressources/batir-strategie-adaptation/financement-adaptation"
                target="_blank"
              >
                financement de votre démarche d’adaptation
              </Link>
              .<br></br>
              Une question, un retour ? {" "}
              <Link href="https://tally.so/r/mJGELz" target="_blank">
                Contactez-nous !
              </Link>
            </>
          }
        />
      )}
      <div className={styles.heroBlocDesktopOnly}>
        <HeroBloc />
      </div>
      <div className={styles.heroBlocMobileOnly}>
        <HeroBlocMobile />
      </div>
      <TacctBloc />
      <DemarcheBloc />
      <PatchEtRessourcesBloc />
      <VerbatimBloc />
    </div>
  );
};

export default Home;
