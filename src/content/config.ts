import { defineCollection, z } from "astro:content";

const questionCollection = defineCollection({
  type: "data",
  schema: z.object({
    image: z.string().url(),
    translation: z.string(),
    sourceWord: z.string(),
    difficulty: z.enum(["pemula", "menengah", "mahir"]),
  }),
});

export const collections = { questions: questionCollection };
