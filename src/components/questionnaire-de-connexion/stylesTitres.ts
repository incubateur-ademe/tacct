import { CSSProperties } from 'react';
import { COULEURS } from './couleurs';

/**
 * `outline: none` neutralise l'anneau de focus global du DSFR : les titres ne
 * sont focusables qu'en `tabIndex={-1}`, donc uniquement par le code au
 * changement de question, jamais au clavier.
 */
export const STYLE_TITRE_QUESTION: CSSProperties = {
  color: COULEURS.texteTitre,
  fontSize: '1.625rem',
  lineHeight: '2.125rem',
  margin: '0 0 1.75rem',
  outline: 'none'
};
