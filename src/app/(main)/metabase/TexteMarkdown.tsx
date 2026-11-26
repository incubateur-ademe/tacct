import { Fragment, type ReactNode } from 'react';
import styles from './metabase.module.scss';

const URL = /(https?:\/\/[^\s)]+)/g;

const avecLiens = (texte: string): ReactNode[] =>
  texte.split(URL).map((morceau, index) =>
    index % 2 === 1 ? (
      <a key={index} href={morceau} target="_blank" rel="noopener noreferrer" className={styles.lienTexte}>
        {morceau}
      </a>
    ) : (
      <Fragment key={index}>{morceau}</Fragment>
    )
  );

export const TexteMarkdown = ({ texte, className }: { texte: string; className?: string }) => {
  const elements: ReactNode[] = [];
  let paragraphe: string[] = [];
  let liste: string[] = [];

  const viderParagraphe = () => {
    if (paragraphe.length) elements.push(<p key={elements.length}>{avecLiens(paragraphe.join(' '))}</p>);
    paragraphe = [];
  };
  const viderListe = () => {
    if (liste.length) {
      elements.push(
        <ul key={elements.length}>
          {liste.map((element, index) => (
            <li key={index}>{avecLiens(element)}</li>
          ))}
        </ul>
      );
    }
    liste = [];
  };

  for (const ligne of texte.split('\n')) {
    const propre = ligne.trim();
    if (propre.startsWith('- ')) {
      viderParagraphe();
      liste.push(propre.slice(2));
    } else if (propre === '') {
      viderParagraphe();
      viderListe();
    } else {
      viderListe();
      paragraphe.push(propre);
    }
  }
  viderParagraphe();
  viderListe();

  return <div className={`${styles.markdown} ${className ?? ''}`}>{elements}</div>;
};
