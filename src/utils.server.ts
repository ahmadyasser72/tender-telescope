import type { Difficulty, Question } from "./types";

import { getCollection } from "astro:content";

export const stripResponse = (response: Response) =>
  response.blob().then((blob) => new Response(blob));

export const getAnswers = async () => {
  const answerMap = new Map<Difficulty, Set<string>>();

  const entries = await getCollection("answers");
  for (const { id: difficulty, data } of entries) {
    const answers = new Set(data.items);

    const questions = (await getQuestions()).flatMap(([_, items]) =>
      items.filter((it) => it.difficulty === difficulty),
    );
    for (const { translation } of questions) answers.add(translation);

    answerMap.set(difficulty, answers);
  }

  return answerMap;
};

export const getQuestions = async () => {
  const entries = await getCollection("questions");
  return entries.map(({ data, id }): [typeof id, Question[]] => [
    id,
    data.items.map((it, idx) => ({
      ...it,
      language: id,
      code: data.code,
      id: idx,
    })),
  ]);
};
