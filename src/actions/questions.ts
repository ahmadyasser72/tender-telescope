import { getCookie, setCookie } from "./utils";

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
    handler: async ({ difficulty, languages }, context) => {
      const seed = getCookie(context, "game-prng-seed")?.number() ?? Date.now();
      setCookie(context, "game-prng-seed", seed.toString());

      const questions = await getQuestions(difficulty, languages, seed);
      return questions.length;
    },
  }),
  get: defineAction({
    input: z.object({
      index: z.number(),
      ...questionsFilter,
    }),
    handler: async ({ index, difficulty, languages }, context) => {
      const seed = getCookie(context, "game-prng-seed")?.number() ?? Date.now();
      setCookie(context, "game-prng-seed", seed.toString());

      const questions = await getQuestions(difficulty, languages, seed);
      const question = questions[index - 1];

      const correctAnswer = question.translation;
      const allAnswers = await getAnswers(difficulty);

      // hapus jawaban yang benar karena daftar jawaban ini akan diacak
      // jawaban benar akan ditambahkan setelah proses acak
      allAnswers.delete(correctAnswer);
      // hapus semua jawaban pertanyaan sebelumnya biar lebih menantang
      const previousQuestions = questions.slice(0, index - 1);
      for (const { translation } of previousQuestions)
        allAnswers.delete(translation);

      const answerShuffle = createShuffle(seed + index);
      const otherAnswers = answerShuffle([...allAnswers]).slice(0, 3);
      const answers = answerShuffle([correctAnswer, ...otherAnswers]);
      const correct = answers.indexOf(correctAnswer);

      return <Question>{
        ...question,
        answers: { all: answers, correct },
        level: { current: index, total: questions.length },
      };
    },
  }),
};
