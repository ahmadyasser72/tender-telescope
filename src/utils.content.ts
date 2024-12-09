import type {
  Answer,
  Difficulty,
  GamePreferences,
  GameState,
  Language,
  Question,
} from "./types";
import type { getAnswers, getQuestions } from "./utils.server";

import { createShuffle } from "fast-shuffle";

export const filterQuestions = (
  questions: Awaited<ReturnType<typeof getQuestions>>,
  difficulty?: Difficulty,
  languages?: Language[],
): Question[][] => {
  return questions
    .filter(
      ([it]) =>
        languages === undefined ||
        languages.length === 0 ||
        languages.some((language) => language === it),
    )
    .map(([_, items]) =>
      items.filter(
        (it) =>
          (difficulty || undefined) === undefined ||
          it.difficulty === difficulty,
      ),
    );
};

export const shuffleQuestions = (
  questions: ReturnType<typeof filterQuestions>,
  seed: number = 0,
): Question[] => {
  const questionsShuffle =
    seed === 0
      ? <T>(it: T) => it // noop bila seed 0
      : createShuffle(seed);

  const languagesCount = questions.length;
  if (languagesCount === 1) return questionsShuffle(questions[0]);

  const questionsCount = Math.min(...questions.map((items) => items.length));
  return questionsShuffle(
    questionsShuffle(
      Array.from({ length: questionsCount }, (_, idx) => idx % languagesCount),
    ).map((languageIdx, questionIdx) => questions[languageIdx][questionIdx]),
  );
};

export const processQuestions = (
  questions: Awaited<ReturnType<typeof getQuestions>>,
  preferences: Partial<
    Pick<GamePreferences, "difficulty" | "languages" | "seed">
  >,
): Question[] => {
  const filtered = filterQuestions(
    questions,
    preferences.difficulty,
    preferences.languages,
  );

  return shuffleQuestions(filtered, preferences.seed);
};

export const processAnswer = (
  answerMap: Awaited<ReturnType<typeof getAnswers>>,
  question: Question,
  preferences: Pick<GamePreferences, "seed">,
  state: Pick<GameState, "level">,
): Answer => {
  const correctAnswer = question.translation;
  const allAnswers = new Set([...answerMap.get(question.difficulty)!]);
  allAnswers.delete(correctAnswer);

  const answerShuffle = createShuffle(preferences.seed + state.level.current);
  const otherAnswers = answerShuffle([...allAnswers]).slice(0, 3);
  const choices = answerShuffle([correctAnswer, ...otherAnswers]);
  const correct = choices.indexOf(correctAnswer);

  return { choices, correct };
};
