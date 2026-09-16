'use client';

import thumbDown from '@/assets/icons/thumb-down.svg';
import thumbUp from '@/assets/icons/thumb-up.svg';
import { Body } from '@/design-system/base/Textes';
import { CalloutKind, RichContent } from '@/lib/tacctoscope/types';
import Image from 'next/image';
import { useState } from 'react';
import { RichText } from '../shared/RichText';
import { CasReelModal } from './CasReelModal';
import styles from './criterion.module.scss';

interface Props {
  kind: CalloutKind;
  children: RichContent;
  attachments?: string[];
  downloadName: string;
}

const DocIcon = ({ color }: { color: string }) => (
  <svg width="18" height="20" viewBox="0 0 18 20" fill="none" aria-hidden="true">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M17 0C17.5523 0 18 0.447715 18 1V19C18 19.5523 17.5523 20 17 20H1C0.447715 20 0 19.5523 0 19V1C0 0.447715 0.447715 0 1 0H17ZM16 2H2V18H16V2ZM14 14V16H4V14H14ZM14 10V12H4V10H14ZM8 4V8H4V4H8ZM14 5V7H10V5H14Z"
      fill={color}
    />
  </svg>
);

export const ExampleCallout = ({
  kind,
  children,
  attachments,
  downloadName
}: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isExemple = kind === 'exemple';
  const accentColor = isExemple ? '#095D55' : '#CE0041';
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
      {attachments && attachments.length > 0 && (
        <>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className={styles.criterionExampleCalloutAttachment}
          >
            <DocIcon color={accentColor} />
            <Body htmlTag="span" weight="medium" color={accentColor}>
              Voir le cas réel
            </Body>
          </button>
          <CasReelModal
            attachments={attachments}
            accentColor={accentColor}
            downloadName={downloadName}
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />
        </>
      )}
    </div>
  );
};
