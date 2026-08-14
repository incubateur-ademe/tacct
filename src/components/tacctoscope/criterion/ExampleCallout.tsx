import thumbDown from '@/assets/icons/thumb-down.svg';
import thumbUp from '@/assets/icons/thumb-up.svg';
import { Body } from '@/design-system/base/Textes';
import { CalloutKind, RichContent } from '@/lib/tacctoscope/types';
import Image from 'next/image';
import { RichText } from '../shared/RichText';
import styles from './criterion.module.scss';

interface Props {
  kind: CalloutKind;
  children: RichContent;
}

export const ExampleCallout = ({ kind, children }: Props) => {
  const isExemple = kind === 'exemple';
  return (
    <div
      className={`${styles.criterionExampleCallout} ${isExemple
          ? styles.criterionExampleCalloutExemple
          : styles.criterionExampleCalloutContre
        }`}
    >
      <div className={styles.criterionExampleCalloutTitle}>
        <Image
          src={isExemple ? thumbUp : thumbDown}
          alt=""
          width={16}
          height={16}
        />
        <Body htmlTag="span" weight="bold" color={isExemple ? '#2b4b49' : '#ce0041'}>
          {isExemple ? 'Exemple' : 'Contre-exemple'}
        </Body>
      </div>
      <RichText
        content={children}
        size="md"
        color={isExemple ? '#3d3d3d' : '#CE0041'}
        style={{ fontStyle: 'italic', lineHeight: 1.5 }}
      />
    </div>
  );
};
