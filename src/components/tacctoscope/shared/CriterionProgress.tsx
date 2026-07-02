'use client';

import { getLocalAnswers } from '@/lib/tacctoscope/localAnswers';
import { useEffect, useState } from 'react';
import { ProgressDots } from './ProgressDots';

interface Props {
  questionKeys: string[];
  serverAnswered: number;
  total: number;
  isAuthenticated: boolean;
}

export const CriterionProgress = ({
  questionKeys,
  serverAnswered,
  total,
  isAuthenticated
}: Props) => {
  const [filled, setFilled] = useState(serverAnswered);

  useEffect(() => {
    if (isAuthenticated) return;
    const answers = getLocalAnswers();
    setFilled(questionKeys.filter((key) => answers[key] != null).length);
  }, [isAuthenticated, questionKeys]);

  return <ProgressDots filled={filled} total={total} />;
};
