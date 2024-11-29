import type { ActionAPIContext } from "astro:actions";

type KnownCookieName = "game-prng-seed" | "game-difficulty" | "game-languages";

export const getCookie = (context: ActionAPIContext, key: KnownCookieName) =>
  context.cookies.get(key);

export const setCookie = (
  context: ActionAPIContext,
  key: KnownCookieName,
  value: string,
) =>
  context.cookies.set(key, value, {
    httpOnly: true,
    path: "/",
    sameSite: true,
  });
