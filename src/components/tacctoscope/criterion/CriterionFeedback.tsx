'use client';

import {
  BoutonPrimaireClassic,
  BoutonSecondaireClassic
} from '@/design-system/base/Boutons';
import {
  saveCriterionFeedback,
  saveRecontactOptIn
} from '@/lib/queries/tacctoscope';
import { CriterionSlug } from '@/lib/tacctoscope/types';
import { useRef, useState, useTransition } from 'react';
import styles from './criterion.module.scss';

interface Props {
  criterionKey: CriterionSlug;
  userEmail: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_TEXTAREA_HEIGHT = 320;

const ArrowRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2h12.172z"
      fill="#038278"
    />
  </svg>
);

const SuccessIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="9" stroke="#666666" strokeWidth="2" />
    <path
      d="m7.4 12.2 3.3 3.3 6.1-6.9"
      stroke="#666666"
      strokeWidth="2"
      strokeLinejoin="miter"
    />
  </svg>
);

const MailCheckIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M13.5 20H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v8"
      stroke="#161616"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <path
      d="M3.6 4.8 12 11.8l8.4-7"
      stroke="#161616"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <path
      d="m14.4 18.1 3 3 4.2-4.9"
      stroke="#161616"
      strokeWidth="2"
      strokeLinejoin="miter"
    />
  </svg>
);

export const CriterionFeedback = ({ criterionKey, userEmail }: Props) => {
  const [vote, setVote] = useState<boolean | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [commentOnly, setCommentOnly] = useState(false);
  const [comment, setComment] = useState('');
  const [sent, setSent] = useState(false);
  const [wantsBeta, setWantsBeta] = useState(false);
  const [email, setEmail] = useState(userEmail);
  const [optInDone, setOptInDone] = useState(false);
  const [pending, startTransition] = useTransition();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const openVote = (value: boolean) => {
    setVote(value);
    setCommentOnly(false);
    setExpanded(true);
  };

  const openCommentOnly = () => {
    setVote(null);
    setCommentOnly(true);
    setExpanded(true);
  };

  const handleCommentChange = (value: string) => {
    setComment(value);
    const el = textareaRef.current;
    if (el) {
      el.style.height = 'auto';
      el.style.height = `${Math.min(el.scrollHeight, MAX_TEXTAREA_HEIGHT)}px`;
    }
  };

  const submitFeedback = () => {
    startTransition(async () => {
      const result = await saveCriterionFeedback(criterionKey, {
        isUseful: vote,
        comment: comment.trim() ? comment.trim() : null
      });
      if (result.ok) setSent(true);
    });
  };

  const submitOptIn = () => {
    startTransition(async () => {
      const result = await saveRecontactOptIn(email);
      if (result.ok) setOptInDone(true);
    });
  };

  if (optInDone) {
    return (
      <div className={styles.feedback}>
        <div className={styles.feedbackThanks}>
          <SuccessIcon />
          Merci pour votre contribution !
        </div>
      </div>
    );
  }

  if (sent) {
    const emailValid = EMAIL_REGEX.test(email.trim());
    return (
      <div className={styles.feedback}>
        <div className={styles.feedbackThanks}>
          <MailCheckIcon />
          Merci, vos retours sont précieux !
        </div>
        <label className={styles.feedbackCheckbox}>
          <input
            type="checkbox"
            checked={wantsBeta}
            onChange={(event) => setWantsBeta(event.target.checked)}
          />
          Je souhaite tester les prochaines nouveautés de TACCT avant leur sortie
        </label>
        {wantsBeta && (
          <div className={styles.feedbackEmailRow}>
            <input
              type="email"
              className={styles.feedbackEmailInput}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              aria-label="Adresse e-mail de recontact"
            />
            <BoutonPrimaireClassic
              size="md"
              text="Valider"
              disabled={pending || !emailValid}
              onClick={submitOptIn}
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={styles.feedback}>
      <div className={styles.feedbackHeader}>
        {commentOnly ? (
          <span className={styles.feedbackQuestion}>Envoyer un commentaire</span>
        ) : (
          <>
            <span className={styles.feedbackQuestion}>
              Ce contenu correspond-il à vos besoins ?
            </span>
            <div
              className={styles.feedbackChoices}
              role="group"
              aria-label="Ce contenu correspond-il à vos besoins ?"
            >
              {vote === true ? (
                <BoutonPrimaireClassic
                  size="md"
                  text="Oui"
                  onClick={() => openVote(true)}
                  style={{
                    border: "1.6px solid #038278"
                  }}
                />
              ) : (
                <BoutonSecondaireClassic
                  size="md"
                  text="Oui"
                  onClick={() => openVote(true)}
                  style={{
                    border: "1.6px solid #038278"
                  }}
                />
              )}
              {vote === false ? (
                <BoutonPrimaireClassic
                  size="md"
                  text="Non"
                  onClick={() => openVote(false)}
                  style={{
                    border: "1.6px solid #038278"
                  }}
                />
              ) : (
                <BoutonSecondaireClassic
                  size="md"
                  text="Non"
                  onClick={() => openVote(false)}
                  style={{
                    border: "1.6px solid #038278"
                  }}
                />
              )}
            </div>
          </>
        )}
      </div>

      {!expanded && (
        <button
          type="button"
          className={styles.feedbackCommentLink}
          onClick={openCommentOnly}
        >
          Envoyer un commentaire
          <ArrowRightIcon />
        </button>
      )}

      {expanded && (
        <div className={styles.feedbackExpand}>
          <textarea
            ref={textareaRef}
            className={styles.feedbackTextarea}
            value={comment}
            onChange={(event) => handleCommentChange(event.target.value)}
            placeholder={
              commentOnly
                ? 'Vos idées, suggestions, remarques, questions'
                : 'Ce qui manque, ce qui pourrait être amélioré...'
            }
          />
          <div className={styles.feedbackSubmitRow}>
            <BoutonPrimaireClassic
              size="md"
              text="Envoyer"
              disabled={pending || (commentOnly && !comment.trim())}
              onClick={submitFeedback}
            />
          </div>
        </div>
      )}
    </div>
  );
};
