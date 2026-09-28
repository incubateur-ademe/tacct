import { couleursBoutons, couleursPrincipales, nuancesGris } from '@/design-system/couleurs';

const POLICE = 'Marianne, Arial, Helvetica, sans-serif';
const COULEUR_TEXTE = '#23282B';

export const LOGOS_MAIL = [
  { cid: 'logo-rf', fichier: 'logo-rf.png', alt: 'République Française' },
  { cid: 'logo-ademe-tacct', fichier: 'logo-ademe-tacct.png', alt: 'ADEME – TACCT' }
] as const;

export const titre = (texte: string) =>
  `<h1 style="margin:0 0 24px;font-family:${POLICE};font-size:28px;line-height:36px;font-weight:700;color:${couleursPrincipales.vert};">${texte}</h1>`;

export const sousTitre = (texte: string) =>
  `<h2 style="margin:0 0 16px;font-family:${POLICE};font-size:20px;line-height:28px;font-weight:700;color:${COULEUR_TEXTE};">${texte}</h2>`;

export const paragraphe = (html: string) =>
  `<p style="margin:0 0 16px;font-family:${POLICE};font-size:16px;line-height:24px;color:${COULEUR_TEXTE};">${html}</p>`;

export const mention = (html: string) =>
  `<p style="margin:32px 0 40px;font-family:${POLICE};font-size:12px;line-height:18px;font-style:italic;color:${nuancesGris.dark};">${html}</p>`;

export const lien = (texte: string, href: string) =>
  `<a href="${href}" target="_blank" style="color:${couleursBoutons.primaire[3]};text-decoration:underline;">${texte}</a>`;

// Bouton « bulletproof » : lien dans une cellule de table, seul rendu fiable
// sur l'ensemble des clients mail (Outlook Windows affichera des angles droits).
export const bouton = (
  texte: string,
  href: string,
  variante: 'primaire' | 'secondaire',
  marge = variante === 'primaire' ? '50px auto 32px' : '40px auto 24px'
) => {
  const primaire = variante === 'primaire';
  const fond = primaire ? couleursBoutons.primaire[1] : '#ffffff';
  const bordure = primaire ? couleursBoutons.primaire[1] : couleursBoutons.primaire[2];
  const couleur = primaire ? '#ffffff' : couleursBoutons.primaire[3];
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin:${marge};">
  <tr>
    <td align="center" bgcolor="${fond}" style="border-radius:60px;background-color:${fond};border:1px solid ${bordure};">
      <a href="${href}" target="_blank" style="display:inline-block;padding:12px 28px;font-family:${POLICE};font-size:16px;line-height:24px;font-weight:500;color:${couleur};text-decoration:none;border-radius:60px;">${texte}</a>
    </td>
  </tr>
</table>`;
};

export const separateur = () =>
  `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td height="48" style="height:48px;font-size:0;line-height:0;">&nbsp;</td></tr></table>`;

export const gabaritMail = ({
  titrePage,
  preheader,
  contenu
}: {
  titrePage: string;
  preheader: string;
  contenu: string;
}) => {
  const logos = LOGOS_MAIL.map(
    (logo) => `<td valign="middle" style="padding-right:20px;">
                    <img src="cid:${logo.cid}" height="64" alt="${logo.alt}" style="display:block;height:64px;width:auto;border:0;" />
                  </td>`
  ).join('');

  return `<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="color-scheme" content="light" />
  <title>${titrePage}</title>
</head>
<body style="margin:0;padding:0;background-color:#ffffff;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${preheader}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff" style="background-color:#ffffff;">
    <tr>
      <td align="center" style="padding:0 16px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;">
          <tr>
            <td style="padding:32px 0 24px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  ${logos}
                  <td valign="middle" style="font-family:${POLICE};font-size:14px;line-height:20px;font-weight:700;color:${COULEUR_TEXTE};">
                    Trajectoires d’Adaptation au Changement Climatique des Territoires
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:80px 0 0;">
              ${contenu}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
};
