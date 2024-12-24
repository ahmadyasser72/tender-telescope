<script lang="ts">
  import { bgm } from "$lib/states/audio.svelte";
  import { game } from "$lib/states/game.svelte";

  import { onMount } from "svelte";

  let isReset = $state(false);
  const reset = () => {
    isReset = true;
    bgm.raw.pause();
    bgm.raw.currentTime = 0;
  };

  $effect(() => {
    if (isReset && game.preferences.volume > 0) loop();
    else if (game.preferences.volume === 0) reset();
  });

  const loop = async () => {
    if (await bgm.play()) {
      bgm.raw.addEventListener("ended", loop);
    } else {
      reset();
    }
  };

  onMount(() => {
    let attempt = 1;
    const tryLoopHandle = setInterval(async () => {
      try {
        await loop();
        clearInterval(tryLoopHandle);
      } catch {
        console.log(`failed to play bgm #${attempt++}`);
      }
    }, 1000);

    return () => {
      bgm.raw.removeEventListener("ended", loop);
      clearInterval(tryLoopHandle);
      reset();
    };
  });
</script>
