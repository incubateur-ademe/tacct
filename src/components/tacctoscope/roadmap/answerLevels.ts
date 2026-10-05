import { AnswerLevel } from '@/lib/tacctoscope/progress';

/* Un bloc par niveau de réponse, plus le bloc « Je ne sais pas » */
export type BlockKind = AnswerLevel | 'aDeterminer';

export const ANSWER_LEVELS: AnswerLevel[] = [
  'pointsForts',
  'aConsolider',
  'pointsAttention'
];

export const ANSWER_LEVEL_DISPLAY: Record<
  AnswerLevel,
  {
    tag: string;
    counter: string;
    background: string;
    tagColor: string;
    countColor: string;
  }
> = {
  pointsForts: {
    tag: 'Point fort',
    counter: 'Points forts',
    background: '#9DD9A0',
    tagColor: '#293E2A',
    countColor: '#161616'
  },
  aConsolider: {
    tag: 'À consolider',
    counter: 'À consolider',
    background: '#E4FFE6',
    tagColor: '#346C37',
    countColor: '#161616'
  },
  pointsAttention: {
    tag: 'Point d’attention',
    counter: 'Points d’attention',
    background: '#FFE2E3',
    tagColor: '#CE0041',
    countColor: '#CE0041'
  }
};

export const BLOCK_TAGS: Record<
  BlockKind,
  {
    tag: string;
    background: string;
    tagColor: string;
    tagWeight?: 'regular' | 'medium';
  }
> = {
  ...ANSWER_LEVEL_DISPLAY,
  aDeterminer: {
    tag: 'À déterminer',
    background: '#E7E5E5',
    tagColor: '#4D4B4B',
    tagWeight: 'medium'
  }
};
