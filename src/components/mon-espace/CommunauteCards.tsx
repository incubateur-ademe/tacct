'use client';

import styles from '@/app/(main)/mon-espace/monEspace.module.scss';
import calendarIcon from '@/assets/icons/calendar_icon_white.svg';
import clockIcon from '@/assets/icons/clock_icon_green.svg';
import mapPinIcon from '@/assets/icons/map_pin_icon_green.svg';
import questionAnswerIcon from '@/assets/icons/question_answer_icon_green.svg';
import teamIcon from '@/assets/icons/team_icon_green.svg';
import videoIcon from '@/assets/icons/video_icon_green.svg';
import sessionAccueil from '@/assets/images/session-accueil.png';
import { BoutonPrimaireClassic } from '@/design-system/base/Boutons';
import { TagsSimples } from '@/design-system/base/Tags';
import { Body, H3 } from '@/design-system/base/Textes';
import Image, { StaticImageData } from 'next/image';

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

export const CommunauteCards = () => (
  <div className={styles.communaute}>
    <div className={`${styles.carteCommunaute} ${styles.carteRejoindre}`}>
      <div className={styles.carteCommunauteEntete}>
        <TagsSimples
          texte="Nouveaux inscrits"
          couleur="#E3FAF9"
          couleurTexte="var(--boutons-primaire-3)"
          taille="small"
        />
        <H3 color="#2b4b49" style={titreStyle}>
          Rejoignez la communauté !
        </H3>
        <Body color="#3d3d3d">
          En participant à une session d’accueil, vous accédez aux avantages du
          service :
        </Body>
      </div>
      <div className={styles.avantages}>
        {AVANTAGES.map((avantage) => (
          <div key={avantage.fort} className={styles.avantage}>
            <span className={styles.avantageIcone} aria-hidden="true">
              <Image src={avantage.icone} alt="" width={28} height={28} />
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
    </div>

    <div className={`${styles.carteCommunaute} ${styles.carteSession}`}>
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
          Participez à une session d’accueil !
        </H3>
        <Body color="#3d3d3d">
          Bienvenue sur TACCT ! Notre équipe vous présentera le service TACCT et
          les ressources associées
        </Body>
        <BoutonPrimaireClassic
          size="md"
          link={LIEN_SESSION}
          rel="noopener noreferrer"
          text="M’inscrire à une session"
          icone={calendarIcon}
        />
      </div>
      <div className={styles.sessionIllustration}>
        <Image src={sessionAccueil} alt="" width={376} height={200} />
      </div>
    </div>
  </div>
);
