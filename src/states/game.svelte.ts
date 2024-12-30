import type { GamePreferences, GameState } from "$lib/types";
import { isBrowser, sumNumbers } from "$lib/utils";

import { navigate } from "astro:transitions/client";

const STORAGE_KEY = "data-v6";

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
    state: {
      level: { current: 0, total: 0 },
      scores: [],
    },
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
export const gameComputed = {
  totalScore: () => sumNumbers(game.state.scores),
  totalCorrect: () => game.state.scores.filter((it) => (it ?? 0) > 0).length,

  getCombo: () => {
    let combo = 0;
    for (const score of [...game.state.scores].reverse()) {
      if (score <= 0) break;
      else combo += 1;
    }

    return combo;
  },
  getMaxCombo: () => {
    let combo = 0;
    let maxCombo = 0;
    for (const score of [...game.state.scores].reverse()) {
      if (score <= 0) combo = 0;
      else maxCombo = Math.max(maxCombo, (combo += 1));
    }

    return maxCombo;
  },
};

if (isBrowser) {
  $effect.root(() => {
    $effect(() => localStorage.setItem(STORAGE_KEY, JSON.stringify(game)));
  });
}

export const calculateScore = (isCorrect: boolean, timeRemaining: number) => {
  const [correct, incorrect, timeBonusFactor] = getScoreValue();

  let score = 0;
  score += isCorrect ? correct : incorrect;
  if (isCorrect) {
    score += (timeRemaining / 1000) * timeBonusFactor;
    score *= getScoreMultiplier();
  }

  game.state.scores[game.state.level.current - 1] = Math.round(score);
};

const getScoreValue = () => {
  switch (game.preferences.difficulty) {
    case "pemula":
      return [10, -5, 1];
    case "menengah":
      return [30, -10, 4];
    case "mahir":
    default:
      return [50, -20, 10];
  }
};

export const getScoreMultiplier = () => {
  const combo = gameComputed.getCombo();
  if (combo < 3) return 1;

  let maxMultiplier = 1;
  switch (game.preferences.difficulty) {
    case "pemula":
      maxMultiplier = 1.5;
      break;
    case "menengah":
      maxMultiplier = 2;
      break;
    case "mahir":
      maxMultiplier = 3;
      break;
  }

  const multiplier = 1 + Math.floor(combo / 3) * 0.25;
  return Math.min(maxMultiplier, multiplier);
};

export const initializeGame = async (reload = true) => {
  game.preferences.seed = Date.now();
  game.state.level.current = 1;
  game.state.scores = [];

  if (reload) await navigate("/game");
};

export const gotoNextLevel = () => {
  game.state.level.current += 1;
};
