import type { CollectionEntry } from "astro:content";

type QuestionEntry = CollectionEntry<"questions">;
type QuestionRaw = QuestionEntry["data"]["items"][number];

export interface Question extends QuestionRaw {
  code: string; // language code (e.g en-us, id-id)
  language: Language;
}

export interface Answer {
  choices: string[];
  correct: number;
}

export interface Level {
  current: number;
  total: number;
}

export type Difficulty = QuestionRaw["difficulty"];
export type Language = QuestionEntry["id"];

export interface GamePreferences {
  volume: number;
  difficulty?: Difficulty;
  languages: Language[];
  seed: number;
}

export interface GameState {
  level: Level;
}
