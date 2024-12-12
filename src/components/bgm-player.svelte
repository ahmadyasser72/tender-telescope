<script lang="ts">
  import { bgm } from "$lib/states/audio.svelte";
  import { gamePreferences } from "$lib/states/game.svelte";

  const loopBgm = async () => {
    if (await bgm.play()) {
      bgm.raw.addEventListener("ended", () => loopBgm(), { once: true });
    }
  };

  $effect(() => {
    gamePreferences.volume;
    loopBgm();
  });
</script>
