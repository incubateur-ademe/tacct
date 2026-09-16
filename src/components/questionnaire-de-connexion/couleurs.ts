/**
 * Jetons de la maquette (kit UI TACCT), résolus depuis les variables sémantiques
 * vers leur valeur primitive. Le nom du jeton d'origine est en commentaire.
 */
export const COULEURS = {
  texteTitre: '#161616', // text-title-default / text-label-default
  texteCorps: '#3d3d3d', // text-body-default
  texteSubtil: '#666666', // text-body-subtle / text-body-disabled
  texteVert: '#038278', // text-title-green
  texteErreur: '#680b28', // text-accent-red
  vert: '#038278', // stroke-utility-active-green / background-button-primary-default
  vertPale: '#ecfffd', // background-surface-green-default
  blanc: '#ffffff', // background-surface-white-default
  rougeErreur: '#d92c2c', // stroke-utility-red-error
  icone: '#161616' // icon-gray
} as const;
