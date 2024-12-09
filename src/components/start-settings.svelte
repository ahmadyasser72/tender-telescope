<script lang="ts">
  import SelectBahasa from "./select-bahasa.svelte";
  import SelectKesulitan from "./select-kesulitan.svelte";
  import SliderVolume from "./slider-volume.svelte";

  import { Button } from "$lib/components/ui/button";
  import { gamePreferences } from "$lib/states.svelte";
  import type { Difficulty, Language } from "$lib/types";

  import { actions } from "astro:actions";
  import { navigate } from "astro:transitions/client";

  import { toast } from "svelte-sonner";

  interface Props {
    choices: {
      difficulties: Difficulty[];
      languages: Language[];
    };
    levelCountMap: Map<string, number>;
  }

  const { choices, levelCountMap }: Props = $props();

  const { difficulty, languages } = $derived(gamePreferences);

  const levelCount = $derived(
    difficulty && languages.length > 0
      ? levelCountMap.get([difficulty, ...languages.slice().sort()].join("-"))!
      : "-",
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

<div class="flex grid-flow-dense grid-cols-3 flex-col gap-4 sm:grid">
  <div class="col-span-full gap-2 sm:mx-4">
    <span class="text-muted-foreground">Volume ({gamePreferences.volume}%)</span
    >
    <SliderVolume bind:volume={gamePreferences.volume} />
  </div>

  <div class="col-span-2">
    <SelectKesulitan
      bind:difficulty={gamePreferences.difficulty}
      choices={choices.difficulties}
    />
  </div>

  <div class="col-span-2">
    <SelectBahasa
      bind:languages={gamePreferences.languages}
      choices={choices.languages}
    />
  </div>

  <Button onclick={start} class="row-span-2 h-full text-xl sm:w-32 sm:text-2xl">
    Mulai <br class="hidden sm:block" />
    Game
  </Button>

  <div class="col-span-2 text-end max-sm:hidden">Jumlah level :</div>
  <div class="inline-flex items-center max-sm:justify-center">
    <span class="mr-1 sm:hidden">Jumlah level :</span>
    <span class:underline={levelCount !== "-"} class="font-semibold">
      {levelCount}
    </span>
  </div>
</div>
