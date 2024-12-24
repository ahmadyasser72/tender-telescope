import type { GamePreferences, GameState } from "$lib/types";
import { isBrowser } from "$lib/utils";

import { navigate } from "astro:transitions/client";

const STORAGE_KEY = "data-v5";

interface Game {
  state: GameState;
  preferences: GamePreferences;
}

const initializeGameData = (): Game => {
  if (isBrowser) {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) return JSON.parse(data);
  }

  return {
    state: { level: { current: 0, total: 0 } },
    preferences: {
      autoplayTTS: true,
      volume: 100,
      difficulty: undefined,
      languages: ["inggris"],
      seed: 0,
    },
  };
};

export const game = $state(initializeGameData());

if (isBrowser) {
  $effect.root(() => {
    $effect(() => localStorage.setItem(STORAGE_KEY, JSON.stringify(game)));
  });
}

export const initializeGame = async () => {
  game.preferences.seed = Date.now();
  game.state.level.current = 1;

  await navigate("/game");
};

export const gotoNextLevel = () => {
  game.state.level.current += 1;
};
