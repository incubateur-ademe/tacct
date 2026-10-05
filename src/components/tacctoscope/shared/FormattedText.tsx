import { Fragment } from 'react';

/* `**texte**` → gras, `_texte_` → italique. L'italique n'utilise pas `*` car
   les textes contiennent des astérisques littéraux (« (*) »). */
const INLINE_MARKUP = /(\*\*[^*]+\*\*|_[^_]+_)/;

export const FormattedText = ({ text }: { text: string }) => (
  <>
    {text.split(INLINE_MARKUP).map((part, index) => {
      if (part.length > 4 && part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index}>{part.slice(2, -2)}</strong>;
      }
      if (part.length > 2 && part.startsWith('_') && part.endsWith('_')) {
        return <em key={index}>{part.slice(1, -1)}</em>;
      }
      return <Fragment key={index}>{part}</Fragment>;
    })}
  </>
);
