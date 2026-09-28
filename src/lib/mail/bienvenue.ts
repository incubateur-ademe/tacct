import 'server-only';
import { getBaseUrl } from '@/lib/auth/proconnect';
import { Profil } from '@/lib/questionnaire-de-connexion/types';
import { envoyerMail } from './mailer';
import {
  bouton,
  gabaritMail,
  lien,
  mention,
  paragraphe,
  separateur,
  sousTitre,
  titre
} from './gabarit';

export const SUJET_BIENVENUE = 'Votre compte TACCT a été créé !';

const PROFILS_TERRITOIRE: readonly Profil[] = ['cdm', 'elu', 'responsable'];

const blocProfil = (profil: Profil | null) =>
  profil && PROFILS_TERRITOIRE.includes(profil)
    ? `${separateur()}
    ${sousTitre('Vous n’êtes pas encore membre de la communauté&nbsp;?')}
    ${paragraphe('Inscrivez-vous dès maintenant à une session d’accueil et rejoignez une communauté de plus de 400&nbsp;membres&nbsp;!')}
    ${bouton('Je m’inscris à une session d’accueil', 'https://tally.so/r/n0LrEZ', 'secondaire')}`
    : bouton('Je découvre TACCT', 'https://tacct.ademe.fr/', 'secondaire', '48px auto 12px');

export const mailBienvenue = ({
  profil,
  baseUrl
}: {
  profil: Profil | null;
  baseUrl: string;
}) =>
  gabaritMail({
    titrePage: SUJET_BIENVENUE,
    preheader:
      'Découvrez votre espace personnel et les ressources mises à votre disposition.',
    contenu: `${titre('Votre compte TACCT a été créé&nbsp;!')}
    ${paragraphe('<strong>TACCT</strong> (Trajectoires d’Adaptation au Changement Climatique des Territoires), <strong>c’est le service qui aide les territoires à bâtir des stratégies d’adaptation à la hauteur de leurs enjeux</strong> 💪')}
    ${paragraphe('Découvrez vite votre espace personnel et les ressources mises à votre disposition.')}
    ${bouton('Accéder à mon espace', `${baseUrl}/mon-espace`, 'primaire')}
    ${separateur()}
    ${sousTitre('TACCT, c’est quoi&nbsp;?')}
    ${paragraphe('<strong>Le mode d’emploi pour réussir sa démarche d’adaptation&nbsp;:</strong> TACCT est la méthode de référence du Plan National d’Adaptation au Changement Climatique (PNACC-3) pour guider les territoires pas à pas, du diagnostic de vulnérabilité jusqu’au suivi du plan d’actions.')}
    ${paragraphe('<strong>Des données pour démarrer vite et en autonomie&nbsp;:</strong> la plateforme TACCT propose une sélection de données territoriales pour engager rapidement le dialogue avec les acteurs locaux et identifier ensemble les vulnérabilités du territoire.')}
    ${paragraphe('<strong>Une communauté de pratique, réservée aux chargés de mission&nbsp;:</strong> la communauté Adaptation permet d’échanger entre pairs et de s’appuyer sur des retours d’expérience concrets. Elle est ouverte à tous les territoires, engagés ou non dans une démarche d’adaptation, avec ou sans TACCT.')}
    ${blocProfil(profil)}
    ${separateur()}
    ${paragraphe(`Une question&nbsp;? N’hésitez pas à ${lien('nous contacter', 'https://tally.so/r/mJGELz')}&nbsp;!`)}
    ${paragraphe('À bientôt,<br /><strong>L’équipe TACCT</strong>')}
    ${mention(`Les Conditions Générales d’Utilisation du service sont consultables à l’adresse ${lien(`${baseUrl}/cgu`, `${baseUrl}/cgu`)}. L’utilisation du service vaut acceptation sans réserve des CGU.`)}`
  });

export const envoyerMailBienvenue = (to: string, profil: Profil | null) =>
  envoyerMail({
    to,
    subject: SUJET_BIENVENUE,
    html: mailBienvenue({ profil, baseUrl: getBaseUrl() })
  });
