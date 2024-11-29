import { defineCollection, reference, z } from "astro:content";

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

export const collections = { questions: questionCollection };
