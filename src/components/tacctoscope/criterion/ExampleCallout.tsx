'use client';

import { Body } from '@/design-system/base/Textes';
import { CalloutKind, CasReel, RichContent } from '@/lib/tacctoscope/types';
import { useState } from 'react';
import { FormattedText } from '../shared/FormattedText';
import { RichText } from '../shared/RichText';
import { CasReelModal } from './CasReelModal';
import styles from './criterion.module.scss';

interface Props {
  kind: CalloutKind;
  children?: RichContent;
  attachments?: CasReel[];
  answered: boolean;
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

const ThumbUpIcon = ({ color }: { color: string }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8.25584 0.460715L9.46517 1.06538C10.1664 1.41587 10.5286 2.20767 10.3352 2.96738L9.73317 5.33338H13.9998C14.7362 5.33338 15.3332 5.93034 15.3332 6.66672V8.06938C15.3334 8.24362 15.2994 8.41621 15.2332 8.57738L13.1698 13.5874C13.0669 13.8372 12.8234 14 12.5532 14H1.33317C0.964981 14 0.666504 13.7016 0.666504 13.3334V6.66672C0.666504 6.29853 0.964981 6.00005 1.33317 6.00005H3.6545C3.87109 6.0001 4.0742 5.89494 4.19917 5.71805L7.8345 0.566715C7.92947 0.432137 8.10849 0.387098 8.25584 0.460715ZM8.4285 2.03872L5.2885 6.48672C5.12184 6.72272 4.9085 6.91605 4.6665 7.05872V12.6667H12.1065L13.9998 8.06938V6.66672H9.73317C9.32167 6.66666 8.93324 6.47659 8.68069 6.15171C8.42813 5.82682 8.33974 5.40352 8.44117 5.00472L9.04317 2.63938C9.08199 2.48736 9.00953 2.32884 8.86917 2.25872L8.4285 2.03872Z"
      fill={color}
    />
  </svg>
);

const ThumbDownIcon = ({ color }: { color: string }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M14.667 2C15.0352 2 15.3337 2.29848 15.3337 2.66667V9.33333C15.3337 9.70152 15.0352 10 14.667 10H12.3457C12.1291 9.99994 11.926 10.1051 11.801 10.282L8.16566 15.4327C8.07069 15.5672 7.89167 15.6123 7.74433 15.5387L6.53499 14.9333C5.83377 14.5828 5.47159 13.791 5.66499 13.0313L6.26699 10.6667H2.00033C1.26395 10.6667 0.666993 10.0697 0.666993 9.33333V7.93067C0.666814 7.75643 0.700788 7.58384 0.766994 7.42267L2.83099 2.41333C2.93363 2.16349 3.17689 2.00027 3.44699 2H14.667ZM11.3337 3.33333H3.89366L2.00033 7.93067V9.33333H6.26699C6.6785 9.33339 7.06692 9.52346 7.31948 9.84834C7.57204 10.1732 7.66043 10.5965 7.55899 10.9953L6.95699 13.3607C6.91817 13.5127 6.99063 13.6712 7.13099 13.7413L7.57166 13.9613L10.7117 9.51333C10.8783 9.27733 11.0917 9.084 11.3337 8.94133V3.33333Z"
      fill={color}
    />
  </svg>
);

export const ExampleCallout = ({
  kind,
  children,
  attachments,
  answered
}: Props) => {
  const [openedSrc, setOpenedSrc] = useState<string | null>(null);
  const isExemple = kind === 'exemple';
  const accentColor = answered ? '#3D3D3D' : isExemple ? '#095D55' : '#CE0041';
  const titleColor = answered ? '#3D3D3D' : isExemple ? '#2b4b49' : '#ce0041';
  const textColor = answered || isExemple ? '#3D3D3D' : '#CE0041';
  return (
    <div
      className={`${styles.criterionExampleCallout} ${isExemple
          ? styles.criterionExampleCalloutExemple
          : styles.criterionExampleCalloutContre
        } ${answered ? styles.criterionExampleCalloutAnswered : ''}`}
    >
      <div className={styles.criterionExampleCalloutTitle}>
        {isExemple ? (
          <ThumbUpIcon color={titleColor} />
        ) : (
          <ThumbDownIcon color={titleColor} />
        )}
        <Body htmlTag="span" weight="bold" color={titleColor}>
          {isExemple ? 'Bonne pratique' : 'À éviter'}
        </Body>
      </div>
      <RichText
        content={children}
        size="md"
        color={textColor}
        style={{ fontStyle: 'italic', lineHeight: 1.5 }}
      />
      {attachments?.map((attachment) => (
        <button
          key={attachment.src}
          type="button"
          onClick={() => setOpenedSrc(attachment.src)}
          className={styles.criterionExampleCalloutAttachment}
        >
          <DocIcon color={accentColor} />
          <Body
            htmlTag="span"
            weight="medium"
            color={accentColor}
            style={{ textDecoration: 'underline' }}
          >
            <FormattedText text={attachment.label} />
          </Body>
        </button>
      ))}
      <CasReelModal src={openedSrc} onClose={() => setOpenedSrc(null)} />
    </div>
  );
};
