import { getBaseUrl } from '@/lib/auth/proconnect';
import 'server-only';
import {
  bouton,
  encadre,
  gabaritMail,
  lien,
  mention,
  paragraphe,
  separateur,
  sousTitre,
  titre
} from './gabarit';
import { envoyerMail } from './mailer';

export const SUJET_BIENVENUE = 'Bienvenue sur TACCT !';

export const mailBienvenue = ({ baseUrl }: { baseUrl: string }) =>
  gabaritMail({
    preheader: 'Découvrez votre espace personnel.',
    contenu: `${titre('Votre compte TACCT a été créé&nbsp;!')}
    ${paragraphe('<strong>TACCT</strong> (Trajectoires d’Adaptation au Changement Climatique des Territoires), <strong>c’est le service qui aide les territoires à bâtir des stratégies d’adaptation à la hauteur de leurs enjeux</strong> 💪')}
    ${paragraphe('Découvrez vite votre espace personnel et les ressources mises à votre disposition.')}
    ${bouton('Accéder à mon espace', `${baseUrl}/mon-espace`, 'primaire')}
    ${separateur()}
    ${encadre(`${sousTitre('TACCT, c’est quoi&nbsp;?')}
    ${paragraphe('<strong>Le mode d’emploi pour réussir sa démarche d’adaptation&nbsp;:</strong> TACCT est la méthode de référence du Plan National d’Adaptation au Changement Climatique (PNACC-3) pour guider les territoires pas à pas, du diagnostic de vulnérabilité jusqu’au suivi du plan d’actions.')}
    ${paragraphe('<strong>Des données pour démarrer vite et en autonomie&nbsp;:</strong> la plateforme TACCT propose une sélection de données territoriales pour engager rapidement le dialogue avec les acteurs locaux et identifier ensemble les vulnérabilités du territoire.')}
    ${paragraphe('<strong>Une communauté de pratique, réservée aux chargés de mission&nbsp;:</strong> la communauté Adaptation permet d’échanger entre pairs et de s’appuyer sur des retours d’expérience concrets. Elle est ouverte à tous les territoires, engagés ou non dans une démarche d’adaptation, avec ou sans TACCT.')}`)}
    ${separateur()}
    ${paragraphe(`Une question&nbsp;? N’hésitez pas à ${lien('nous contacter', 'https://tally.so/r/mJGELz')}&nbsp;!`)}
    ${paragraphe(`À bientôt,<br /><strong>L’équipe TACCT</strong><br />${lien('tacct.ademe.fr', 'https://tacct.ademe.fr')}`)}
    ${mention(`Les Conditions Générales d’Utilisation du service sont consultables à l’adresse ${lien(`${baseUrl}/cgu`, `${baseUrl}/cgu`)}. L’utilisation du service vaut acceptation sans réserve des CGU.`)}`
  });

export const envoyerMailBienvenue = (to: string) =>
  envoyerMail({
    to,
    subject: SUJET_BIENVENUE,
    html: mailBienvenue({ baseUrl: getBaseUrl() })
  });
