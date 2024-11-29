import { defineCollection, reference, z } from "astro:content";

const answerCollection = defineCollection({
  type: "data",
  schema: z.object({
    difficulty: reference("answers"),
    items: z.array(z.string()),
  }),
});

const questionCollection = defineCollection({
  type: "data",
  schema: ({ image }) =>
    z.object({
      language: reference("questions"),
      items: z.array(
        z.object({
          image: image().nullable(),
          translation: z.string(),
          sourceWord: z.string(),
          difficulty: z.enum(["pemula", "menengah", "mahir"]),
        }),
      ),
    }),
});

export const collections = {
  answers: answerCollection,
  questions: questionCollection,
};
