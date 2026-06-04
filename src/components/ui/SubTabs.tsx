'use client';

import { CatnatTypes, TabIcons } from '@/app/(main)/types';
import activiteIconGreen from '@/assets/icons/activite_icon_green.svg';
import activiteIconWhite from '@/assets/icons/activite_icon_white.svg';
import camembertIconGreen from '@/assets/icons/camembert_icon_green.svg';
import camembertIconWhite from '@/assets/icons/camembert_icon_white.svg';
import cartographieIconGreen from '@/assets/icons/cartographie_icon_green.svg';
import cartographieIconWhite from '@/assets/icons/cartographie_icon_white.svg';
import evolutionIconGreen from '@/assets/icons/evolution_icon_green.svg';
import evolutionIconWhite from '@/assets/icons/evolution_icon_white.svg';
import habitatIconGreen from '@/assets/icons/habitat_icon_green.svg';
import habitatIconWhite from '@/assets/icons/habitat_icon_white.svg';
import inconnuIconGreen from '@/assets/icons/inconnu_icon_green.svg';
import inconnuIconWhite from '@/assets/icons/inconnu_icon_white.svg';
import intensiteIconGreen from '@/assets/icons/intensite_icon_green.svg';
import intensiteIconWhite from '@/assets/icons/intensite_icon_white.svg';
import mixteIconGreen from '@/assets/icons/mixte_icon_green.svg';
import mixteIconWhite from '@/assets/icons/mixte_icon_white.svg';
import routesIconGreen from '@/assets/icons/route_icon_green.svg';
import routesIconWhite from '@/assets/icons/route_icon_white.svg';
import SunIconGreen from '@/assets/icons/sun_icon_green.svg';
import SunIconWhite from '@/assets/icons/sun_icon_white.svg';
import ferroviaireIconGreen from '@/assets/icons/train_icon_green.svg';
import ferroviaireIconWhite from '@/assets/icons/train_icon_white.svg';
import { BoutonPrimaireClassic, BoutonSecondaireClassic } from '@/design-system/base/Boutons';
import { useState } from 'react';

interface Props {
  data: Array<string | null>;
  defaultTab: string;
  setValue: (value: string & CatnatTypes) => void;
  maxWidth?: string;
  borderRight?: string;
}

const tabIcons = [
  {
    name: 'Répartition',
    iconNotSelected: camembertIconGreen,
    iconSelected: camembertIconWhite
  },
  {
    name: 'Comparaison',
    iconNotSelected: evolutionIconGreen,
    iconSelected: evolutionIconWhite
  },
  {
    name: 'Évolution',
    iconNotSelected: evolutionIconGreen,
    iconSelected: evolutionIconWhite
  },
  {
    name: 'Cartographie',
    iconNotSelected: cartographieIconGreen,
    iconSelected: cartographieIconWhite
  },
  {
    name: 'Tous types',
    iconNotSelected: null,
    iconSelected: null
  },
  {
    name: 'Habitat',
    iconNotSelected: habitatIconGreen,
    iconSelected: habitatIconWhite
  },
  {
    name: 'Activité',
    iconNotSelected: activiteIconGreen,
    iconSelected: activiteIconWhite
  },
  {
    name: 'Mixte',
    iconNotSelected: mixteIconGreen,
    iconSelected: mixteIconWhite
  },
  {
    name: 'Routes',
    iconNotSelected: routesIconGreen,
    iconSelected: routesIconWhite
  },
  {
    name: 'Ferroviaire',
    iconNotSelected: ferroviaireIconGreen,
    iconSelected: ferroviaireIconWhite
  },
  {
    name: 'Inconnu',
    iconNotSelected: inconnuIconGreen,
    iconSelected: inconnuIconWhite
  },
  {
    name: 'Intensité',
    iconNotSelected: intensiteIconGreen,
    iconSelected: intensiteIconWhite
  },
  {
    name: 'Saisonnalité',
    iconNotSelected: SunIconGreen,
    iconSelected: SunIconWhite
  }
];

const tabsWithIcons = (
  tabIcons: TabIcons[],
  name: string,
  selectedSubTab: string
) => {
  const obj =
    tabIcons.filter((tab) => tab.name === name).length > 0
      ? tabIcons.filter((tab) => tab.name === name)[0]
      : null;
  if (selectedSubTab === name) {
    return obj?.iconSelected;
  } else return obj?.iconNotSelected;
};

const SubTabs = ({
  data,
  defaultTab,
  setValue,
}: Props) => {
  const [selectedSubTab, setSelectedSubTab] = useState(defaultTab);

  //set BoutonPrimaireClassic for the selected button & set BoutonSecondaireClassic for the unselected buttons
  return (
    <>
      {data.map((element, i) => {
        const isSelected = selectedSubTab === element;
        const ButtonComponent = isSelected
          ? BoutonPrimaireClassic
          : BoutonSecondaireClassic;
        return (
          <ButtonComponent
            size="xs"
            key={i}
            onClick={() => {
              setSelectedSubTab(element ? element : '');
              setValue(element ? (element as CatnatTypes) : 'Tous types');
            }}
            text={element!}
            icone={element ? tabsWithIcons(tabIcons, element, selectedSubTab) : undefined}
            style={{ fontWeight: 400 }}
          />
        );
      })}
    </>
  );
};

export default SubTabs;
