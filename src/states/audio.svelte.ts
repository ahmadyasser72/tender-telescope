import { gamePreferences } from "./game.svelte";

import beepWebm from "$lib/assets/audio/beep.webm";
import bgmWebm from "$lib/assets/audio/bgm.webm";
import correctAnswerWebm from "$lib/assets/audio/correct-answer.webm";
import wrongAnswerWebm from "$lib/assets/audio/wrong-answer.webm";
import { isBrowser, sleep } from "$lib/utils";

export const createAudio = (src: string, volumeRatio = 1) => {
  const audio = (isBrowser && new Audio(src)) as HTMLAudioElement;

  const volume = $derived((gamePreferences.volume * volumeRatio) / 100);
  const play = async () => {
    audio.muted = volume === 0;
    audio.volume = volume;
    if (!audio.muted) {
      try {
        audio.play();

        if (src !== bgmWebm) {
          bgm.raw.volume = bgm.volume / 3;
          audio.addEventListener(
            "ended",
            () => sleep(100).then(() => (bgm.raw.volume = bgm.volume)),
            { once: true },
          );
        }
      } catch {
        return false;
      }
    }

    return !audio.muted;
  };

  const playForced = async () => {
    audio.pause();
    audio.currentTime = 0;
    return play();
  };

  return { raw: audio, volume, play, playForced };
};

export const beep = createAudio(beepWebm);
export const correctAnswer = createAudio(correctAnswerWebm);
export const wrongAnswer = createAudio(wrongAnswerWebm);

export const bgm = createAudio(bgmWebm, 1 / 3);
