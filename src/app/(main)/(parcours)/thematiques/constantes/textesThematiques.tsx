import { Body } from '@/design-system/base/Textes';
import { JSX } from 'react';

export const sommaireThematiques = {
  'Confort thermique': {
    thematiquesLiees: [
      {
        id: 'section1',
        thematique: 'Santé',
        icone: '🏥',
        sousCategories: [
          'Grand âge',
          'Précarité énergétique',
          'Emplois en extérieur'
        ]
      },
      {
        id: 'section2',
        thematique: 'Bâtiment',
        icone: '🏠',
        sousCategories: ['Âge du bâtiment']
      },
      {
        id: 'section3',
        thematique: 'Aménagement',
        icone: '🏗️',
        sousCategories: ['LCZ']
      }
    ]
  },
  Biodiversité: {
    thematiquesLiees: [
      {
        id: 'section1',
        thematique: 'Biodiversité',
        icone: '🌼',
        sousCategories: ['Types de sols']
      },
      {
        id: 'section2',
        thematique: 'Aménagement',
        icone: '🏗️',
        sousCategories: ['Sols imperméabilisés']
      },
      {
        id: 'section3',
        thematique: 'Agriculture',
        icone: '🌾',
        sousCategories: ['Surfaces toujours en herbe', 'Surfaces en bio']
      },
      {
        id: 'section4',
        thematique: 'Eau',
        icone: '💧',
        sousCategories: ["État des cours d'eau"]
      },
      {
        id: 'section5',
        thematique: 'Air',
        icone: '💨',
        sousCategories: ['Ozone et végétation']
      }
    ]
  },
  'Gestion des risques': {
    thematiquesLiees: [
      {
        id: 'section1',
        thematique: 'Gestion des risques',
        icone: '🚧',
        sousCategories: ['Arrêtés CatNat', 'Feux de forêt', 'Débroussaillement', 'Sécheresses passées']
      },
      {
        id: 'section2',
        thematique: 'Bâtiment',
        icone: '🏠',
        sousCategories: ['Retrait-gonflement des argiles']
      }
    ]
  },
  Agriculture: {
    thematiquesLiees: [
      {
        id: 'section1',
        thematique: 'Agriculture',
        icone: '🌾',
        sousCategories: [
          'Part des chefs d’exploitation séniors',
          'Types de culture'
        ]
      },
      {
        id: 'section2',
        thematique: 'Eau',
        icone: '💧',
        sousCategories: ['Superficies irriguées']
      },
      {
        id: 'section3',
        thematique: 'Biodiversité',
        icone: '🌼',
        sousCategories: ['Surfaces en bio']
      },
      {
        id: 'section4',
        thematique: 'Tourisme',
        icone: '🏖️',
        sousCategories: ['Appellations contrôlées']
      }
    ]
  },
  Aménagement: {
    thematiquesLiees: [
      {
        id: 'section1',
        thematique: 'Aménagement',
        icone: '🏗️',
        sousCategories: ['Sols imperméabilisés', 'LCZ']
      }
    ]
  },
  Eau: {
    thematiquesLiees: [
      {
        id: 'section1',
        thematique: 'Eau',
        icone: '💧',
        sousCategories: ['Ressources en eau', "État des cours d'eau"]
      }
    ]
  },
  Santé: {
    thematiquesLiees: [
      {
        id: 'section1',
        thematique: 'Air',
        icone: '💨',
        sousCategories: ['Pollution à l’ozone']
      },
      {
        id: 'section2',
        thematique: 'Biodiversité',
        icone: '🌼',
        sousCategories: ['Moustique tigre et arboviroses']
      }      
    ]
  },
  Forêts: {
    thematiquesLiees: [
      {
        id: 'section1',
        thematique: 'Forêts',
        icone: '🌲',
        sousCategories: ['Hauteur de la canopée']
      }
    ]
  }
};

export const sommaireImpacts = {
  'Confort thermique': [
    {
      id: 'section1',
      titre: 'Échanger pour diagnostiquer'
    },
    {
      id: 'section2',
      titre: 'Associer les parties prenantes'
    }
  ],
  Biodiversité: [],
  'Gestion des risques': [],
  Agriculture: [
    {
      id: 'section1',
      titre: 'Échanger pour diagnostiquer'
    },
    {
      id: 'section2',
      titre: 'Associer les parties prenantes'
    }
  ],
  Aménagement: [],
  Eau: []
};

