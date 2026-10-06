import styles from '@/app/(espace-connecte)/(avec-navigation)/tacctoscope/feuille-de-route/roadmap.module.scss';
import { Body } from '@/design-system/base/Textes';
import { QuestionRecommendation } from '@/lib/tacctoscope/content/roadmapResources';
import { getAnswerLevel } from '@/lib/tacctoscope/progress';
import { CriterionSlug } from '@/lib/tacctoscope/types';
import { FormattedText } from '../shared/FormattedText';
import { RessourcesAccordion } from './RessourcesAccordion';
import {
  BlockTitle,
  LevelAccent,
  LevelTag,
  QuestionQuote,
  SectionQuestionRef
} from './RoadmapBlockParts';

type DescriptionBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'list'; items: string[] };

/* Les lignes commençant par « • » sont regroupées en liste pour obtenir un
   retrait pendant sur les puces qui débordent sur plusieurs lignes. */
const parseDescription = (description: string): DescriptionBlock[] =>
  description
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .reduce<DescriptionBlock[]>((blocks, line) => {
      if (!line.startsWith('•')) {
        return [...blocks, { type: 'paragraph', text: line }];
      }
      const item = line.slice(1).trim();
      const last = blocks[blocks.length - 1];
      return last?.type === 'list'
        ? [
            ...blocks.slice(0, -1),
            { type: 'list', items: [...last.items, item] }
          ]
        : [...blocks, { type: 'list', items: [item] }];
    }, []);

const DESCRIPTION_STYLE = { lineHeight: '1.5rem' };

interface Props {
  slug: CriterionSlug;
  question: SectionQuestionRef;
  recommendation: QuestionRecommendation;
  defaultOpen?: boolean;
}

export const RecommendationBlock = ({
  slug,
  question,
  recommendation,
  defaultOpen = false
}: Props) => {
  const level = getAnswerLevel(question.answer);

  return (
    <article className={styles.recoCard}>
      {level && <LevelAccent level={level} />}
      <div className={styles.recoBody}>
        {level && <LevelTag level={level} />}
        <BlockTitle>{recommendation.title}</BlockTitle>
        <QuestionQuote slug={slug} question={question} />
        <div className={styles.recoDescription}>
          {parseDescription(recommendation.description).map((block, index) =>
            block.type === 'list' ? (
              <ul key={index} className={styles.recoList}>
                {block.items.map((item) => (
                  <li key={item}>
                    <Body
                      htmlTag="span"
                      size="md"
                      color="#3d3d3d"
                      style={DESCRIPTION_STYLE}
                    >
                      <FormattedText text={item} />
                    </Body>
                  </li>
                ))}
              </ul>
            ) : (
              <Body key={index} size="md" color="#3d3d3d" style={DESCRIPTION_STYLE}>
                <FormattedText text={block.text} />
              </Body>
            )
          )}
        </div>
      </div>
      <RessourcesAccordion
        ressources={recommendation.ressources}
        defaultOpen={defaultOpen}
      />
    </article>
  );
};
