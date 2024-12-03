import type { Question } from "$lib/types";
import { getAnswers, getQuestions } from "$lib/utils.content";

import { defineAction } from "astro:actions";
import { z } from "astro:schema";

import { createShuffle } from "fast-shuffle";

const gamePreferences = {
  difficulty: z.enum(["pemula", "menengah", "mahir"]),
  languages: z.array(z.string()),
};

export const questions = {
  size: defineAction({
    input: z.object(gamePreferences),
    handler: async ({ difficulty, languages }) => {
      const questions = await getQuestions(difficulty, languages, 0);
      return questions.length;
    },
  }),
  get: defineAction({
    input: z.object({
      index: z.number(),
      seed: z.number(),
      ...gamePreferences,
    }),
    handler: async ({ index, difficulty, languages, seed }) => {
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
