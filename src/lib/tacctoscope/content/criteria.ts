import { Criterion, CRITERION_SLUGS, CriterionSlug, Question } from '../types';

/**
 * Contenu réel des critères et de leurs questions.
 * Seuls les `chapeau` des critères 2 à 5 restent à rédiger.
 */

interface CriterionContent {
  title: string;
  chapeau: string;
  questions: Question[];
}

const CRITERIA_CONTENT: Record<CriterionSlug, CriterionContent> = {
  'donnees-climatiques': {
    title: 'Données climatiques',
    chapeau:
      "Le diagnostic s'appuie-t-il sur des données climatiques pertinentes et territorialisées ?",
    questions: [
      {
        id: 'q1',
        section: 'analyse',
        exampleKind: 'exemple',
        label:
          'Le diagnostic comprend des observations sur le climat passé du territoire',
        text: "Il s'agit de données climatiques mesurées, ou de phénomènes observés, sur votre territoire (températures, précipitations, événements extrêmes, etc.).",
        example:
          'Lors des épisodes caniculaires de 2003 et 2023, 10 des 14 stations météorologiques du territoire ont enregistré les journées les plus chaudes depuis 1947.',
        minHint: 'Pas de données sur les évolutions climatiques passées.',
        maxHint:
          'Le diagnostic mobilise les mesures et données climatiques passées.'
      },
      {
        id: 'q2',
        section: 'analyse',
        exampleKind: 'contre-exemple',
        label:
          'Les projections climatiques retenues sont issues ou compatibles avec la TRACC',
        text: [
          "Le niveau de réchauffement de 4° C (pour la métropole*) et l’horizon temporel de fin de siècle sont les deux caractéristiques de la trajectoire de réchauffement de référence pour l'adaptation au changement climatique (TRACC), adoptée par la France pour fixer une cible commune d'adaptation.",
          '_(*) Territoires ultramarins et métropole ont chacun leurs propres projections climatiques, avec des niveaux de réchauffement inférieurs à 4° C dans les outre-mer._'
        ],
        example:
          "Un certain nombre de diagnostics sont basés sur des scénarios climatiques fondés sur des hypothèses de réchauffement inférieures au +4° C retenus dans la TRACC pour la métropole. L’horizon temporel se limite souvent à 2050, ne permettant pas d'anticiper les évolutions attendues au-delà de cette échéance, désormais de court terme.",
        minHint:
          'Les projections climatiques utilisées ne sont pas basées sur la TRACC.',
        maxHint:
          'Les projections climatiques utilisées sont basées sur la TRACC.'
      },
      {
        id: 'q3',
        section: 'analyse',
        exampleKind: 'contre-exemple',
        label:
          'Le diagnostic décrit le climat du territoire (pas celui de la France ou du monde)',
        text: "Les projections à l'échelle mondiale, voire nationale, apportent un cadre de référence mais elles restent peu mobilisatrices pour les acteurs locaux, qui peinent à s'y reconnaître. Le diagnostic de vulnérabilité doit se concentrer sur les spécificités de _votre_ territoire.",
        example: [
          '“Les continents et les latitudes élevées se réchauffent beaucoup plus vite. Ainsi, la température en Arctique pourrait augmenter jusqu’à +11° C en 2100.”',
          'Cette affirmation est vraie. Pour autant, quelle compréhension de votre territoire apporte-t-elle ?'
        ],
        minHint: 'Les données climatiques mondiales sont très détaillées.',
        maxHint:
          'Les évolutions climatiques mondiales sont brièvement rappelées.'
      },
      {
        id: 'q4',
        section: 'analyse',
        exampleKind: 'both',
        label:
          'Les paramètres de projections climatiques retenus dans le diagnostic ont une utilité pour expliquer certains impacts',
        example: [
          'Les conséquences des vagues de chaleur pour le territoire :',
          [
            'surcharge des services médicaux',
            'hausse de la consommation d’énergie due à la climatisation',
            'assèchement des nappes phréatiques'
          ]
        ],
        counterExample:
          "Pour un territoire au climat très doux, est-il nécessaire de mentionner la baisse du nombre de jours de gel par an, si ce phénomène n'entraîne pas de conséquences notables (sur les infrastructures, sur des activités maraîchères…) ?",
        minHint:
          'Les indicateurs climatiques retenus ne se traduisent pas par des effets observables.',
        maxHint:
          'Les indicateurs climatiques retenus se traduisent par des effets observables sur le territoire.'
      },
      {
        id: 'q5',
        section: 'enquete',
        exampleKind: 'exemple',
        label: 'Un travail de hiérarchisation des aléas climatiques a été mené',
        text: "Cet exercice consiste à classer, du plus au moins préoccupant, les aléas et les phénomènes climatiques auxquels le territoire est exposé. Ce travail a pu être mené à l'oral, en atelier par exemple, sans être mentionné dans le diagnostic. Les réponses seront alors à chercher dans les archives ou auprès des participants.",
        exampleAttachments: [
          {
            label:
              'Extrait du diagnostic de vulnérabilité Rennes métropole - Janvier 2025',
            src: '/preuve-critere1-q5.webp'
          }
        ],
        minHint: 'Il n’y a aucune évaluation de l’exposition.',
        maxHint: 'L’exposition passée et future a été évaluée.'
      }
    ]
  },
  'donnees-socio-economiques': {
    title: 'Données socio-économiques',
    chapeau:
      'Les sensibilités territoriales sont-elles documentées avec des indicateurs pertinents et territorialisés ?',
    questions: [
      {
        id: 'q1',
        section: 'analyse',
        exampleKind: 'exemple',
        label:
          'La majeure partie du diagnostic est dédiée à l’analyse des impacts',
        text: "L'analyse de la sensibilité vise à recenser les principales conséquences — ou impacts — observées ou attendues de l'évolution du climat sur votre territoire. La table des matières de votre diagnostic permet de vérifier rapidement la place qui leur est accordée.",
        exampleAttachments: [
          {
            label:
              'Table des matières du diagnostic de vulnérabilité de la CC Cœur du Pays Haut - 2024',
            src: '/preuve-critere2-q1.webp'
          }
        ],
        minHint:
          'La majeure partie du diagnostic est dédiée à l’analyse de l’exposition.',
        maxHint:
          'La majeure partie du diagnostic est dédiée à l’analyse des impacts.'
      },
      {
        id: 'q2',
        section: 'analyse',
        exampleKind: 'exemple',
        label:
          'Le diagnostic de vulnérabilité recense des facteurs de sensibilité du territoire',
        text: 'Les facteurs de sensibilité, ce sont les caractéristiques qui rendent un territoire plus fragile face à un aléa (par exemple, la densité urbaine ou la présence de populations fragiles). Autrement dit, des caractéristiques socio-économiques ou environnementales qui amplifient les impacts d’un aléa climatique.',
        example:
          'Le pourcentage de personnes de plus de 75 ans est un facteur de sensibilité du territoire qui aggrave le risque de surmortalité (l’impact) due aux fortes chaleurs.',
        minHint: 'Le diagnostic ne recense pas de facteurs de sensibilité.',
        maxHint: 'Le diagnostic recense des facteurs de sensibilité.'
      },
      {
        id: 'q3',
        section: 'analyse',
        exampleKind: 'both',
        label: 'Les impacts identifiés sont spécifiques au territoire analysé',
        text: 'Les impacts sont les conséquences observées ou attendues du changement climatique sur les populations, l’économie locale, les ressources naturelles, etc.',
        example:
          "Le diagnostic de vulnérabilité de la Vallée de Villé (2024) comprend une coupure de presse. Cet article ancré dans un cas réel rend le changement climatique concret et incarné. Même limité à un cas particulier, il illustre des décisions d'adaptation prises face à des contraintes réelles — ce qui aide bien mieux à se projeter qu'une liste d’impacts génériques du changement climatique sur l’arboriculture.",
        exampleAttachments: [
          {
            label: 'Voir la coupure de presse',
            src: '/preuve-critere2-q3.webp'
          }
        ],
        counterExample:
          "Ces résultats du projet LACCAVE (INRA), rigoureux scientifiquement, sont souvent cités dans les diagnostics, y compris de territoires viticoles non concernés par les vignobles cités. Ces résultats décrivent un phénomène général (seuils de température et de stress hydrique) là où un entretien avec un expert local aurait sans doute été plus éclairant, en reliant ces phénomènes physiques à des impacts sur les pratiques viticoles du territoire — date de vendange, gestion de l'irrigation, palissage...",
        counterExampleAttachments: [
          {
            label: 'Voir les résultats du projet LACCAVE',
            src: '/preuve-critere2-q3bis.webp'
          }
        ],
        minHint: 'Les impacts identifiés sont génériques.',
        maxHint: 'Les impacts identifiés sont spécifiques au territoire.'
      },
      {
        id: 'q4',
        section: 'analyse',
        label: 'Les sources des données utilisées et faits relatés sont citées',
        text: 'Il s’agit de citer les bases de données consultées avec date de consultation, les producteurs des données, les références des rapports cités et des articles de presse utilisés, etc.',
        minHint: 'Beaucoup de sources manquent.',
        maxHint: 'Aucune source ne manque.'
      },
      {
        id: 'q5',
        section: 'enquete',
        label: 'Un travail de hiérarchisation des impacts a été mené',
        text: "Cet exercice est destiné à hiérarchiser les impacts au sein d’une même thématique, puis les thématiques entre elles. Il a pu être mené à l'oral, sans qu’il en reste de trace écrite.",
        minHint: 'Aucune évaluation de la gravité des impacts n’a été menée.',
        maxHint: 'La gravité des impacts a été évaluée.'
      }
    ]
  },
  'dialogue-et-partage': {
    title: 'Dialogue et partage',
    chapeau:
      'Le diagnostic a-t-il été construit collectivement avec les parties prenantes du territoire ?',
    questions: [
      {
        id: 'q1',
        section: 'analyse',
        exampleKind: 'exemple',
        label:
          "L'approche méthodologique utilisée est mentionnée dans le document",
        text: 'Par approche méthodologique, on entend l’ensemble des choix qui structurent le diagnostic : définition des concepts utilisés, partis pris méthodologique, logique d’ensemble, mais aussi types de sources et de données mobilisées, méthode de recueil, critères de priorisation...',
        exampleAttachments: [
          {
            label:
              'Approche méthodologique de Saint Brieuc Armor Agglomération (2025)',
            src: '/preuve-critere3-q1.webp'
          },
          {
            label:
              'Extrait du diagnostic territorial de la CC Aygues-Ouvèze en Provence, p.94 (2025)',
            src: '/preuve-critere3-q1bis.webp'
          }
        ],
        minHint: 'Aucune mention de l’approche méthodologique n’est présente.',
        maxHint: 'L’approche méthodologique utilisée est décrite.'
      },
      {
        id: 'q2',
        section: 'analyse',
        exampleKind: 'exemple',
        label: 'La description des impacts est accompagnée de verbatims',
        text: 'Un verbatim est la reproduction intégrale de propos prononcés ou écrits.',
        exampleAttachments: [
          {
            label:
              'Étude de vulnérabilité du Pays de la Déodatie, “_Les forêts face au changement climatique_”, Climate Adaptation Consulting, 2020',
            src: '/preuve-critere3-q2.webp'
          }
        ],
        minHint: 'Aucun verbatim ne figure dans le diagnostic.',
        maxHint: 'Des verbatims sont retranscrits.'
      },
      {
        id: 'q3',
        section: 'analyse',
        exampleKind: 'exemple',
        label:
          'Le diagnostic fait référence à des actions déjà menées sur le territoire',
        text: 'Il peut s’agir d’actions d’adaptation, de plans ou de dispositifs existants sur lesquels s’appuyer pour agir, menés par la collectivité ou par d’autres acteurs du territoire.',
        example:
          'Face à l’impact « mise en tension des capacités des systèmes de santé » lors des fortes chaleurs, la ville de Marseille recense des dispositifs prêts à l’action pour en réduire les effets.',
        exampleAttachments: [
          {
            label:
              'Atelier Santé lors de la démarche d’adaptation de la ville de Marseille. (2026)',
            src: '/preuve-critere3-q3.webp'
          }
        ],
        minHint: 'Il n’est pas fait mention d’actions déjà menées.',
        maxHint:
          'Le diagnostic fait référence à des actions déjà menées sur le territoire.'
      },
      {
        id: 'q4',
        section: 'enquete',
        exampleKind: 'exemple',
        label:
          'La construction du diagnostic s’est appuyée sur des temps d’échange avec les acteurs du territoire',
        text: "L’analyse des données doit être confrontée au ressenti des acteurs du territoire. Cette dimension d'échange n'est pas un simple complément méthodologique mais une nécessité.",
        exampleAttachments: [
          {
            label:
              'La Ville de Marseille organise un atelier sur la thématique “Santé” avec les acteurs du secteur.',
            src: '/preuve-critere3-q4.webp'
          },
          {
            label:
              'Extrait du Diagnostic de vulnérabilité de la CC du Pays de Sainte Odile p.86',
            src: '/preuve-critere3-q4bis.webp'
          }
        ],
        minHint:
          'Le diagnostic a été mené sans apport des acteurs du territoire.',
        maxHint:
          'Le diagnostic est co-construit avec les acteurs du territoire.'
      },
      {
        id: 'q5',
        section: 'enquete',
        exampleKind: 'exemple',
        label: 'Une trace des travaux menés reste consultable',
        text: 'Il peut s’agir de relevés de décision, de comptes-rendus d’ateliers ou d’entretiens, de tableurs de données, de supports de réunions, de rapports ayant servis de source, etc.',
        example:
          'Annexe “_CCBDP. (2023, mars)._” extraite de la bibliographie du diagnostic de vulnérabilité de la Communauté de Communes des Baronnies en Drôme Provençale',
        exampleAttachments: [
          {
            label: 'Compte rendu de l’atelier sur la sensibilité du territoire',
            src: '/preuve-critere3-q5.webp'
          }
        ],
        minHint: 'Aucun document n’est consultable.',
        maxHint: 'Une trace des travaux est consultable.'
      }
    ]
  },
  'priorisation-des-impacts': {
    title: 'Priorisation des impacts',
    chapeau:
      'Les impacts sont-ils hiérarchisés de manière explicite et justifiée ?',
    questions: [
      {
        id: 'q1',
        section: 'analyse',
        exampleKind: 'exemple',
        label:
          'Une section de la table des matières mentionne ouvertement la vulnérabilité du territoire',
        text: "La vulnérabilité résulte du croisement entre l'exposition aux aléas climatiques et la sensibilité du territoire. Son analyse constitue une étape distincte des deux précédentes qui mérite une section dédiée.",
        exampleAttachments: [
          {
            label:
              'Table des matières du diagnostic de vulnérabilité de la CC du Pays de Sainte Odile',
            src: '/preuve-critere4-q1.webp'
          }
        ],
        minHint: 'Aucune section n’est dédiée à la vulnérabilité.',
        maxHint: 'Une section est consacrée à la vulnérabilité.'
      },
      {
        id: 'q2',
        section: 'analyse',
        label: 'Le choix des enjeux prioritaires est objectivé',
        text: 'Les enjeux sont ce que l’on gagne ou que l’on perd si le territoire n’agit pas pour s’adapter (autrement dit ce qui est “en jeu”).',
        minHint: 'Il n’y a pas de priorisation des enjeux.',
        maxHint: 'Les choix sont objectivés.'
      },
      {
        id: 'q3',
        section: 'analyse',
        exampleKind: 'both',
        label: 'Le diagnostic comporte une matrice de vulnérabilité',
        text: 'La matrice de vulnérabilité est le résultat du croisement entre exposition et sensibilité.',
        exampleAttachments: [
          {
            label:
              'Aubrac 2050 - Extrait du rapport de vulnérabilité climatique CC Aubrac - Carladez - Viadène, (pp.77-79)',
            src: '/preuve-critere4-q3.webp'
          }
        ],
        counterExample:
          'Dans ce contre-exemple, la section “vulnérabilité” est en fait consacrée aux aléas climatiques, donc à l’exposition.',
        counterExampleAttachments: [
          {
            label: 'Voir le contre-exemple',
            src: '/preuve-critere4-q3bis.webp'
          }
        ],
        minHint: 'Il n’y a pas de matrice de vulnérabilité.',
        maxHint: 'La matrice de vulnérabilité est présente.'
      }
    ]
  },
  'problematisation-et-conclusion': {
    title: 'Problématisation et conclusion',
    chapeau:
      "Plus qu'un simple constat, le diagnostic identifie-t-il des problématiques territoriales parlantes ?",
    questions: [
      {
        id: 'q1',
        section: 'analyse',
        exampleKind: 'exemple',
        label:
          'La conclusion du diagnostic de vulnérabilité invite à poursuivre le travail vers la stratégie',
        exampleAttachments: [
          {
            label:
              'Approche méthodologique de Saint Brieuc Armor Agglomération - 2025',
            src: '/preuve-critere5-q1.webp'
          }
        ],
        minHint: 'La conclusion ne mentionne pas de suite.',
        maxHint: 'La conclusion mentionne la suite de la démarche d’adaptation.'
      },
      {
        id: 'q2',
        section: 'enquete',
        exampleKind: 'exemple',
        label: 'Une problématique claire est identifiée',
        text: "La problématique est la reformulation d'un enjeu constaté en un défi politique ouvert.",
        example: [
          "**Aléa →** Les sécheresses estivales vont s'intensifier, avec des étiages de cours d'eau plus précoces et plus longs.",
          "**Impact →** L'alimentation en eau potable de X communes sera menacée dès 2035. L'agriculture irriguée perdra Y% de sa capacité, etc.",
          "**Problématique →** Comment garantir l'accès à l'eau pour tous les usages essentiels **alors que** la ressource va se raréfier et que les usages sont déjà en concurrence ?"
        ],
        minHint: 'Aucune problématique n’est identifiée.',
        maxHint: 'Une problématique est clairement identifiée.'
      },
      {
        id: 'q3',
        section: 'enquete',
        label:
          "Les résultats du diagnostic sont restitués aux acteurs du territoire, dans le cadre de temps d'échange dédiés",
        text: 'Il s’agit de temps dédiés (réunion, atelier) pour présenter, expliquer et échanger autour des résultats du diagnostic, par opposition à une diffusion passive (publication, envoi de document).',
        minHint: 'Aucune restitution n’a eu lieu.',
        maxHint: 'Une restitution a eu lieu.'
      }
    ]
  }
};

export const CRITERIA: Criterion[] = CRITERION_SLUGS.map((slug) => ({
  slug,
  ...CRITERIA_CONTENT[slug]
}));
