<script lang="ts">
  import { bgm } from "$lib/states/audio.svelte";
  import { gamePreferences } from "$lib/states/game.svelte";

  import { onMount } from "svelte";

  const reset = () => {
    bgm.raw.pause();
    bgm.raw.currentTime = 0;
  };

  let bgmLooped = $state(false);
  const loop = async () => {
    if (await bgm.play())
      bgm.raw.addEventListener("ended", () => loop(), { once: true });
    else {
      reset();
    }
  };

  $effect(() => {
    gamePreferences.volume;
    // loop ulang untuk menyesuaikan volume
    if (bgmLooped) loop();
  });

  onMount(() => {
    let attempt = 1;
    const loopHandle = setInterval(async () => {
      try {
        await loop();
        bgmLooped = true;
        clearInterval(loopHandle);
      } catch {
        console.log(`failed to play bgm #${attempt++}`);
      }
    }, 1000);

    return () => {
      clearInterval(loopHandle);
      reset();
    };
  });
</script>
