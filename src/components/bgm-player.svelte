<script lang="ts">
  import { gamePreferences } from "$lib/states.svelte";
  import { bgm } from "$lib/utils.sound.svelte";

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
