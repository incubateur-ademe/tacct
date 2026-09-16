import edit from '@/assets/icons/edit-inbox.svg';
import star from '@/assets/icons/star.svg';
import thumbUp from '@/assets/icons/thumb-up.svg';
import { Body } from '@/design-system/base/Textes';
import { ANSWER_STATUS, StatusIcon, StatusVariant } from '@/lib/tacctoscope/status';
import { AnswerValue } from '@/lib/tacctoscope/types';
import Image, { StaticImageData } from 'next/image';
import styles from './shared.module.scss';

const TAG_ICON: Record<StatusIcon, StaticImageData> = {
  star: star,
  thumb: thumbUp,
  pencil: edit
};

const TAG_VARIANT: Record<StatusVariant, string> = {
  green: styles.statusTagGreen,
  gray: styles.statusTagGray
};

interface Props {
  value: AnswerValue;
}

export const StatusTag = ({ value }: Props) => {
  const { label, icon, variant } = ANSWER_STATUS[value];

  return (
    <span className={`${styles.statusTagPill} ${TAG_VARIANT[variant]}`}>
      <Image src={TAG_ICON[icon]} alt="" width={16} height={16} />
      <Body htmlTag="span" weight="bold" size="sm">
        {label.toUpperCase()}
      </Body>
    </span>
  );
};
