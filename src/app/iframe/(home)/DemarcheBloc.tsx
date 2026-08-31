"use client";

import { StepCard } from '@/app/(main)/(home)/StepCard';
import { StepCardMobile } from '@/app/(main)/(home)/StepCardMobile';
import sparklingIcon from '@/assets/icons/sparkling_icon_green.svg';
import productLaunch from '@/assets/images/product-launch.png';
import Etape1Background from "@/assets/svg/home/etape1background.svg";
import Etape1Contour from "@/assets/svg/home/etape1contour.svg";
import Etape1Foreground from "@/assets/svg/home/etape1foreground.svg";
import Etape1Image from "@/assets/svg/home/etape1Image.svg";
import Etape2Background from "@/assets/svg/home/etape2background.svg";
import Etape2Contour from "@/assets/svg/home/etape2contour.svg";
import Etape2Foreground from "@/assets/svg/home/etape2foreground.svg";
import Etape2Image from "@/assets/svg/home/etape2image.svg";
import Etape3Background from "@/assets/svg/home/etape3background.svg";
import Etape3Contour from "@/assets/svg/home/etape3contour.svg";
import Etape3Foreground from "@/assets/svg/home/etape3foreground.svg";
import Etape3Image from "@/assets/svg/home/etape3image.svg";
import Etape4Background from "@/assets/svg/home/etape4background.svg";
import Etape4Contour from "@/assets/svg/home/etape4contour.svg";
import Etape4Foreground from "@/assets/svg/home/etape4foreground.svg";
import Etape4Image from "@/assets/svg/home/etape4image.svg";
import LeftLine from "@/assets/svg/home/leftLine";
import { MiddleLine } from '@/assets/svg/home/middleLine';
import { RightLine } from '@/assets/svg/home/rightLine';
import { BoutonPrimaireClassic } from '@/design-system/base/Boutons';
import { TagsSimples } from '@/design-system/base/Tags';
import { Body, H2, H3 } from '@/design-system/base/Textes';
import { NewContainer } from '@/design-system/layout';
import useWindowDimensions from '@/hooks/windowDimensions';
import Image from 'next/image';
import styles from './home.module.scss';

const ArrowRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z"
      fill="currentColor"
    />
  </svg>
);

