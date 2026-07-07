import { buildQuestionKey } from '../keys';
import { CRITERIA } from './criteria';

export type RoadmapResourceTag = 'donnees' | 'retour-experience';

export interface RoadmapResource {
  tag: RoadmapResourceTag;
  title: string;
  url: string;
}

export interface QuestionRecommendation {
  title: string;
  description: string;
  ressources: RoadmapResource[];
  pourApprofondir: RoadmapResource[];
}

const LOREM_RECO_TITLE = 'Citer les sources climatiques';

const LOREM_RECO_DESCRIPTION =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';

const LOREM_RESSOURCES: RoadmapResource[] = [
  {
    tag: 'donnees',
    title: 'Climadiag Commune - Météo France',
    url: 'https://www.georisques.gouv.fr/'
  },
  {
    tag: 'donnees',
    title: 'Bulletins Spéciaux - Association Infoclimat',
    url: 'https://www.infoclimat.fr/'
  }
];

const LOREM_POUR_APPROFONDIR: RoadmapResource[] = [
  {
    tag: 'donnees',
    title: 'DRIAS-Climat - Météo France',
    url: 'https://www.drias-climat.fr/'
  }
];

export const ROADMAP_RECOMMENDATIONS: Record<string, QuestionRecommendation> =
  Object.fromEntries(
    CRITERIA.flatMap((criterion) =>
      criterion.questions.map((question) => [
        buildQuestionKey(criterion.slug, question.id),
        {
          title: LOREM_RECO_TITLE,
          description: LOREM_RECO_DESCRIPTION,
          ressources: LOREM_RESSOURCES,
          pourApprofondir: LOREM_POUR_APPROFONDIR
        }
      ])
    )
  );

export const getRecommendation = (
  questionKey: string
): QuestionRecommendation | null =>
  ROADMAP_RECOMMENDATIONS[questionKey] ?? null;
