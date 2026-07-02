import padlockGreen from '@/assets/icons/padlock_green.svg';
import { Body, H2 } from '@/design-system/base/Textes';
import { buildQuestionKey } from '@/lib/tacctoscope/keys';
import { Criterion } from '@/lib/tacctoscope/types';
import Image from 'next/image';
import Link from 'next/link';
import { CriterionProgress } from '../shared/CriterionProgress';
import { CRITERION_ICONS } from '../shared/criterionIcons';
import styles from './criterion.module.scss';

interface Props {
  criterion: Criterion;
  answered: number;
  total: number;
  locked: boolean;
  isAuthenticated: boolean;
}

export const CriterionCard = ({
  criterion,
  answered,
  total,
  locked,
  isAuthenticated
}: Props) => {
  const content = (
    <>
      <div className={styles.criterionCardContent}>
        <Image
          src={CRITERION_ICONS[criterion.slug]}
          alt=""
          width={64}
          height={64}
          className={styles.criterionCardIcon}
        />
        <H2
          color="#038278"
          style={{ fontSize: '1.25rem', lineHeight: '1.75rem', letterSpacing: 0 }}
        >
          {criterion.title}
        </H2>
        <Body size="sm" color="#3d3d3d">
          {criterion.chapeau}
        </Body>
      </div>
      {locked ? (
        <div className={styles.criterionCardLockFooter}>
          <Image src={padlockGreen} alt="" width={40} height={40} />
        </div>
      ) : (
        <div className={styles.criterionCardFooter}>
          <CriterionProgress
            questionKeys={criterion.questions.map((question) =>
              buildQuestionKey(criterion.slug, question.id)
            )}
            serverAnswered={answered}
            total={total}
            isAuthenticated={isAuthenticated}
          />
        </div>
      )}
    </>
  );

  if (locked) {
    return (
      <div
        className={`${styles.criterionCardLink} ${styles.criterionCardLocked}`}
        aria-disabled="true"
      >
        {content}
      </div>
    );
  }

  return (
    <Link
      href={`/tacctoscope/${criterion.slug}`}
      className={styles.criterionCardLink}
    >
      {content}
    </Link>
  );
};
