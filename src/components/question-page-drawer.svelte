<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import * as Drawer from "$lib/components/ui/drawer";
  import { game, initializeGame } from "$lib/states/game.svelte";
  import type { Difficulty } from "$lib/types";

  interface Props {
    open: boolean;
  }

  let { open = $bindable() }: Props = $props();

  const nextDifficulty = $derived.by((): Difficulty | undefined => {
    const { difficulty } = game.preferences;
    if (difficulty === "pemula") return "menengah";
    else if (difficulty === "menengah") return "mahir";
  });
  const isLastDifficulty = $derived(nextDifficulty === undefined);
  const description = $derived(
    isLastDifficulty
      ? "Kamu telah menyelesaikan perjalanan belajar bahasa Inggris kami!\nKamu telah membuktikan diri sebagai ahli bahasa Inggris!"
      : "Kamu telah mencapai puncak kesuksesan dalam belajar bahasa Inggris!\nApakah kamu siap untuk menghadapi tantangan lebih tinggi?",
  );
</script>

<Drawer.Root bind:open dismissible={false}>
  <Drawer.Content
    escapeKeydownBehavior="ignore"
    interactOutsideBehavior="ignore"
  >
    <Drawer.Header>
      <Drawer.Title class="text-center"
        >Selamat! tingkat {game.preferences.difficulty} selesai!</Drawer.Title
      >
      <Drawer.Description class="text-center sm:whitespace-pre-line"
        >{description}</Drawer.Description
      >
    </Drawer.Header>
    <Drawer.Footer>
      {#if isLastDifficulty}
        <Button href="/">Kembali ke menu awal</Button>
      {:else}
        <Button
          onclick={() => {
            open = false;
            game.preferences.difficulty = nextDifficulty;
            initializeGame(false);
          }}>Baiklah! (menuju tingkat {nextDifficulty})</Button
        >
        <Button href="/" variant="outline">Tidak, terima kasih</Button>
      {/if}
    </Drawer.Footer>
  </Drawer.Content>
</Drawer.Root>
