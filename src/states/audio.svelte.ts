import { game } from "./game.svelte";

import { isBrowser, sleep } from "$lib/utils";

export class GameAudio {
  raw = (isBrowser && new Audio()) as HTMLAudioElement;
  src: string | (() => Promise<typeof import("*.webm")>);

  volumeRatio = $state(1);
  volume = $derived((game.preferences.volume * this.volumeRatio) / 100);

  constructor(src: typeof this.src) {
    this.src = src;
  }

  async initialize() {
    if (this.raw.src === "") {
      this.raw.src =
        typeof this.src === "function" ? (await this.src()).default : this.src;

      if (this.raw.src.includes("bgm")) this.volumeRatio = 1 / 3;
    }
  }

  async play() {
    await this.initialize();

    this.raw.muted = this.volume === 0;
    this.raw.volume = this.volume;
    if (!this.raw.muted) {
      await this.raw.play();

      if (bgm !== undefined && this.src !== bgm.src) {
        bgm.raw.volume = bgm.volume / 3;
        this.raw.addEventListener(
          "ended",
          () => sleep(50).then(() => (bgm.raw.volume = bgm.volume)),
          { once: true },
        );
      }
    }

    return !this.raw.muted;
  }

  async playForced() {
    this.raw.pause();
    this.raw.currentTime = 0;
    return this.play();
  }
}

export const beep = new GameAudio(() => import("$lib/assets/audio/beep.webm"));
export const complete = new GameAudio(
  () => import("$lib/assets/audio/complete.webm"),
);
export const correctAnswer = new GameAudio(
  () => import("$lib/assets/audio/correct-answer.webm"),
);
export const wrongAnswer = new GameAudio(
  () => import("$lib/assets/audio/wrong-answer.webm"),
);

export const bgm = new GameAudio(() => import("$lib/assets/audio/bgm.webm"));
