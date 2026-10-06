'use client';

import styles from '@/app/(espace-connecte)/(avec-navigation)/tacctoscope/feuille-de-route/roadmap.module.scss';
import { Body } from '@/design-system/base/Textes';
import { MouseEvent } from 'react';

/* Ancre du bloc d'aide placé sous l'ensemble des critères */
export const NO_ANSWER_HELP_ID = 'que-faire-sans-reponse';

const ArrowDownRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M14 14.172V6H4V4h12v10.172l3.536-3.536 1.414 1.414L15 18l-5.95-5.95 1.414-1.414L14 14.172Z"
      fill="currentColor"
    />
  </svg>
);

const scrollToHelp = (event: MouseEvent<HTMLAnchorElement>) => {
  const target = document.getElementById(NO_ANSWER_HELP_ID);
  if (!target) return;
  event.preventDefault();
  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

export const NoAnswerHelpLink = () => (
  <a
    href={`#${NO_ANSWER_HELP_ID}`}
    className={styles.noAnswerHelpLink}
    onClick={scrollToHelp}
  >
    <Body
      htmlTag="span"
      size="sm"
      color="#038278"
      style={{ textDecoration: 'underline', textUnderlineOffset: '3px' }}
    >
      Que faire si vous n’avez pas les réponses ?
    </Body>
    <ArrowDownRightIcon />
  </a>
);
