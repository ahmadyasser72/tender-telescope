import type { CollectionEntry } from "astro:content";

type QuestionRaw = CollectionEntry<"questions">["data"];
export interface Question extends QuestionRaw {
  language: string;
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
