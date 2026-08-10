"use client"

import MessageIcone from "@/assets/icons/message-3-icon-green.svg";
import TacctConnexion from "@/assets/images/tacct-image-screenshot.png";
import PasDeCompteImage from "@/assets/svg/home/etape1Image.svg";
import { BoutonPrimaireClassic, BoutonSecondaireClassic } from "@/design-system/base/Boutons";
import { Body, H2 } from "@/design-system/base/Textes";
import { NewContainer } from "@/design-system/layout";
import Breadcrumb from "@codegouvfr/react-dsfr/Breadcrumb";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { MaintenanceNotice } from '../MaintenanceNotice';
import styles from './moncompte.module.scss';

export const MonCompteClient = () => {
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    setError(new URLSearchParams(window.location.search).get('error'));
  }, []);
  return (
    <>
      <MaintenanceNotice />
      <NewContainer size="xl" style={{ padding: 0 }}>
        <Breadcrumb
          currentPageLabel={"Mon compte"}
          homeLinkProps={{ href: '/' }}
          segments={[]}
        />
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
            <H2 style={{ fontSize: "22px" }}>Connectez-vous à votre espace</H2>
            <Body>
              Retrouvez ici l’outil de saisie des données du territoire dans le cadre de votre démarche TACCT.
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
              style={{ maxWidth: 318, width: "100%", height: "auto", marginTop: 40 }}
            />
          </div>
          <div className={styles.bloc} style={{ borderRight: "none" }}>
            <H2 style={{ fontSize: "22px" }}>Vous n’avez pas de compte ?</H2>
            <Body>
              Participez à une session d’accueil en ligne : notre équipe vous présentera le service
              TACCT et les ressources à votre disposition. Vous pourrez créer un compte à l’issue de la session.
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
              style={{ maxWidth: 318, width: "100%", height: "auto" }}
            />
          </div>
        </div>
        <div className={styles.moncompteContact}>
          <div className={styles.moncompteContactHeader}>
            <Image src={MessageIcone} alt="" width={24} height={24} />
            <Body weight="bold" style={{ color: "#038278" }}>
              Vous avez déjà participé à une session d’accueil ?
            </Body>
          </div>
          <Body style={{ margin: "0.5rem 0 0.5rem 2rem", color: "#3D3D3D" }}>
            Utilisez directement notre{" "}
            <Link href="https://tally.so/r/mJGELz" target="_blank" rel="noopener noreferrer">
              formulaire de contact
            </Link> pour demander un accès à l’outil.
          </Body>
        </div>
      </NewContainer>
    </>
  );
}