export const thematiquesInfo: {
  [key: string]: { title: string; description: JSX.Element; link: string };
} = {
  'Continuité des services': {
    title: 'Continuité des services',
    description: <div></div>,
    link: ''
  },
  Bâtiment: {
    title: 'Bâtiment',
    description: <div></div>,
    link: ''
  },
  Aménagement: {
    title: 'Aménagement',
    description: (
      <div>
        <Body size="sm" margin="1rem 0">
          Tempêtes, inondations, canicules : face à ces défis croissants,
          l'aménagement fait la différence. Quatre domaines clés révèlent les
          atouts et faiblesses de chaque territoire :
        </Body>
        <div className="flex flex-col">
          <Body size="sm">🏥 Santé</Body>
          <Body size="sm">🌼 Biodiversité</Body>
          <Body size="sm">🛠️ Continuité des services</Body>
          <Body size="sm">🚧 Gestion des risques</Body>
        </div>
        <Body size="sm" margin="1rem 0">
          👉 Combinés, ces facteurs déterminent le niveau de protection de votre
          territoire.
        </Body>
      </div>
    ),
    link: 'Aménagement'
  },
  'Confort thermique': {
    title: 'Confort thermique',
    description: (
      <div>
        <Body size="sm">
          Les vagues de chaleur qui se multiplient n’affectent pas tous les
          territoires de la même manière.
        </Body>
        <Body size="sm" margin="1rem 0">
          Certaines spécificités locales rendent votre territoire plus ou moins
          sensible à la chaleur. Elles relèvent de thématiques différentes,
          notamment :
        </Body>
        <div className="flex flex-col">
          <Body size="sm">🏥 Santé</Body>
          <Body size="sm">🏠 Bâtiment</Body>
          <Body size="sm">🏗️ Aménagement</Body>
          <Body size="sm">🏖️ Tourisme</Body>
        </div>
        <Body size="sm" margin="1rem 0">
          👉 Ces facteurs combinés déterminent la sensibilité globale de votre
          territoire face à la chaleur.
        </Body>
      </div>
    ),
    link: 'Confort thermique'
  },
  'Gestion des risques': {
    title: 'Gestion des risques',
    description: (
      <div>
        <Body size="sm" style={{ marginBottom: '1rem' }}>
          Peu de ressources ou de domaines d'activité échappent aux catastrophes
          naturelles engendrées par les dérèglements du climat.
        </Body>
        <Body size="sm" margin="1rem 0">
          👉 Etat des lieux sur votre territoire.
        </Body>
      </div>
    ),
    link: 'Gestion des risques'
  },
  Santé: {
    title: 'Santé',
    description: <div>
      <Body size="sm" style={{ marginBottom: '1rem' }}>
          Le changement climatique ne menace pas la santé directement : il 
          dégrade d'abord les conditions qui la rendent possible. Plus que 
          les catastrophes, ce sont souvent des mécanismes lents et cumulatifs 
          qui fragilisent la santé publique, à travers quatre grands canaux de 
          dégradation progressive :
        </Body>
        <div className="flex flex-col">
          <Body size="sm">💨 Qualité de l’air</Body>
          <Body size="sm">🌼 Biodiversité</Body>
          <Body size="sm">💧 Eau</Body>
          <Body size="sm">🌡️ Confort thermique</Body>
        </div>
        <Body size="sm" margin="1rem 0">
          👉 La santé des habitants se joue aussi dans la qualité de vos écosystèmes.
        </Body>
    </div>,
    link: 'Santé'
  },
  Forêts: {
    title: 'Forêts',
    description: <div></div>,
    link: 'Forêts'
  },
  Eau: {
    title: 'Eau',
    description: (
      <div>
        <Body size="sm" style={{ marginBottom: '1rem' }}>
          Concilier les usages, préserver la biodiversité, s'adapter aux
          nouveaux risques : un défi complexe mais pas insurmontable. Chaque
          territoire dispose d'atouts uniques pour y parvenir dans un climat qui
          change. Cette capacité d'adaptation s'évalue à travers plusieurs
          dimensions clés :
        </Body>
        <div className="flex flex-col">
          <Body size="sm">🌼 Biodiversité</Body>
          <Body size="sm">🚧 Gestion des risques</Body>
          <Body size="sm">🏥 Santé</Body>
          <Body size="sm">🏖️ Tourisme</Body>
          <Body size="sm">🌾 Agriculture</Body>
        </div>
        <Body size="sm" margin="1rem 0">
          👉 Ensemble, ces facteurs vont définir la sensibilité de votre
          territoire.
        </Body>
      </div>
    ),
    link: 'Eau'
  },
  Biodiversité: {
    title: 'Biodiversité',
    description: (
      <div>
        <Body size="sm" style={{ marginBottom: '1rem' }}>
          Face aux pressions multiples sur la biodiversité, chaque territoire
          développe ses propres mécanismes de protection. Cinq domaines
          influencent particulièrement cette capacité d'adaptation :
        </Body>
        <div className="flex flex-col">
          <Body size="sm">🏗️ Aménagement</Body>
          <Body size="sm">🌾 Agriculture</Body>
          <Body size="sm">💧 Eau</Body>
          <Body size="sm">💨 Air</Body>
          <Body size="sm">🏖️ Tourisme</Body>
        </div>
        <Body size="sm" margin="1rem 0">
          👉 Combinés, ces facteurs fragilisent la biodiversité de votre
          territoire face au changement climatique.
        </Body>
      </div>
    ),
    link: 'Biodiversité'
  },
  Air: {
    title: 'Air',
    description: <div></div>,
    link: ''
  },
  Entreprises: {
    title: 'Entreprises',
    description: <div></div>,
    link: ''
  },
  Tourisme: {
    title: 'Tourisme',
    description: <div></div>,
    link: ''
  },
  Agriculture: {
    title: 'Agriculture',
    description: (
      <div>
        <Body size="sm" style={{ marginBottom: '1rem' }}>
          Agriculture, eau potable, milieux naturels, tourisme… : les équilibres
          de votre territoire résisteront-ils au changement climatique ?
        </Body>
        <div className="flex flex-col">
          <Body size="sm">💧 Eau</Body>
          <Body size="sm">🌼 Biodiversité</Body>
          <Body size="sm">🏥 Santé</Body>
          <Body size="sm">🏖️ Tourisme</Body>
        </div>
        <Body size="sm" margin="1rem 0">
          👉 Explorez les facteurs de sensibilité qui feront la différence.
        </Body>
      </div>
    ),
    link: 'Agriculture'
  },
  Sylviculture: {
    title: 'Sylviculture',
    description: <div></div>,
    link: ''
  }
};
