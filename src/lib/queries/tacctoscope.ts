'use server';

import { randomUUID } from 'node:crypto';
import { getCurrentUser } from '@/lib/auth/getCurrentUser';
import { encryptField } from '@/lib/crypto/user-crypto';
import { prisma } from '@/lib/queries/db';
import {
  isKnownCriterionKey,
  isKnownQuestionKey
} from '@/lib/tacctoscope/keys';
import {
  ANSWER_VALUES,
  AnswerMap,
  AnswerValue,
  CriterionSlug
} from '@/lib/tacctoscope/types';

type ActionResult = { ok: boolean };

const isAnswerValue = (value: string): value is AnswerValue =>
  (ANSWER_VALUES as readonly string[]).includes(value);

export const getUserAnswers = async (): Promise<AnswerMap> => {
  const user = await getCurrentUser();
  if (!user) return {};

  try {
    const rows = await prisma.tacctoscope_answer.findMany({
      where: { user_id: user.id },
      select: { question_key: true, value: true }
    });
    return Object.fromEntries(
      rows.map((row) => [row.question_key, row.value as AnswerValue])
    );
  } catch (error) {
    console.error('getUserAnswers error', error);
    return {};
  }
};

export const saveAnswer = async (
  questionKey: string,
  value: AnswerValue
): Promise<ActionResult> => {
  const user = await getCurrentUser();
  if (!user) return { ok: false };
  if (!isKnownQuestionKey(questionKey)) return { ok: false };
  if (!isAnswerValue(value)) return { ok: false };

  try {
    await prisma.tacctoscope_answer.upsert({
      where: {
        user_id_question_key: { user_id: user.id, question_key: questionKey }
      },
      update: { value, updated_at: new Date() },
      create: {
        id: randomUUID(),
        user_id: user.id,
        question_key: questionKey,
        value
      }
    });
    return { ok: true };
  } catch (error) {
    console.error('saveAnswer error', error);
    return { ok: false };
  }
};

export const deleteAnswer = async (
  questionKey: string
): Promise<ActionResult> => {
  const user = await getCurrentUser();
  if (!user) return { ok: false };
  if (!isKnownQuestionKey(questionKey)) return { ok: false };

  try {
    await prisma.tacctoscope_answer.deleteMany({
      where: { user_id: user.id, question_key: questionKey }
    });
    return { ok: true };
  } catch (error) {
    console.error('deleteAnswer error', error);
    return { ok: false };
  }
};

export const resetAllAnswers = async (): Promise<ActionResult> => {
  const user = await getCurrentUser();
  if (!user) return { ok: false };

  try {
    await prisma.tacctoscope_answer.deleteMany({ where: { user_id: user.id } });
    await prisma.tacctoscope_criterion_feedback.deleteMany({
      where: { user_id: user.id }
    });
    return { ok: true };
  } catch (error) {
    console.error('resetAllAnswers error', error);
    return { ok: false };
  }
};

export const saveCriterionFeedback = async (
  criterionKey: CriterionSlug,
  input: { isUseful: boolean | null; comment: string | null }
): Promise<ActionResult> => {
  const user = await getCurrentUser();
  if (!user) return { ok: false };
  if (!isKnownCriterionKey(criterionKey)) return { ok: false };

  const comment = input.comment?.trim() ? input.comment.trim() : null;
  if (input.isUseful === null && !comment) return { ok: false };

  try {
    await prisma.tacctoscope_criterion_feedback.create({
      data: {
        id: randomUUID(),
        user_id: user.id,
        criterion_key: criterionKey,
        is_useful: input.isUseful,
        comment
      }
    });
    return { ok: true };
  } catch (error) {
    console.error('saveCriterionFeedback error', error);
    return { ok: false };
  }
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const saveRecontactOptIn = async (
  email: string
): Promise<ActionResult> => {
  const user = await getCurrentUser();
  if (!user) return { ok: false };

  const trimmed = email.trim();
  if (!EMAIL_REGEX.test(trimmed)) return { ok: false };

  try {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        wants_beta_features: true,
        recontact_email: encryptField(trimmed),
        updated_at: new Date()
      }
    });
    return { ok: true };
  } catch (error) {
    console.error('saveRecontactOptIn error', error);
    return { ok: false };
  }
};
