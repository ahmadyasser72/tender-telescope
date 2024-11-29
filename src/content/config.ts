import { defineCollection, z } from "astro:content";

const questionCollection = defineCollection({
  type: "data",
  schema: z.object({
    image: z
      .string()
      // regex validasi path file gambar
      .regex(/^\/(?:[\w\-. ]+\/)*[\w\-. ]+\.(?:jpg|jpeg|png|webp)$/)
      // bila null berarti menggunakan gambar dari API Pixabay
      .nullable(),
    translation: z.string(),
    sourceWord: z.string(),
    difficulty: z.enum(["pemula", "menengah", "mahir"]),
  }),
});

export const collections = { questions: questionCollection };
