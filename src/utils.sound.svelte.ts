import { gameState } from "./states.svelte";
import { isBrowser } from "./utils";

import beepMP3 from "$lib/assets/beep.mp3";
import correctAnswerMP3 from "$lib/assets/correct-answer.mp3";
import wrongAnswerMP3 from "$lib/assets/wrong-answer.mp3";

const createSound = (src: string) => {
  const audio = (isBrowser && new Audio(src)) as HTMLAudioElement;

  const play = () => {
    audio.muted = gameState.volume === 0;
    audio.volume = gameState.volume / 100;
    if (!audio.muted) audio.play();

    return !audio.muted;
  };

  const playForced = () => {
    audio.pause();
    audio.currentTime = 0;
    return play();
  };

  return { raw: audio, play, playForced };
};

export const beep = createSound(beepMP3);
export const correctAnswer = createSound(correctAnswerMP3);
export const wrongAnswer = createSound(wrongAnswerMP3);
