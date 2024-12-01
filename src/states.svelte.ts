import type { GameState } from "./types";

export const gameState = $state<GameState>({
  volume: 100,
  difficulty: undefined,
  languages: [],
});
