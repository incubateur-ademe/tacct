'use client';

import MessageIcone from '@/assets/icons/message-3-icon-green.svg';
import TacctConnexion from '@/assets/images/tacct-image-screenshot.png';
import PasDeCompteImage from '@/assets/svg/home/etape1Image.svg';
import {
  BoutonPrimaireClassic,
  BoutonSecondaireClassic
} from '@/design-system/base/Boutons';
import { Body, H2 } from '@/design-system/base/Textes';
import { NewContainer } from '@/design-system/layout';
import Breadcrumb from '@codegouvfr/react-dsfr/Breadcrumb';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useStyles } from 'tss-react/dsfr';
import styles from './moncompte.module.scss';

// Notice ponctuelle : maintenance du 10 août 2026, 17h-18h.
// Affichée uniquement ce jour-là. À supprimer une fois la date passée.
const NOTICE_KEY = 'notice-maintenance-2026-08-10-fermee';
const NOTICE_START = new Date('2026-08-10T00:00:00');
const NOTICE_END = new Date('2026-08-10T23:59:59');

export const MonCompteClient = () => {
  const { css } = useStyles();
  const [error, setError] = useState<string | null>(null);
  const [noticeClosed, setNoticeClosed] = useState(true);
  const isWithinNoticePeriod =
    Date.now() >= NOTICE_START.getTime() && Date.now() <= NOTICE_END.getTime();

  useEffect(() => {
    setError(new URLSearchParams(window.location.search).get('error'));
    setNoticeClosed(localStorage.getItem(NOTICE_KEY) === 'true');
  }, []);

  const handleCloseNotice = () => {
    localStorage.setItem(NOTICE_KEY, 'true');
    setNoticeClosed(true);
  };

  return (
    <>
      {/* {isWithinNoticePeriod && !noticeClosed && (
        <Notice
          className={css({
            backgroundColor: '#FFD1B4',
            color: '#903700'
          })}
          isClosable={true}
          onClose={handleCloseNotice}
          title={'Interruption de service :'}
          description={
            <>
              suite à une maintenance technique programmée, l’accès à l’espace
              outil de saisie sera impossible ce jour de 17h à 18h. Veuillez
              nous excuser pour la gêne occasionnée.
            </>
          }
        />
      )} */}
      <NewContainer size="xl" style={{ padding: 0 }}>
        <Breadcrumb
          currentPageLabel={'Mon compte'}
          homeLinkProps={{ href: '/' }}
          segments={[]}
        />
        {/* Titre principal de la page, non affiché (le design n'en prévoit
            pas) mais nécessaire à la hiérarchie des titres — RGAA 9.1. */}
        <h1 className="fr-sr-only">Mon compte</h1>
        {error && (
          <div
            role="alert"
            style={{
              background: '#fff0f0',
              border: '1px solid #e1000f',
              color: '#ce0500',
              padding: '12px 16px',
              borderRadius: 4,
              margin: '0 0 2rem'
            }}
          >
            La connexion a échoué ({error}).
          </div>
        )}
        <div className={styles.moncompteWrapper}>
          <div className={styles.bloc}>
            <H2 style={{ fontSize: '22px' }}>Connectez-vous à votre espace</H2>
            <Body>
              Retrouvez ici l’outil de saisie des données du territoire dans le
              cadre de votre démarche TACCT.
            </Body>
            <div style={{ marginTop: 24 }}>
              <BoutonPrimaireClassic
                size="lg"
                text="Se connecter  →"
                link="/api/proconnect/login"
              />
            </div>
            <Image
              src={TacctConnexion}
              alt=""
              style={{
                maxWidth: 318,
                width: '100%',
                height: 'auto',
                marginTop: 40
              }}
            />
          </div>
          <div className={styles.bloc} style={{ borderRight: 'none' }}>
            <H2 style={{ fontSize: '22px' }}>Vous n’avez pas de compte ?</H2>
            <Body>
              Participez à une session d’accueil en ligne : notre équipe vous
              présentera le service TACCT et les ressources à votre disposition.
              Vous pourrez créer un compte à l’issue de la session.
            </Body>
            <BoutonSecondaireClassic
              size="lg"
              link="https://tally.so/r/n0LrEZ"
              text="M'inscrire à une session d'accueil  →"
              rel="noopener noreferrer"
              posthogEventName="bouton_inscription_session_mon_compte"
              style={{
                marginTop: 40
              }}
            />
            <Image
              src={PasDeCompteImage}
              alt=""
              style={{ maxWidth: 318, width: '100%', height: 'auto' }}
            />
          </div>
        </div>
        <div className={styles.moncompteContact}>
          <div className={styles.moncompteContactHeader}>
            <Image src={MessageIcone} alt="" width={24} height={24} />
            <Body weight="bold" style={{ color: '#038278' }}>
              Vous avez déjà participé à une session d’accueil ?
            </Body>
          </div>
          <Body style={{ margin: '0.5rem 0 0.5rem 2rem', color: '#3D3D3D' }}>
            Utilisez directement notre{' '}
            <Link
              href="https://tally.so/r/mJGELz"
              target="_blank"
              rel="noopener noreferrer"
            >
              formulaire de contact
            </Link>{' '}
            pour demander un accès à l’outil.
          </Body>
        </div>
      </NewContainer>
    </>
  );
};
