import { Body } from '@/design-system/base/Textes';
import { RichContent } from '@/lib/tacctoscope/types';
import { CSSProperties } from 'react';
import styles from './shared.module.scss';

interface Props {
  content?: RichContent;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
  style?: CSSProperties;
}

export const RichText = ({ content, size = 'md', color, style }: Props) => {
  const blocks = typeof content === 'string' ? [content] : (content ?? []);
  const filledBlocks = blocks.filter((block) =>
    Array.isArray(block)
      ? block.some((item) => item.trim().length > 0)
      : block.trim().length > 0
  );

  if (filledBlocks.length === 0) return null;

  return (
    <div className={styles.richText}>
      {filledBlocks.map((block, index) =>
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
