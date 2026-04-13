/**
 * Système de couleurs de l'application TACCT
 *
 * Ce fichier centralise toutes les couleurs utilisées dans l'application.
 * Les couleurs sont organisées par gammes et peuvent être utilisées :
 * - En TypeScript/JavaScript via l'import direct
 * - En SCSS via les custom properties CSS générées
 * - En inline styling
 */

// ============================================
// COULEURS PRINCIPALES
// ============================================

export const couleursPrincipales = {
  vert: '#038278',
  rouge: '#CE0041',
  violet: '#971356'
};

// ============================================
// COULEURS SECONDAIRES
// ============================================

export const couleursSecondaires = {
  5: '#F66E19',
  6: '#BD0926',
  7: '#AFAA3D',
  8: '#838322',
  9: '#F8B334',
  10: '#F08A00'
};

// ============================================
// COULEURS POUR BOUTONS
// ============================================

export const couleursBoutons = {
  primaire: {
    1: '#038278',
    2: '#D3EDEB',
    3: '#095D55',
    4: '#e5e5e5',
    5: '#89CAC6'
  }
};

// ============================================
// NUANCES DE GRIS
// ============================================

export const nuancesGris = {
  light: '#F6F6F6',
  medium: '#E5E5E5',
  mediumDark: '#7B7B7B',
  dark: '#666666'
};

// ============================================
// COULEURS POUR GRAPHIQUES ET DONNÉES
// ============================================

export const couleursGraphiques = {
  bleu: {
    1: '#055FA5',
    2: '#0E93E1',
    3: '#70D4FF',
    4: '#D8EFFA',
    5: '#093454'
  },
  turquoise: {
    1: '#048188',
    2: '#00C2CC',
    3: '#5EEDF3',
    4: '#DAFDFF',
    5: '#014F54'
  },
  rouge: {
    1: '#F80206',
    2: '#FF4C4F',
    3: '#FF9FA0',
    4: '#FFE2E3',
    5: '#680000'
  },
  orange: {
    1: '#B64800',
    2: '#F66E19',
    3: '#FFAF84',
    4: '#FFEEE5',
    5: '#7A330E'
  },
  violet: {
    1: '#6E3F99',
    2: '#A764E3',
    3: '#D2A1FF',
    4: '#F2E4FF',
    5: '#42255C'
  },
  vert: {
    1: '#346C37',
    2: '#5AA65D',
    3: '#9DD9A0',
    4: '#E4FFE6',
    5: '#293E2A'
  },
  kaki: {
    1: '#626218',
    2: '#9A972F',
    3: '#D5D264',
    4: '#F5F3BE',
    5: '#464612'
  },
  jaune: {
    1: '#464612',
    2: '#DF9202',
    3: '#FFC03F',
    4: '#FFEBB6',
    5: '#613701'
  },
  rose: {
    1: '#99357E',
    2: '#D149AD',
    3: '#FFA1E6',
    4: '#FFE5F8',
    5: '#5B1648'
  }
};

// ============================================
// REGROUPEMENT DE TOUTES LES COULEURS
// ============================================

export const couleurs = {
  principales: couleursPrincipales,
  secondaires: couleursSecondaires,
  boutons: couleursBoutons,
  gris: nuancesGris,
  graphiques: couleursGraphiques
};

// ============================================
// EXPORT PAR DÉFAUT
// ============================================

export default couleurs;

// ============================================
// TYPES TYPESCRIPT
// ============================================

export type CouleursPrincipales = typeof couleursPrincipales;
export type CouleursSecondaires = typeof couleursSecondaires;
export type CouleursBoutons = typeof couleursBoutons;
export type CouleursGris = typeof nuancesGris;
export type CouleursGraphiques = typeof couleursGraphiques;
export type Couleurs = typeof couleurs;
