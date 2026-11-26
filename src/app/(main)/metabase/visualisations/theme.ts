import { couleursGraphiques, couleursPrincipales, nuancesGris } from '@/design-system/couleurs';

export const COULEUR_SERIE = couleursPrincipales.vert;

export const PALETTE_CATEGORIES = [
  couleursGraphiques.bleu[1],
  couleursGraphiques.orange[2],
  couleursGraphiques.violet[2],
  couleursGraphiques.vert[2],
  couleursGraphiques.rose[2],
  couleursGraphiques.jaune[2],
  couleursGraphiques.bleu[2],
  couleursGraphiques.rouge[2]
];

export const COULEUR_AUTRES = nuancesGris.mediumDark;

export const THEME_NIVO = {
  text: { fontFamily: 'Marianne, arial, sans-serif', fontSize: 12, fill: '#3A3A3A' },
  axis: {
    domain: { line: { stroke: 'transparent' } },
    ticks: {
      line: { stroke: nuancesGris.medium, strokeWidth: 1 },
      text: { fontFamily: 'Marianne, arial, sans-serif', fontSize: 12, fill: nuancesGris.dark }
    },
    legend: {
      text: { fontFamily: 'Marianne, arial, sans-serif', fontSize: 12, fill: nuancesGris.dark }
    }
  },
  grid: { line: { stroke: nuancesGris.medium, strokeWidth: 1 } },
  crosshair: { line: { stroke: nuancesGris.mediumDark, strokeWidth: 1, strokeOpacity: 0.6 } }
};
