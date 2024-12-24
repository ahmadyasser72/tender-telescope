<script lang="ts">
  import QuestionPageDrawer from "./question-page-drawer.svelte";

  import { Button } from "$lib/components/ui/button";
  import * as Dialog from "$lib/components/ui/dialog";
  import { complete } from "$lib/states/audio.svelte";
  import { game, gotoNextLevel } from "$lib/states/game.svelte";
  import type { Answer, Question } from "$lib/types";

  import { tick } from "svelte";

  interface Props {
    open: boolean;
    choice?: string;
    answer: Answer;
    question: Question;
  }

  let {
    open = $bindable(false),
    choice = $bindable(),
    answer,
    question,
  }: Props = $props();

  const hasNextLevel = $derived(
    game.state.level.current < game.state.level.total,
  );

  const correctAnswer = $derived(answer.choices[answer.correct]);
  const isCorrect = $derived(choice === correctAnswer);
  const title = $derived.by(() => {
    if (choice === undefined) return "Habis waktu!";
    else return isCorrect ? "Jawaban benar!" : "Jawaban salah!";
  });

  let openDrawer = $state(false);
</script>

<QuestionPageDrawer bind:open={openDrawer} />

<Dialog.Root bind:open>
  <Dialog.Content
    escapeKeydownBehavior="ignore"
    interactOutsideBehavior="ignore"
  >
    <Dialog.Header>
      <Dialog.Title class="text-2xl">{title}</Dialog.Title>
      <Dialog.Description class="text-base">
        {#if isCorrect && question.explained !== undefined}
          {@const split = question.explained
            .split(".")
            .map((line) => line.trim())}
          {#each split as line}
            <p>{line}.</p>
          {/each}
        {:else if choice === undefined}
          Bahasa Indonesia dari kata
          <span class="font-semibold capitalize text-black underline">
            {question.sourceWord}
          </span>
          adalah
          <span class="font-semibold capitalize text-green-700 underline">
            {correctAnswer}
          </span>!
        {:else}
          Bahasa Indonesia dari kata
          <span class="font-semibold capitalize text-black underline">
            {question.sourceWord}
          </span>
          bukan
          <span class="font-semibold capitalize text-red-700 underline">
            {choice}
          </span>!

          <br />

          Jawaban yang benar adalah
          <span class="font-semibold capitalize text-green-700 underline">
            {correctAnswer}
          </span>.
        {/if}
      </Dialog.Description>
    </Dialog.Header>
    <Dialog.Footer>
      {#if hasNextLevel}
        <Button
          onclick={() => {
            open = false;
            tick().then(gotoNextLevel);
          }}>Level selanjutnya</Button
        >
      {:else}
        <Button
          onclick={async () => {
            open = false;
            await tick();
            const played = await complete.play();
            if (played)
              complete.raw.addEventListener("ended", () => (openDrawer = true));
            else openDrawer = true;
          }}>Selesai</Button
        >
      {/if}
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
