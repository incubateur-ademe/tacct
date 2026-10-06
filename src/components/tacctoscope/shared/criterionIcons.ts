import community from '@/assets/icons/community.svg';
import compass from '@/assets/icons/compass.svg';
import flowList from '@/assets/icons/flow-list.svg';
import location from '@/assets/icons/location-overseas-france.svg';
import sun from '@/assets/icons/sun.svg';
import { CriterionSlug } from '@/lib/tacctoscope/types';
import { StaticImageData } from 'next/image';

export const CRITERION_ICONS: Record<CriterionSlug, StaticImageData> = {
  'donnees-climatiques': sun,
  'donnees-socio-economiques': location,
  'dialogue-et-partage': community,
  'priorisation-des-impacts': flowList,
  'problematisation-et-conclusion': compass
};
