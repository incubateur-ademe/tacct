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
    <path
      d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-6l7.07-7.071-1.414-1.414L11 13.172l-2.121-2.121-1.415 1.414L11 16z"
      fill="#18753c"
    />
  </svg>
);

const MailCheckIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M12.803 19H4a1 1 0 01-1-1V6.83l8.482 5.762a1 1 0 001.036 0L21 6.83V13h2V5a1 1 0 00-1-1H2a1 1 0 00-1 1v14a1 1 0 001 1h10.803a6.5 6.5 0 01-.045-1zM20.437 6L12 11.733 3.563 6h16.874zM22 17l-4.243 4.243-2.828-2.829 1.414-1.414 1.414 1.414L20.586 15.6 22 17z"
      fill="#18753c"
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
