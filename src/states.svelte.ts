import type { GamePreferences } from "./types";
import { isBrowser } from "./utils";

const STORAGE_KEY = "game-preferences-v1";

let initialState: GamePreferences = {
  volume: 100,
  difficulty: undefined,
  languages: [],
};

if (isBrowser) {
  const localState = localStorage.getItem(STORAGE_KEY);
  if (localState) initialState = JSON.parse(localState);
}

export const gamePreferences = $state<GamePreferences>(initialState);

if (isBrowser) {
  $effect.root(() => {
    $effect(() =>
      localStorage.setItem(STORAGE_KEY, JSON.stringify(gamePreferences)),
    );
  });
}
