import { getCollection } from "astro:content";
import type { Difficulty } from "./types";

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
