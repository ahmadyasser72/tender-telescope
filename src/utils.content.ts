import type { Difficulty } from "./types";

import { getCollection } from "astro:content";

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
) => {
  const entries = await getCollection("questions");
  return entries
    .filter(
      ({ id }) =>
        languages === undefined ||
        languages.some((language) => language === id),
    )
    .flatMap(({ data, id }) =>
      data.items
        .filter(
          (it) => difficulty === undefined || it.difficulty === difficulty,
        )
        .map((it) => ({ ...it, language: id })),
    );
};
