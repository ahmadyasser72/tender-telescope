import { defineAction } from "astro:actions";
import { z } from "astro:schema";

export const game = {
  initialize: defineAction({
    input: z.object({
      difficulty: z.enum(["pemula", "menengah", "mahir"]),
      languages: z.array(z.string()),
    }),
    handler: ({ difficulty, languages }, ctx) => {
      ctx.cookies.set("game-difficulty", difficulty, {
        httpOnly: true,
        path: "/",
      });
      ctx.cookies.set("game-languages", languages.join("|"), {
        httpOnly: true,
        path: "/",
      });
    },
  }),
};
