'use client';

import Notice from '@codegouvfr/react-dsfr/Notice';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useStyles } from 'tss-react/dsfr';
import { DemarcheBloc } from './(home)/DemarcheBloc';
import { HeroBloc } from './(home)/HeroBloc';
import { HeroBlocMobile } from './(home)/HeroBlocMobile';
import styles from "./(home)/home.module.scss";
import { PatchEtRessourcesBloc } from './(home)/PatchEtRessourcesBloc';
import { TacctBloc } from './(home)/TacctBloc';
import { VerbatimBloc } from './(home)/VerbatimBloc';

const NOTICE_KEY = 'notice-tacct-espace-connecte-fermee';
const NOTICE_START = new Date('2026-09-22');
const NOTICE_END = new Date('2026-10-03T23:59:59');

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
            backgroundColor: 'var(--gris-medium)',
            color: 'black'
          })}
          isClosable={true}
          onClose={handleCloseNotice}
          title={"Nouveautés !"}
          description={
            <>
              <br></br>Votre compte s’adapte à vos besoins : en fonction de
              votre profil, vous pourrez découvrir des liens utiles sur votre
              espace connecté (nous ajouterons progressivement des contenus) :
              renseignez dès maintenant vos informations professionnelles ! Et
              pour ceux qui n’ont pas pu assister au wébinaire de juin,
              découvrez maintenant{" "}
              <Link
                href="/ressources/demarrer-diagnostic-vulnerabilite/diagnostic-exhaustivite-concision"
                rel="noopener noreferrer"
              >
                comment réaliser un diagnostic utile plutôt que parfait
              </Link>{" "}
              (retour d’expérience de la Ville de Marseille).
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
