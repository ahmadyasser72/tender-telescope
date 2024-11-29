import type { Question } from "$lib/types";
import { getAnswers, getQuestions } from "$lib/utils.content";
import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import { createShuffle } from "fast-shuffle";

const questionsFilter = {
  difficulty: z.enum(["pemula", "menengah", "mahir"]),
  languages: z.array(z.string()),
};

export const questions = {
  size: defineAction({
    input: z.object(questionsFilter),
    handler: async ({ difficulty, languages }) => {
      const questions = await getQuestions(difficulty, languages);
      return questions.length;
    },
  }),
  get: defineAction({
    input: z.object({
      index: z.number(),
      ...questionsFilter,
    }),
    handler: async ({ index, difficulty, languages }, ctx) => {
      const questions = await getQuestions(difficulty, languages);

      const seed = ctx.cookies.get("prng-seed")?.number() ?? Date.now();
      ctx.cookies.set("prng-seed", seed.toString(), {
        httpOnly: true,
        path: "/",
      });

      const questionShuffle = createShuffle(seed);
      const shuffledQuestions = questionShuffle(questions);
      const question = shuffledQuestions[index - 1];

      const answer = question.translation;
      const allAnswers = await getAnswers(difficulty);
      allAnswers.delete(answer);

      const answerShuffle = createShuffle(seed + index);
      const otherAnswers = answerShuffle([...allAnswers]).slice(0, 3);
      const answers = answerShuffle([answer, ...otherAnswers]);
      const correct = answers.indexOf(answer);

      return <Question>{
        ...question,
        answers: { all: answers, correct },
        level: { current: index, total: questions.length },
      };
    },
  }),
};
