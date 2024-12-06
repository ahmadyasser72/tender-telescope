import type { Difficulty } from "./types";

import { getCollection } from "astro:content";

import { createShuffle } from "fast-shuffle";

export const getAnswers = async (difficulty: Difficulty) => {
  const answers = new Set<string>();

  const entries = await getCollection("answers", ({ id }) => id === difficulty);
  for (const item of entries.flatMap(({ data }) => data.items)) {
    answers.add(item);
  }

  const questions = await getQuestions(difficulty);
  for (const { translation } of questions) answers.add(translation);

  return answers;
};

export const getQuestions = async (
  difficulty?: Difficulty,
  languages?: string[],
  seed?: number,
) => {
  const entries = await getCollection("questions");
  const questions = entries
    .filter(
      ({ id }) =>
        languages === undefined ||
        languages.some((language) => language === id),
    )
    .map(({ data, id }) =>
      data.items
        .filter(
          (it) => difficulty === undefined || it.difficulty === difficulty,
        )
        .map((it) => ({ ...it, language: id })),
    );

  if (seed === undefined) return questions.flat();

  const languagesCount = questions.length;
  const questionsShuffle = createShuffle(seed);
  if (languagesCount === 1) return questionsShuffle(questions[0]);

  const questionsCount = Math.min(...questions.map((items) => items.length));
  return questionsShuffle(
    Array.from({ length: questionsCount }, (_, idx) => idx % languagesCount),
  ).map((languageIdx, questionIdx) => questions[languageIdx][questionIdx]);
};
