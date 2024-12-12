import { gamePreferences } from "./game.svelte";

import beepMP3 from "$lib/assets/audio/beep.mp3";
import bgmMP3 from "$lib/assets/audio/bgm.mp3";
import correctAnswerMP3 from "$lib/assets/audio/correct-answer.mp3";
import wrongAnswerMP3 from "$lib/assets/audio/wrong-answer.mp3";
import { isBrowser, sleep } from "$lib/utils";

export const createAudio = (src: string, volumeRatio = 1) => {
  const audio = (isBrowser && new Audio(src)) as HTMLAudioElement;

  const volume = $derived(gamePreferences.volume * volumeRatio);
  const play = async () => {
    audio.muted = volume === 0;
    audio.volume = volume / 100;
    if (!audio.muted) {
      try {
        await audio.play();

        if (src !== bgmMP3) {
          const bgmVolume = bgm.raw.volume;
          bgm.raw.volume *= 1 / 3;
          audio.addEventListener(
            "ended",
            () => sleep(200).then(() => (bgm.raw.volume = bgmVolume)),
            {
              once: true,
            },
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

  return { raw: audio, play, playForced };
};

export const beep = createAudio(beepMP3);
export const correctAnswer = createAudio(correctAnswerMP3);
export const wrongAnswer = createAudio(wrongAnswerMP3);

export const bgm = createAudio(bgmMP3, 1 / 3);
