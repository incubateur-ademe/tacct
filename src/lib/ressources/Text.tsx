import { RichText } from '@/app/(main)/types';
import { ScrollToSourceArticles } from '@/components/interactions/scrollToSource';
import { normalizeText } from '@/lib/utils/reusableFunctions/NormalizeTexts';
import type { CSSProperties } from 'react';
import styles from './ressources.module.css';

// const SOURCE_SPLIT_PATTERN = /(\[[^\]]*\])/g;
// const SOURCE_TEST_PATTERN = /\[[^\]]*\]/;
// const SOURCE_SPLIT_PATTERN = /(source\s*\[\d+\])/gi;
// const SOURCE_TEST_PATTERN = /source\s*\[\d+\]/i;
const SOURCE_SPLIT_PATTERN = /(voir\s+source\s+\d+)/gi;
const SOURCE_TEST_PATTERN = /voir\s+source\s+\d+/i;

const renderContentWithSources = (content: string, spanClassName: string, spanStyle: CSSProperties) => {
  const parts = content.split(SOURCE_SPLIT_PATTERN);
  if (parts.length === 1) {
    return <span className={spanClassName} style={{ ...spanStyle, whiteSpace: 'pre-line' }}>{content}</span>;
  }
  return (
    <>
      {parts.map((part, i) =>
        SOURCE_TEST_PATTERN.test(part) ? (
          <ScrollToSourceArticles key={i} text={part} />
        ) : (
          <span key={i} className={spanClassName} style={{ ...spanStyle, whiteSpace: 'pre-line' }}>{part}</span>
        )
      )}
    </>
  );
};

interface Props {
  text: RichText[];
}

export const Text = ({ text }: Props) => {
  if (!text) {
    return null;
  }
  return text.map((value, index) => {
    if (!value || !value.annotations) {
      return null;
    }

    const {
      annotations: { bold, code, color, italic, strikethrough, underline },
      text: textObj,
    } = value;

    if (!textObj || typeof textObj.content === 'undefined') {
      // Utiliser plain_text comme fallback si disponible
      const content = value.plain_text || '';
      return content ? (
        <span key={index}>{content}</span>
      ) : null;
    }

    const normalizedContent = normalizeText(textObj.content);
    const spanClassName = [
      bold ? styles.bold : "",
      code ? styles.code : "",
      italic ? styles.italic : "",
      strikethrough ? styles.strikethrough : "",
      underline ? styles.underline : "",
    ].join(" ");
    const spanStyle = { color: color !== "default" ? color : undefined };

    if (textObj.link) {
      return (
        <span key={index} className={spanClassName} style={spanStyle}>
          <a
            href={textObj.link.url}
            target={textObj.link.url.includes("tacct") ? "_self" : "_blank"}
            rel={textObj.link.url.includes("tacct") ? undefined : "noopener noreferrer"}
            className={styles.link}
          >
            {normalizedContent}
          </a>
        </span>
      );
    }

    return (
      <span key={index}>
        {renderContentWithSources(normalizedContent, spanClassName, spanStyle)}
      </span>
    );
  });
};
