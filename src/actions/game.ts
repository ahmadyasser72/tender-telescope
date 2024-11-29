import type { Difficulty } from "$lib/types";
import { ActionError, defineAction } from "astro:actions";
import { z } from "astro:schema";

const difficultyCookie = "game-difficulty";
const langaugesCookie = "game-languages";

export const game = {
  initialize: defineAction({
    input: z.object({
      difficulty: z.enum(["pemula", "menengah", "mahir"]),
      languages: z.array(z.string()),
    }),
    handler: ({ difficulty, languages }, ctx) => {
      ctx.cookies.set(difficultyCookie, difficulty, {
        httpOnly: true,
        path: "/",
      });
      ctx.cookies.set(langaugesCookie, languages.join("|"), {
        httpOnly: true,
        path: "/",
      });
    },
  }),
  getPreferences: defineAction({
    handler: (_, ctx) => {
      const difficulty = ctx.cookies.get(difficultyCookie)?.value;
      if (
        difficulty !== "pemula" &&
        difficulty !== "menengah" &&
        difficulty !== "mahir"
      ) {
        throw new ActionError({
          message: "Tingkat kesulitan tidak valid!",
          code: "BAD_REQUEST",
        });
      }

      const languages = ctx.cookies.get(langaugesCookie)?.value.split("|");
      if (languages === undefined || languages.length === 0) {
        throw new ActionError({
          message: "Bahasa tidak valid!",
          code: "BAD_REQUEST",
        });
      }

      return { difficulty: <Difficulty>difficulty, languages };
    },
  }),
};
