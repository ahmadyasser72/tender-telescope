<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import * as Dialog from "$lib/components/ui/dialog";
  import { gameState, gotoNextLevel } from "$lib/states.svelte";
  import type { Answer, Question } from "$lib/types";

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
    gameState.level.current < gameState.level.total,
  );

  const correctAnswer = $derived(answer.choices[answer.correct]);
  const isCorrect = $derived(choice === correctAnswer);
  const title = $derived.by(() => {
    if (choice === undefined) return "Habis waktu!";
    else return isCorrect ? "Jawaban benar!" : "Jawaban salah!";
  });
</script>

<Dialog.Root bind:open>
  <Dialog.Content
    escapeKeydownBehavior="ignore"
    interactOutsideBehavior="ignore"
  >
    <Dialog.Header>
      <Dialog.Title class="text-2xl">{title}</Dialog.Title>
      <Dialog.Description class="text-base">
        {#if isCorrect || choice === undefined}
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
          onclick={async () => {
            open = false;
            await gotoNextLevel();
          }}>Level selanjutnya</Button
        >
      {/if}
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
