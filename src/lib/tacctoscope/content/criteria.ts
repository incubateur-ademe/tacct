import { Criterion, CriterionSlug, Question, SectionKind } from '../types';

const LOREM_LABEL = 'Lorem ipsum dolor sit amet consectetur';

const LOREM_QUESTION =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ?';

const LOREM_EXAMPLE =
  'Lorem ipsum : source exemple 2023 · source exemple 2017. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.';

const LOREM_CHAPEAU =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod ?';

const SECTION_LAYOUT: SectionKind[] = [
  'analyse',
  'analyse',
  'analyse',
  'enquete',
  'enquete'
];

const buildQuestions = (): Question[] =>
  SECTION_LAYOUT.map((section, index) => ({
    id: `q${index + 1}`,
    label: LOREM_LABEL,
    text: LOREM_QUESTION,
    example: LOREM_EXAMPLE,
    exampleKind: index % 2 === 0 ? 'exemple' : 'contre-exemple',
    section
  }));

const TITLES: Record<CriterionSlug, string> = {
  'donnees-climatiques': 'Données climatiques',
  'donnees-socio-economiques': 'Données socio-économiques',
  'dialogue-et-partage': 'Dialogue et partage',
  'priorisation-des-impacts': 'Priorisation des impacts',
  'problematisation-et-conclusion': 'Problématisation et conclusion'
};

export const CRITERIA: Criterion[] = (
  Object.keys(TITLES) as CriterionSlug[]
).map((slug) => ({
  slug,
  title: TITLES[slug],
  chapeau: LOREM_CHAPEAU,
  questions: buildQuestions()
}));
