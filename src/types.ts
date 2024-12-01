import type { CollectionEntry } from "astro:content";

type QuestionEntry = CollectionEntry<"questions">;
type QuestionRaw = QuestionEntry["data"]["items"][number];

export interface Question extends QuestionRaw {
  language: Language;
  level: {
    current: number;
    total: number;
  };
  answers: {
    all: string[];
    correct: number;
  };
}

export type Difficulty = QuestionRaw["difficulty"];
export type Language = QuestionEntry["id"];

export interface GameState {
  volume: number;
  difficulty?: Difficulty;
  languages: Language[];
}
