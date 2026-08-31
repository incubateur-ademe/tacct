'use client';

import styles from '@/app/(espace-connecte)/(avec-navigation)/mon-espace/monEspace.module.scss';
import accompagnementEntreprise from '@/assets/images/be_accompagnement_entreprise.png';
import formation from '@/assets/images/be_formation.png';
import { BoutonPrimaireClassic } from '@/design-system/base/Boutons';
import { Body, H3 } from '@/design-system/base/Textes';
import Image, { StaticImageData } from 'next/image';
import { ReactNode } from 'react';

const LIEN_AGIR_TRANSITION =
  'https://agirpourlatransition.ademe.fr/entreprises/conseils/transverse/strategie/adaptation-climatique';
const LIEN_ACADEMIE =
  'https://academie.ademe.fr/parcours-thematiques/changement-climatique/adaptation-au-changement-climatique/pst96';

const LienExterneIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M10 6v2H5v11h11v-5h2v6a1 1 0 01-1 1H4a1 1 0 01-1-1V7a1 1 0 011-1h6zm11-3v8h-2V6.413l-7.793 7.794-1.414-1.414L17.585 5H13V3h8z"
      fill="currentColor"
    />
  </svg>
);

export const CarteLienUtile = ({
  fond,
  titre,
  texte,
  lien,
  libelleBouton,
  illustration,
  largeurImage,
  margeBas,
  couleurTitre = '#038278'
}: {
  fond: string;
  titre: string;
  texte: ReactNode;
  lien: string;
  libelleBouton: string;
  illustration: StaticImageData;
  largeurImage: string;
  margeBas?: string;
  couleurTitre?: string;
}) => (
  <div className={styles.carteLienUtile} style={{ backgroundColor: fond }}>
    <div className={styles.carteLienUtileTexte}>
      <H3
        color={couleurTitre}
        style={{
          fontSize: '1.25rem',
          lineHeight: '1.75rem',
          letterSpacing: 0,
          margin: 0
        }}
      >
        {titre}
      </H3>
      <Body color="#3d3d3d">{texte}</Body>
      <BoutonPrimaireClassic
        size="md"
        link={lien}
        rel="noopener noreferrer"
        text={libelleBouton}
        iconeFin={<LienExterneIcon />}
        style={{ marginTop: '0.5rem', maxWidth: '100%', whiteSpace: 'normal' }}
      />
    </div>
    <div
      className={styles.carteLienUtileIllustration}
      style={{ width: largeurImage, marginBottom: margeBas }}
    >
      <Image src={illustration} alt="" />
    </div>
  </div>
);

export const BeAccompagnementEntreprises = () => (
  <CarteLienUtile
    fond="#d3edeb"
    titre="Bureau d’études : vous accompagnez des entreprises ?"
    texte={
      <>
        Explorez le site de l’ADEME “<b>Agir pour la transition</b>”, et son
        parcours dédié à l’adaptation au changement climatique pour les
        entreprises : des outils et des méthodes, depuis la prise de conscience
        jusqu’à l’évaluation de leur stratégie d’adaptation.
      </>
    }
    lien={LIEN_AGIR_TRANSITION}
    libelleBouton="Découvrir le parcours “Agir pour la transition”"
    illustration={accompagnementEntreprise}
    largeurImage="320px"
    margeBas="-1rem"
    couleurTitre="#2B4B49"
  />
);

export const BeFormation = () => (
  <CarteLienUtile
    fond="#ecfffd"
    titre="Formez-vous en ligne à l’adaptation au changement climatique (ADEME)"
    texte={
      <>
        L’Académie de l’ADEME propose un parcours de formation thématique en
        e-learning disponible gratuitement, permettant de s’approprier les{' '}
        <b>enjeux spécifiques de l’adaptation</b> et comprendre les{' '}
        <b>spécificités de la méthode TACCT</b>.
      </>
    }
    lien={LIEN_ACADEMIE}
    libelleBouton="Découvrir le parcours “Adaptation au changement climatique”"
    illustration={formation}
    largeurImage="256px"
  />
);
