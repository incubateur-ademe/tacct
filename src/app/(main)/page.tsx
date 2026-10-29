'use client';

import Notice from '@codegouvfr/react-dsfr/Notice';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useStyles } from 'tss-react/dsfr';
import { DemarcheBloc } from './(home)/DemarcheBloc';
import { HeroBloc } from './(home)/HeroBloc';
import { PatchEtRessourcesBloc } from './(home)/PatchEtRessourcesBloc';
import { TacctBloc } from './(home)/TacctBloc';
import { TacctoscopeBloc } from './(home)/TacctoscopeBloc';
import { VerbatimBloc } from './(home)/VerbatimBloc';

const NOTICE_KEY = 'notice-pollution-ozone-fermee';
const NOTICE_START = new Date('2026-10-29');
const NOTICE_END = new Date('2026-11-12T23:59:59');

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
            backgroundColor: "var(--gris-medium)",
            color: 'black'
          })}
          classes={{ title: css({ fontWeight: 400 }) }}
          isClosable={true}
          onClose={handleCloseNotice}
          title={
            <>
              TACCT enrichit ses données sur la <b>pollution à l’ozone</b>&nbsp;:
              publication de la thématique <b>Air</b>&nbsp;; ajout de
              l’<b>exposition de vos cultures</b> (thématique Agriculture)&nbsp;;
              et mise à jour des données concernant l’<b>impact sur vos
              végétaux</b> (thématique Biodiversité). Découvrez également si
              votre territoire dispose d’un <b>projet alimentaire
              territorial</b> (Agriculture) <span aria-hidden="true">⇒</span>{' '}
              <Link href="/recherche-territoire">
                j’explore les nouvelles données
              </Link>
            </>
          }
        />
      )}
      <HeroBloc />
      <TacctoscopeBloc />
      <TacctBloc />
      <DemarcheBloc />
      <PatchEtRessourcesBloc />
      <VerbatimBloc />
    </div>
  );
};

export default Home;
