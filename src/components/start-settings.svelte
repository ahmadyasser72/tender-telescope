<script lang="ts">
  import SelectBahasa from "./select-bahasa.svelte";
  import SelectKesulitan from "./select-kesulitan.svelte";

  import { Button } from "$lib/components/ui/button";
  import { Slider } from "$lib/components/ui/slider";
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

  let volume = $state([gameState.volume * 100]);
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

    gameState.volume = volume[0] / 100;
    navigate("/question/1");
  };
</script>

<div class="mt-8 grid grid-cols-3 gap-4">
  <div class="col-span-full mx-4 my-2">
    <span class="text-muted-foreground">Volume ({volume[0]}%)</span>
    <Slider bind:value={volume} min={0} max={100} step={5} class="mt-2" />
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
