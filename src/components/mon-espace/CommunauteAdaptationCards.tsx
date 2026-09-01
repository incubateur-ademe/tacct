'use client';

import styles from '@/app/(espace-connecte)/(avec-navigation)/mon-espace/monEspace.module.scss';
import calendarIcon from '@/assets/icons/calendar_icon_white.svg';
import clockIcon from '@/assets/icons/clock_icon_green.svg';
import lienExterneIcon from '@/assets/icons/fr-icon-external-link-line.png';
import mapPinIcon from '@/assets/icons/map_pin_icon_green.svg';
import questionAnswerIcon from '@/assets/icons/question_answer_icon_green.svg';
import sparklingIcon from '@/assets/icons/sparkling_icon_green.svg';
import teamIcon from '@/assets/icons/team_icon_green.svg';
import videoIcon from '@/assets/icons/video_icon_green.svg';
import captureEspaceCommu from '@/assets/images/capture_espace_commu.png';
import creneauIllustration from '@/assets/images/communaute_adaptation_creneau.png';
import sessionAccueilIllustration from '@/assets/images/communaute_adaptation_session_accueil.png';
import {
  BoutonPrimaireClassic,
  BoutonSecondaireClassic
} from '@/design-system/base/Boutons';
import { TagsSimples } from '@/design-system/base/Tags';
import { Body, H3 } from '@/design-system/base/Textes';
import Image, { StaticImageData } from 'next/image';

const LIEN_CRENEAU = 'https://rdv.incubateur.ademe.fr/facili-tacct/echange-suivi';
const LIEN_PORTAIL = 'https://communautes.ademe.fr/signup';
const LIEN_SESSION = 'https://tally.so/r/n0LrEZ';

const AVANTAGES: {
  icone: StaticImageData;
  avant: string;
  fort: string;
  apres: string;
}[] = [
  {
    icone: teamIcon,
    avant: 'Un annuaire de plus de ',
    fort: '400 chargé·es de mission',
    apres: ''
  },
  {
    icone: questionAnswerIcon,
    avant: 'Une plateforme d’',
    fort: 'échange et d’entraide',
    apres: ''
  },
  {
    icone: mapPinIcon,
    avant: '',
    fort: 'Tous types de territoires',
    apres: ' représentés'
  }
];

const titreStyle = {
  fontSize: '1.25rem',
  lineHeight: '1.75rem',
  letterSpacing: 0,
  margin: 0
};

const CartesMembre = () => (
  <div className={styles.communaute}>
    <div className={`${styles.carteCommunaute} ${styles.carteCreneau}`}>
      <div className={styles.carteCommunauteEntete}>
        <div className="flex gap-2">
          <TagsSimples
            texte="Visio"
            couleur="#E3FAF9"
            couleurTexte="var(--boutons-primaire-3)"
            taille="small"
            icone={<Image src={videoIcon} alt="" width={12} height={12} style={{ marginTop: "6px" }} />}
          />
          <TagsSimples
            texte="45min"
            couleur="#E3FAF9"
            couleurTexte="var(--boutons-primaire-3)"
            taille="small"
            icone={<Image src={clockIcon} alt="" width={12} height={12} style={{ marginTop: "6px" }} />}
          />
        </div>
        <H3 color="#038278" style={titreStyle}>
          Demandez un échange de suivi individuel !
        </H3>
        <Body color="#3d3d3d" style={{ marginBottom: "1.5rem" }}>
          Une discussion avec notre équipe pour vous aiguiller dans votre
          démarche.
        </Body>
        <BoutonPrimaireClassic
          size="md"
          link={LIEN_CRENEAU}
          rel="noopener noreferrer"
          text="Choisir un créneau"
          icone={calendarIcon}
        />
      </div>
      <div className={styles.carteCommunauteIllustration}>
        <Image src={creneauIllustration} alt="" />
      </div>
    </div>

    <div className={`${styles.carteCommunaute} ${styles.carteEspaceCommu}`}>
      <div className={styles.carteCommunauteEntete}>
        <TagsSimples
          texte="Nouvelle version"
          couleur="#E3FAF9"
          couleurTexte="var(--boutons-primaire-3)"
          taille="small"
          icone={<Image src={sparklingIcon} alt="" width={12} height={12} />}
        />
        <H3 color="#2b4b49" style={titreStyle}>
          Découvrez l’espace communauté en ligne
        </H3>
        <Body color="#3d3d3d" style={{ marginBottom: "1.5rem" }}>
          Une plateforme d’entraide réunissant plus de 400 chargé·es de mission
        </Body>
        <BoutonSecondaireClassic
          size="md"
          link={LIEN_PORTAIL}
          rel="noopener noreferrer"
          text="Accéder au portail de la communauté"
          iconeFin={<Image src={lienExterneIcon} alt="" width={16} height={16} />}
        />
      </div>
      <div className={styles.carteCommunauteIllustration}>
        <Image src={captureEspaceCommu} alt="" />
      </div>
    </div>
  </div>
);

const CarteSessionAccueil = () => (
  <div className={styles.carteSessionAccueil}>
    <div className={styles.carteSessionAccueilTexte}>
      <div className="flex gap-2">
        <TagsSimples
          texte="Nouveaux inscrits"
          couleur="#E3FAF9"
          couleurTexte="var(--boutons-primaire-3)"
          taille="small"
        />
        <TagsSimples
          texte="1h"
          couleur="#E3FAF9"
          couleurTexte="var(--boutons-primaire-3)"
          taille="small"
          icone={<Image src={clockIcon} alt="" width={12} height={12} style={{ marginTop: "6px" }} />}
        />
      </div>
      <H3 color="#2b4b49" style={{ ...titreStyle, marginBottom: '0.5rem' }}>
        Participez à une session d’accueil !
      </H3>
      <Body color="#3d3d3d">
        Notre équipe vous présentera le service TACCT et vous accéderez à tous
        les avantages de la communauté :
      </Body>
      <div className={styles.avantagesSession}>
        {AVANTAGES.map((avantage) => (
          <div key={avantage.fort} className={styles.avantageSession}>
            <span className={styles.avantageSessionIcone} aria-hidden="true">
              <Image src={avantage.icone} alt="" width={20} height={20} />
            </span>
            <Body color="#3d3d3d">
              {avantage.avant}
              <Body htmlTag="span" weight="bold" color="#3d3d3d">
                {avantage.fort}
              </Body>
              {avantage.apres}
            </Body>
          </div>
        ))}
      </div>
      <BoutonPrimaireClassic
        size="md"
        link={LIEN_SESSION}
        rel="noopener noreferrer"
        text="M’inscrire à une session d’accueil (visio)"
        icone={calendarIcon}
      />
    </div>
    <Image
      src={sessionAccueilIllustration}
      alt=""
      className={styles.carteSessionAccueilIllustration}
    />
  </div>
);

interface Props {
  membreCommunaute: boolean;
}

export const CommunauteAdaptationCards = ({ membreCommunaute }: Props) =>
  membreCommunaute ? <CartesMembre /> : <CarteSessionAccueil />;
