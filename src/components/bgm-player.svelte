<script lang="ts">
  import { bgm } from "$lib/states/audio.svelte";
  import { gamePreferences } from "$lib/states/game.svelte";

  import { onDestroy } from "svelte";

  const reset = () => {
    bgm.raw.pause();
    bgm.raw.currentTime = 0;
  };

  const loop = async () => {
    if (await bgm.play())
      bgm.raw.addEventListener("ended", () => loop(), { once: true });
    else {
      reset();
    }
  };

  $effect(() => {
    gamePreferences.volume;
    loop();
  });

  onDestroy(() => reset());
</script>
