'use client';

import { useEffect, useState } from 'react';
import { getLocalAnswers } from './localAnswers';

interface Params {
  questionKeys: string[];
  serverAnswered: number;
  isAuthenticated: boolean;
}

export const useAnsweredCount = ({
  questionKeys,
  serverAnswered,
  isAuthenticated
}: Params): number => {
  const [filled, setFilled] = useState(serverAnswered);

  useEffect(() => {
    if (!isAuthenticated) {
      const answers = getLocalAnswers();
      setFilled(questionKeys.filter((key) => answers[key] != null).length);
      return;
    }
    setFilled(serverAnswered);
  }, [isAuthenticated, questionKeys, serverAnswered]);

  return filled;
};
