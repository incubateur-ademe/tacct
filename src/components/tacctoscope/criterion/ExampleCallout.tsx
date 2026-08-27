import thumbDown from '@/assets/icons/thumb-down.svg';
import thumbUp from '@/assets/icons/thumb-up.svg';
import { Body } from '@/design-system/base/Textes';
import { CalloutKind, RichContent } from '@/lib/tacctoscope/types';
import JSZip from 'jszip';
import Image from 'next/image';
import { RichText } from '../shared/RichText';
import styles from './criterion.module.scss';

interface Props {
  kind: CalloutKind;
  children: RichContent;
  attachments?: string[];
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

const triggerDownload = (href: string, filename: string) => {
  const link = document.createElement('a');
  link.href = href;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const downloadAttachments = async (attachments: string[]) => {
  if (attachments.length === 1) {
    const attachment = attachments[0];
    triggerDownload(attachment, attachment.split('/').pop() ?? attachment);
    return;
  }

  const zip = new JSZip();
  for (const attachment of attachments) {
    const blob = await (await fetch(attachment)).blob();
    zip.file(attachment.split('/').pop() ?? attachment, blob);
  }
  const zipBlob = await zip.generateAsync({ type: 'blob' });
  const zipUrl = URL.createObjectURL(zipBlob);
  triggerDownload(zipUrl, 'cas-reel.zip');
  URL.revokeObjectURL(zipUrl);
};

export const ExampleCallout = ({ kind, children, attachments }: Props) => {
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
        <button
          type="button"
          onClick={() => void downloadAttachments(attachments)}
          className={styles.criterionExampleCalloutAttachment}
        >
          <DocIcon color={accentColor} />
          <Body htmlTag="span" weight="medium" color={accentColor}>
            Voir un cas réel
          </Body>
        </button>
      )}
    </div>
  );
};
