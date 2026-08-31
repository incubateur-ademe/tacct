'use client';

import styles from '@/app/(espace-connecte)/(avec-navigation)/mon-espace/monEspace.module.scss';
import eluPourAgir from '@/assets/images/elu_pour_agir.png';
import { BoutonPrimaireClassic } from '@/design-system/base/Boutons';
import { Body, H3 } from '@/design-system/base/Textes';
import Image from 'next/image';

const LIEN_ELUS_POUR_AGIR =
  'https://agirpourlatransition.ademe.fr/collectivites/conseils/elus/elus-pour-agir';

const LienExterneIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M10 6v2H5v11h11v-5h2v6a1 1 0 01-1 1H4a1 1 0 01-1-1V7a1 1 0 011-1h6zm11-3v8h-2V6.413l-7.793 7.794-1.414-1.414L17.585 5H13V3h8z"
      fill="currentColor"
    />
  </svg>
);

const AVANTAGES: { fort: string; suite: string }[] = [
  {
    fort: 'Décryptage',
    suite: ' des enjeux de la transition écologique et énergétique'
  },
  { fort: 'Actions concrètes', suite: ' pour votre collectivité' },
  { fort: 'Événements', suite: ' de qualité' },
  {
    fort: 'Bonnes pratiques',
    suite: ' et retours d’expérience de vos homologues élu·es'
  }
];

export const EluPourAgir = () => (
  <div className={styles.eluPourAgir}>
    <div className={styles.eluPourAgirTexte}>
      <H3
        color="#038278"
        style={{
          fontSize: '1.25rem',
          lineHeight: '1.75rem',
          letterSpacing: 0,
          margin: 0
        }}
      >
        Votre réseau dédié : Élus pour agir (ADEME)
      </H3>

      <Body color="#3d3d3d">
        Ce programme est spécialement{' '}
        <b>conçu pour les élus engagés dans la transition écologique</b>, pour
        un accompagnement à la hauteur de vos responsabilités et de votre rôle
        stratégique :
      </Body>

      <ul className={styles.eluPourAgirListe}>
        {AVANTAGES.map((avantage) => (
          <li key={avantage.fort}>
            <Body htmlTag="span" color="#3d3d3d">
              <b>{avantage.fort}</b>
              {avantage.suite}
            </Body>
          </li>
        ))}
      </ul>

      <BoutonPrimaireClassic
        size="md"
        link={LIEN_ELUS_POUR_AGIR}
        rel="noopener noreferrer"
        text="Rejoindre Élus pour agir"
        iconeFin={<LienExterneIcon />}
      />
    </div>

    <Image src={eluPourAgir} alt="" className={styles.eluPourAgirIllustration} />
  </div>
);
