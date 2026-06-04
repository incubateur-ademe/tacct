"use client";

import { StepCard } from '@/app/(main)/(home)/StepCard';
import { StepCardMobile } from '@/app/(main)/(home)/StepCardMobile';
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
import { Body, H2 } from '@/design-system/base/Textes';
import { NewContainer } from '@/design-system/layout';
import useWindowDimensions from '@/hooks/windowDimensions';
import styles from './home.module.scss';

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
                  texte={<Body style={{ color: "#2B4B49", fontSize: '0.875rem' }}>Une <b>communauté</b> de <b>300 chargés de mission</b> de tous types de territoires</Body>}
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
                  texte={<Body style={{ color: "#2B4B49", fontSize: (width && width < 900) ? '0.875rem' : '1rem' }}>Une <b>communauté</b> de <b>300 chargés de mission</b> de tous types de territoires</Body>}
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
        </div>
      </NewContainer>
    </div>
  );
};
