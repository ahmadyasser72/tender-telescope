<script lang="ts">
  import SelectBahasa from "./select-bahasa.svelte";
  import SelectKesulitan from "./select-kesulitan.svelte";

  import { Button } from "$lib/components/ui/button";
  import type { Difficulty } from "$lib/types";

  import { actions } from "astro:actions";
  import { navigate } from "astro:transitions/client";

  import { toast } from "svelte-sonner";

  interface Props {
    choices: {
      languages: string[];
      difficulties: Difficulty[];
    };
  }

  const { choices }: Props = $props();

  let bahasa = $state<string[]>([]);
  let kesulitan = $state<Difficulty>();

  const start = async () => {
    if (!kesulitan) {
      toast.error("Tingkat kesulitan belum dipilih!");
      return;
    } else if (bahasa.length === 0) {
      toast.error("Pilih bahasa asing terlebih dahulu!");
      return;
    }

    await actions.game.initialize.orThrow({
      difficulty: kesulitan,
      languages: bahasa,
    });

    await navigate("/question/1");
    window.location.reload();
  };
</script>

<div class="mt-8 grid grid-cols-3 gap-4">
  <div class="col-span-2">
    <SelectKesulitan bind:kesulitan choices={choices.difficulties} />
  </div>
  <Button onclick={start} class="row-span-2 h-auto text-xl sm:text-2xl">
    Mulai <br />
    Game
  </Button>
  <div class="col-span-2">
    <SelectBahasa bind:bahasa choices={choices.languages} />
  </div>
</div>
