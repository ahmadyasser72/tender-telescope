<script lang="ts">
  import SelectBahasa from "./select-bahasa.svelte";
  import SelectKesulitan from "./select-kesulitan.svelte";
  import SliderVolume from "./slider-volume.svelte";

  import { Button } from "$lib/components/ui/button";
  import { gameState } from "$lib/states.svelte";
  import type { Difficulty, Language } from "$lib/types";
  import { isBrowser } from "$lib/utils";

  import { actions } from "astro:actions";
  import { navigate } from "astro:transitions/client";

  import { toast } from "svelte-sonner";

  interface Props {
    choices: {
      difficulties: Difficulty[];
      languages: Language[];
    };
  }

  const { choices }: Props = $props();

  const { difficulty, languages } = $derived(gameState);

  const questionLength = $derived(
    isBrowser && difficulty && languages.length > 0
      ? actions.questions.size.orThrow({ difficulty, languages })
      : Promise.resolve("-"),
  );

  const start = async () => {
    if (difficulty === undefined) {
      toast.error("Tingkat kesulitan belum dipilih!");
      return;
    } else if (languages.length === 0) {
      toast.error("Pilih bahasa asing terlebih dahulu!");
      return;
    }

    await actions.game.initialize.orThrow({
      difficulty: difficulty,
      languages: languages,
    });

    navigate("/question/1");
  };
</script>

<div class="mt-8 grid grid-cols-3 gap-4">
  <div class="col-span-full gap-2 sm:mx-4">
    <span class="text-muted-foreground">Volume ({gameState.volume}%)</span>
    <SliderVolume bind:volume={gameState.volume} />
  </div>
  <div class="col-span-2">
    <SelectKesulitan
      bind:difficulty={gameState.difficulty}
      choices={choices.difficulties}
    />
  </div>
  <Button onclick={start} class="row-span-2 h-auto text-xl sm:text-2xl">
    Mulai <br />
    Game
  </Button>
  <div class="col-span-2">
    <SelectBahasa
      bind:languages={gameState.languages}
      choices={choices.languages}
    />
  </div>
</div>

<p class="text-center leading-7 [&:not(:first-child)]:mt-6">
  Jumlah level :
  <span>
    {#await questionLength}
      loading...
    {:then length}
      {length}
    {/await}
  </span>
</p>
