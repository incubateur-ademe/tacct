'use client';

import Notice from '@codegouvfr/react-dsfr/Notice';
import { useEffect, useState } from 'react';
import { useStyles } from 'tss-react/dsfr';
import { DemarcheBloc } from './(home)/DemarcheBloc';
import { HeroBloc } from './(home)/HeroBloc';
import { HeroBlocMobile } from './(home)/HeroBlocMobile';
import styles from "./(home)/home.module.scss";
import { PatchEtRessourcesBloc } from './(home)/PatchEtRessourcesBloc';
import { TacctBloc } from './(home)/TacctBloc';
import { VerbatimBloc } from './(home)/VerbatimBloc';

const NOTICE_KEY = 'notice-tacct-evolution-fermee';
const NOTICE_START = new Date('2026-03-26');
const NOTICE_END = new Date('2026-04-29T23:59:59');

const Home = () => {
  const { css } = useStyles();
  const [noticeClosed, setNoticeClosed] = useState(true);
  const isWithinNoticePeriod = Date.now() >= NOTICE_START.getTime() && Date.now() <= NOTICE_END.getTime();

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
            color: "#903700"
          })}
          isClosable={true}
          onClose={handleCloseNotice}
          title={"Le service TACCT évolue !"}
          description={
            <>
              <br></br>Pour vous proposer une expérience simplifiée, les plateformes
              TACCT et Facili-TACCT sont désormais regroupées sous une seule
              adresse, tacct.ademe.fr, et un seul nom, TACCT.
            </>
          }
        />
      )}
      <div className={styles.heroBlocDesktopOnly}><HeroBloc /></div>
      <div className={styles.heroBlocMobileOnly}><HeroBlocMobile /></div>
      <TacctBloc />
      <DemarcheBloc />
      <PatchEtRessourcesBloc />
      <VerbatimBloc />
    </div>
  );
};

export default Home;
