'use server';

import { randomUUID } from 'node:crypto';
import { getCurrentUserValide } from '@/lib/auth/getCurrentUser';
import { prisma } from '@/lib/queries/db';
import { isAnswerValue, normalizeAnswers } from '@/lib/tacctoscope/answers';
import { CRITERIA } from '@/lib/tacctoscope/content/criteria';
import { isKnownQuestionKey } from '@/lib/tacctoscope/keys';
import { AnswerMap, AnswerValue } from '@/lib/tacctoscope/types';

type ActionResult = { ok: boolean };

type ImportResult = {
  ok: boolean;
  inserted: number;
  conflicts: number;
  conflictingCriteria: string[];
};

const IMPORT_FAILED: ImportResult = {
  ok: false,
  inserted: 0,
  conflicts: 0,
  conflictingCriteria: []
};

const findAnswers = async (userId: string): Promise<AnswerMap> => {
  const rows = await prisma.tacctoscope_answer.findMany({
    where: { user_id: userId },
    select: { question_key: true, value: true }
  });
  return normalizeAnswers(
    Object.fromEntries(rows.map((row) => [row.question_key, row.value]))
  );
};

export const getUserAnswers = async (): Promise<AnswerMap> => {
  const user = await getCurrentUserValide();
  if (!user) return {};

  try {
    return await findAnswers(user.id);
  } catch (error) {
    console.error('getUserAnswers error', error);
    return {};
  }
};

export const importLocalAnswers = async (
  localAnswers: Record<string, string>,
  overwrite: boolean
): Promise<ImportResult> => {
  const user = await getCurrentUserValide();
  if (!user) return IMPORT_FAILED;

  try {
    const stored = await findAnswers(user.id);
    const local = Object.entries(normalizeAnswers(localAnswers)).filter(
      ([questionKey, value]) =>
        isKnownQuestionKey(questionKey) && isAnswerValue(value)
    );
    const missing = local.filter(([questionKey]) => stored[questionKey] == null);
    const conflicting = local.filter(
      ([questionKey, value]) =>
        stored[questionKey] != null && stored[questionKey] !== value
    );
    const now = new Date();

    const operations = [
      ...(missing.length > 0
        ? [
            prisma.tacctoscope_answer.createMany({
              data: missing.map(([questionKey, value]) => ({
                id: randomUUID(),
                user_id: user.id,
                question_key: questionKey,
                value
              })),
              skipDuplicates: true
            })
          ]
        : []),
      ...(overwrite ? conflicting : []).map(([questionKey, value]) =>
        prisma.tacctoscope_answer.updateMany({
          where: { user_id: user.id, question_key: questionKey },
          data: { value, updated_at: now }
        })
      )
    ];
    if (operations.length > 0) await prisma.$transaction(operations);

    const remaining = overwrite ? [] : conflicting;
    return {
      ok: true,
      inserted: missing.length,
      conflicts: remaining.length,
      conflictingCriteria: CRITERIA.filter((criterion) =>
        remaining.some(([questionKey]) =>
          questionKey.startsWith(`${criterion.slug}.`)
        )
      ).map((criterion) => criterion.title)
    };
  } catch (error) {
    console.error('importLocalAnswers error', error);
    return IMPORT_FAILED;
  }
};

export const saveAnswer = async (
  questionKey: string,
  value: AnswerValue
): Promise<ActionResult> => {
  const user = await getCurrentUserValide();
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
  const user = await getCurrentUserValide();
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
  const user = await getCurrentUserValide();
  if (!user) return { ok: false };

  try {
    await prisma.tacctoscope_answer.deleteMany({ where: { user_id: user.id } });
    return { ok: true };
  } catch (error) {
    console.error('resetAllAnswers error', error);
    return { ok: false };
  }
};