export const DemarcheBloc = () => {
  const { width } = useWindowDimensions();
  return (
    <div style={{ background: "linear-gradient(128deg, #B7ECE9 -1.4%, #D3EDEB 36.73%, #D3EDEB, 67.23%, #ECFFFD 97.73%) " }}>
      <NewContainer size="xl" style={{ padding: (width && width <= 768) ? "2rem 1rem" : "3rem 2rem" }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2rem',
          }}
        >
          <div className={styles.demarcheHeader}>
            <H2 style={{ textAlign: 'center', margin: 0, color: "#2B4B49" }}>
              Commencez votre démarche d'adaptation à votre rythme
            </H2>
            <BoutonPrimaireClassic
              size="lg"
              link="https://tally.so/r/n0LrEZ"
              text="M'inscrire à une session d'accueil"
              rel="noopener noreferrer"
              posthogEventName="bouton_inscription_session_home"
            />
          </div>

          {/* Conteneur du stepper en vague */}
          <div style={{ position: 'relative', width: '100%', height: (width && width <= 768) ? "fit-content" : "700px" }}>
            <div className={styles.demarcheBlocWrapper}>
              {/* Background + Image superposés */}
              {(width && width <= 768) ? (
                <StepCardMobile
                  contour={Etape1Contour}
                  image={Etape1Image}
                  background={Etape1Background}
                  foreground={Etape1Foreground}
                  texte={
                    <Body style={{ color: "#2B4B49", fontSize: '0.875rem' }}>
                      Une visio d'1h pour savoir <b>par où commencer</b>
                    </Body>
                  }
                  numero={1}
                  maxWidth={235}
                  label="Session d'accueil"
                />
              ) : (
                <StepCard
                  contour={Etape1Contour}
                  image={Etape1Image}
                  background={Etape1Background}
                  foreground={Etape1Foreground}
                  texte={
                    <Body style={{ color: "#2B4B49", fontSize: (width && width < 900) ? '0.875rem' : '1rem' }}>
                      Une visio d'1h pour savoir <b>par où commencer</b>
                    </Body>
                  }
                  numero={1}
                  maxWidth={235}
                  justifyContent="flex-start"
                  label="Session d'accueil"
                />
              )}
              {/* Ligne : offsetX négatif pour superposer, offsetY pour décaler verticalement */}
              <div
                style={{
                  transform: 'translate(-40px, 115px)',
                  flexShrink: 0,
                  display: (width && width <= 768) ? "none" : 'flex'

                }}
              >
                <LeftLine />
              </div>
              {(width && width <= 768) ? (
                <StepCardMobile
                  contour={Etape2Contour}
                  image={Etape2Image}
                  background={Etape2Background}
                  foreground={Etape2Foreground}
                  texte={
                    <Body style={{ color: "#2B4B49", fontSize: '0.875rem' }}>
                      Un <b>démarrage à la carte</b>, avec tous les liens utiles
                    </Body>
                  }
                  numero={2}
                  maxWidth={235}
                  label="Embarquement pas&#8209;à&#8209;pas"
                />
              ) : (
                <StepCard
                  contour={Etape2Contour}
                  image={Etape2Image}
                  background={Etape2Background}
                  foreground={Etape2Foreground}
                  texte={
                    <Body style={{ color: "#2B4B49", fontSize: (width && width < 900) ? '0.875rem' : '1rem' }}>
                      Un <b>démarrage à la carte</b>, avec tous les liens utiles
                    </Body>
                  }
                  numero={2}
                  maxWidth={235}
                  justifyContent="center"
                  label="Embarquement pas&#8209;à&#8209;pas"
                  offsetX={-65}
                  style={{ paddingTop: "60px" }}
                />
              )}
              <div
                style={{
                  transform: 'translate(-25px, 240px)',
                  flexShrink: 0,
                  display: (width && width <= 768) ? "none" : 'flex'

                }}
              >
                <MiddleLine />
              </div>
              {(width && width <= 768) ? (
                <StepCardMobile
                  contour={Etape3Contour}
                  image={Etape3Image}
                  background={Etape3Background}
                  foreground={Etape3Foreground}
                  texte={<Body style={{ color: "#2B4B49", fontSize: '0.875rem' }}>Chaque mois, <b>un retour d'expérience et une discussion</b> autour d'un sujet opérationnel</Body>}
                  numero={3}
                  maxWidth={235}
                  label="Webinaires thématiques"
                />
              ) : (
                <StepCard
                  contour={Etape3Contour}
                  image={Etape3Image}
                  background={Etape3Background}
                  foreground={Etape3Foreground}
                  texte={<Body style={{ color: "#2B4B49", fontSize: (width && width < 900) ? '0.875rem' : '1rem' }}>Chaque mois, <b>un retour d'expérience et une discussion</b> autour d'un sujet opérationnel</Body>}
                  numero={3}
                  maxWidth={235}
                  justifyContent="center"
                  label="Webinaires thématiques"
                  offsetX={-55}
                  offsetY={-60}
                />
              )}
              <div
                style={{
                  transform: 'translate(-35px, 280px)',
                  flexShrink: 0,
                  display: (width && width <= 768) ? "none" : 'flex'
                }}
              >
                <RightLine />
              </div>
              {(width && width <= 768) ? (
                <StepCardMobile
                  contour={Etape4Contour}
                  image={Etape4Image}
                  background={Etape4Background}
                  foreground={Etape4Foreground}
                  texte={<Body style={{ color: "#2B4B49", fontSize: '0.875rem' }}>Une <b>communauté</b> de <b>400 chargés de mission</b> de tous types de territoires</Body>}
                  numero={4}
                  maxWidth={235}
                  label="Échanges entre pairs"
                />
              ) : (
                <StepCard
                  contour={Etape4Contour}
                  image={Etape4Image}
                  background={Etape4Background}
                  foreground={Etape4Foreground}
                  texte={<Body style={{ color: "#2B4B49", fontSize: (width && width < 900) ? '0.875rem' : '1rem' }}>Une <b>communauté</b> de <b>400 chargés de mission</b> de tous types de territoires</Body>}
                  numero={4}
                  maxWidth={235}
                  justifyContent="flex-end"
                  label="Échanges entre pairs"
                  offsetX={-55}
                  offsetY={-40}
                />
              )}
            </div>
          </div>

          <div className={styles.diagnosticCard}>
            <div className={styles.diagnosticCardContent}>
              <div className={styles.diagnosticCardText}>
                <TagsSimples
                  texte="NOUVEAU"
                  couleur="#E3FAF9"
                  couleurTexte="var(--boutons-primaire-3)"
                  taille="small"
                  icone={<Image src={sparklingIcon} alt="" width={12} height={12} />}
                />
                <H3
                  color="#038278"
                  style={{
                    fontSize: '1.25rem',
                    lineHeight: '1.75rem',
                    letterSpacing: 0,
                    margin: 0
                  }}
                >
                  Vous révisez un diagnostic de vulnérabilité ?
                  <br />
                  Ne repartez pas de zéro !
                </H3>
                <Body size="sm" color="#3d3d3d" style={{ letterSpacing: 0 }}>
                  Le TACCToscope, notre outil interactif, vous guide pour un
                  retravail ciblé et méthodique.
                </Body>
                <BoutonPrimaireClassic
                  size="md"
                  link="/tacctoscope"
                  text="Commencer l'analyse de votre diagnostic"
                  iconeFin={<ArrowRightIcon />}
                  style={{ marginTop: '0.75rem' }}
                />
              </div>
              <div className={styles.diagnosticCardIllustration}>
                <Image src={productLaunch} alt="" />
              </div>
            </div>
          </div>
        </div>
      </NewContainer>
    </div>
  );
};
