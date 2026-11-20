'use client';

import camembertIcon from '@/assets/icons/camembert_icon_green.svg';
import cartographieIcon from '@/assets/icons/cartographie_icon_green.svg';
import evolutionIcon from '@/assets/icons/evolution_icon_green.svg';
import intensiteIcon from '@/assets/icons/intensite_icon_green.svg';
import sunIcon from '@/assets/icons/sun_icon_green.svg';
import { Onglets } from '@/design-system/base/Onglets';
import { StaticImageData } from 'next/image';
import { ReactNode } from 'react';

const iconesOnglets: Record<string, StaticImageData> = {
  Répartition: camembertIcon,
  Comparaison: evolutionIcon,
  Évolution: evolutionIcon,
  Cartographie: cartographieIcon,
  Intensité: intensiteIcon,
  Saisonnalité: sunIcon
};

export const OngletsDataviz = ({
  libelles,
  ongletActif,
  onChange,
  children
}: {
  libelles: string[];
  ongletActif: string;
  onChange: (libelle: string) => void;
  children: ReactNode;
}) => (
  <Onglets
    variante="souligne"
    ariaLabel="Mode de représentation des données"
    onglets={libelles.map((libelle) => ({
      libelle,
      icone: iconesOnglets[libelle]
    }))}
    ongletActif={ongletActif}
    onChange={onChange}
  >
    {children}
  </Onglets>
);
