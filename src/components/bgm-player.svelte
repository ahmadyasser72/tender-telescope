<script lang="ts">
  import { bgm } from "$lib/states/audio.svelte";

  import { onMount } from "svelte";

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
      clearInterval(tryLoopHandle);
      reset();
    };
  });
</script>
