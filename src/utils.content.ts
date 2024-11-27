import { getCollection } from "astro:content";
import type { Difficulty } from "./types";

export const getQuestions = async (
  difficulty: Difficulty,
  languages: string[],
) => {
  const allQuestions = await getCollection("questions");
  return allQuestions.filter(
    ({ data, id }) =>
      data.difficulty === difficulty &&
      languages.some((language) => language === id.split("/")[0]),
  );
};
