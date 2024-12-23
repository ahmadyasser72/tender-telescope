import type { GamePreferences, GameState } from "$lib/types";
import { isBrowser } from "$lib/utils";

import { navigate } from "astro:transitions/client";

const STORAGE_KEY = "data-v3";

const initial = {
  state: {
    level: { current: 0, total: 0 },
  } satisfies GameState,
  preferences: {
    volume: 100,
    difficulty: undefined,
    languages: ["inggris"],
    seed: 0,
  } satisfies GamePreferences,
};

if (isBrowser) {
  const data = localStorage.getItem(STORAGE_KEY);
  if (data) Object.assign(initial, JSON.parse(data));
}

export const gameState = $state<GameState>(initial.state);
export const gamePreferences = $state<GamePreferences>(initial.preferences);

if (isBrowser) {
  $effect.root(() => {
    $effect(() =>
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          state: gameState,
          preferences: gamePreferences,
        }),
      ),
    );
  });
}

export const initializeGame = async () => {
  gamePreferences.seed = Date.now();
  gameState.level.current = 1;

  await navigate(`/game?t=${Date.now()}`);
};

export const gotoNextLevel = async () => {
  document.addEventListener(
    "astro:page-load",
    () => (gameState.level.current += 1),
    { once: true },
  );

  await navigate(`/game?t=${Date.now()}`, { history: "replace" });
};

