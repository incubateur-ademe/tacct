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

const NOTICE_KEY = 'notice-tacctoscope-revision-fermee';
const NOTICE_START = new Date('2026-10-13');
const NOTICE_END = new Date('2026-10-23T23:59:59');

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
            backgroundColor: 'var(--gris-medium)',
            color: 'black'
          })}
          isClosable={true}
          onClose={handleCloseNotice}
          title={
            <>
              Vous révisez un diagnostic de vulnérabilité&nbsp;? Ne repartez pas
              de zéro&nbsp;!
            </>
          }
          description={
            <>
              Le <Link href="/tacctoscope">TACCToscope</Link> est là pour vous
              aider à cibler le retravail&nbsp;: 5 catégories de questions, des
              pistes d’améliorations sur mesure et une feuille de route prête à
              l’emploi <span aria-hidden="true">⇒</span>{' '}
              <Link href="/tacctoscope">
                Je commence dès maintenant la révision de mon diagnostic
              </Link>{' '}
              <span aria-hidden="true">🎯</span>
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
