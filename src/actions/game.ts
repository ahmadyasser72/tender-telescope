import { getCookie, setCookie } from "./utils";

import type { Difficulty } from "$lib/types";

import { ActionError, defineAction } from "astro:actions";
import { z } from "astro:schema";

export const game = {
  initialize: defineAction({
    input: z.object({
      difficulty: z.enum(["pemula", "menengah", "mahir"]),
      languages: z.array(z.string()),
    }),
    handler: ({ difficulty, languages }, context) => {
      setCookie(context, "game-difficulty", difficulty);
      setCookie(context, "game-languages", languages.join("|"));
    },
  }),
  getPreferences: defineAction({
    handler: (_, context) => {
      const difficulty = getCookie(context, "game-difficulty")?.value;
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

      const languages = getCookie(context, "game-languages")?.value.split("|");
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
