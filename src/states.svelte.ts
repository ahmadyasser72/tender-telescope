import type { GameState } from "./types";
import { isBrowser } from "./utils";

const STORAGE_KEY = "game-state-v1";

let initialState: GameState = {
  volume: 100,
  difficulty: undefined,
  languages: [],
};

if (isBrowser) {
  const localState = localStorage.getItem(STORAGE_KEY);
  if (localState) initialState = JSON.parse(localState);
}

export const gameState = $state<GameState>(initialState);

if (isBrowser) {
  $effect.root(() => {
    $effect(() => localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState)));
  });
}
