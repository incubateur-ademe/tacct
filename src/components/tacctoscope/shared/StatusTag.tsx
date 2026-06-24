import edit from '@/assets/icons/edit-inbox.svg';
import star from '@/assets/icons/star.svg';
import thumbUp from '@/assets/icons/thumb-up.svg';
import { Body } from '@/design-system/base/Textes';
import { ANSWER_STATUS } from '@/lib/tacctoscope/status';
import { AnswerValue } from '@/lib/tacctoscope/types';
import Image, { StaticImageData } from 'next/image';
import styles from './shared.module.scss';

const TAG_IMAGE: Partial<Record<AnswerValue, { src: StaticImageData; width: number }>> =
  {
    tres_satisfaisant: { src: star, width: 122 },
    partiel: { src: edit, width: 131 },
    absent: { src: edit, width: 131 }
  };

interface Props {
  value: AnswerValue;
}

export const StatusTag = ({ value }: Props) => {
  const label = ANSWER_STATUS[value].label;
  const tag = TAG_IMAGE[value];

  if (tag) {
    return (
      <Image
        src={tag.src}
        alt={label}
        width={tag.width}
        height={36}
        className={styles.statusTagImage}
      />
    );
  }

  return (
    <span className={styles.statusTagPill}>
      <Image src={thumbUp} alt="" width={16} height={16} />
      <Body htmlTag="span" weight="bold" color="#346c37">
        {label.toUpperCase()}
      </Body>
    </span>
  );
};
