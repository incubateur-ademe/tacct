'use client';

import styles from '@/app/(espace-connecte)/(avec-navigation)/mon-espace/monEspace.module.scss';
import accompagnementEntreprise from '@/assets/images/be_accompagnement_entreprise.png';
import commentSEngager from '@/assets/images/entreprise_comment_s_engager.png';
import plusFraisAuTravail from '@/assets/images/entreprise_pfat.png';
import { Body, H3 } from '@/design-system/base/Textes';
import Image, { StaticImageData } from 'next/image';
import Link from 'next/link';
import { CarteLienUtile } from './BlocsBureauEtudes';

const LIEN_AGIR_TRANSITION =
  'https://agirpourlatransition.ademe.fr/entreprises/conseils/transverse/strategie/adaptation-climatique';

const RESSOURCES: {
  visuel: StaticImageData;
  titre: string;
  lien: string;
  description: string;
}[] = [
  {
    visuel: commentSEngager,
    titre:
      'En entreprise, comment s’engager dans un parcours d’adaptation au changement climatique ?',
    lien: 'https://librairie.ademe.fr/changement-climatique/6728-en-entreprise-comment-s-engager-dans-un-parcours-d-adaptation-au-changement-climatique--9791029722257.html',
    description:
      '30 témoignages d’entreprises françaises qui se sont lancées'
  },
  {
    visuel: plusFraisAuTravail,
    titre: 'Plus frais au travail',
    lien: 'https://plusfraisautravail.beta.gouv.fr/',
    description:
      'Une plateforme avec des solutions concrètes pour aider les employeurs à protéger les travailleurs et adapter les conditions de travail face aux vagues de chaleur'
  }
];

const LienExterneIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M10 6v2H5v11h11v-5h2v6a1 1 0 01-1 1H4a1 1 0 01-1-1V7a1 1 0 011-1h6zm11-3v8h-2V6.413l-7.793 7.794-1.414-1.414L17.585 5H13V3h8z"
      fill="currentColor"
    />
  </svg>
);

export const EntreprisePlateformeAgir = () => (
  <CarteLienUtile
    fond="#d3edeb"
    titre="Votre plateforme dédiée : Agir pour la transition (ADEME)"
    texte={
      <>
        Un parcours pour les entreprises, avec des <b>outils</b>, <b>méthodes</b>{' '}
        et <b>retours d’expérience</b> tout au long de la démarche, depuis la
        prise de conscience du climat qui change jusqu’à l’évaluation de votre
        stratégie d’adaptation.
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

export const EntrepriseRessourcesAdeme = () => (
  <div className={styles.blocRessourcesAdeme}>
    <H3
      color="#038278"
      style={{
        fontSize: '1.25rem',
        lineHeight: '1.75rem',
        letterSpacing: 0,
        margin: 0
      }}
    >
      Pour aller plus loin : autres ressources de l’ADEME
    </H3>

    <div className={styles.ressourcesAdemeGrille}>
      {RESSOURCES.map((ressource) => (
        <div key={ressource.lien} className={styles.ressourceAdeme}>
          <div className={styles.ressourceAdemeVisuel}>
            <Image src={ressource.visuel} alt="" />
          </div>
          <div className={styles.ressourceAdemeTexte}>
            <Link
              href={ressource.lien}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.ressourceAdemeLien}
            >
              {ressource.titre}
            </Link>
            <Body size="sm" color="#3d3d3d">
              {ressource.description}
            </Body>
          </div>
        </div>
      ))}
    </div>
  </div>
);
