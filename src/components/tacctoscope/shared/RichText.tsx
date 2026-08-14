import { Body } from '@/design-system/base/Textes';
import { RichContent } from '@/lib/tacctoscope/types';
import { CSSProperties } from 'react';
import styles from './shared.module.scss';

interface Props {
  content: RichContent;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
  style?: CSSProperties;
}

export const RichText = ({ content, size = 'md', color, style }: Props) => {
  const blocks = typeof content === 'string' ? [content] : content;

  return (
    <div className={styles.richText}>
      {blocks.map((block, index) =>
        Array.isArray(block) ? (
          <ul key={index} className={styles.richTextList}>
            {block.map((item, itemIndex) => (
              <li key={itemIndex}>
                <Body htmlTag="span" size={size} color={color} style={style}>
                  {item}
                </Body>
              </li>
            ))}
          </ul>
        ) : (
          <Body key={index} size={size} color={color} style={style}>
            {block}
          </Body>
        )
      )}
    </div>
  );
};
