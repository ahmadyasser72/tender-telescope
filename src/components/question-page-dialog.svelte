<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import * as Dialog from "$lib/components/ui/dialog";
  import type { Question } from "$lib/types";

  import { navigate } from "astro:transitions/client";

  interface Props {
    open: boolean;
    answer: string;
    question: Question;
  }

  let {
    open = $bindable(false),
    answer = $bindable(),
    question,
  }: Props = $props();

  const nextLevel = $derived(
    question.level.current < question.level.total
      ? question.level.current + 1
      : undefined,
  );
  const correctAnswer = $derived(
    question.answers.all[question.answers.correct],
  );
  const isCorrect = $derived(answer === correctAnswer);
  const title = $derived(isCorrect ? "Jawaban benar!" : "Jawaban salah!");
</script>

<Dialog.Root bind:open>
  <Dialog.Content
    escapeKeydownBehavior="ignore"
    interactOutsideBehavior="ignore"
  >
    <Dialog.Header>
      <Dialog.Title class="text-2xl">{title}</Dialog.Title>
      <Dialog.Description class="text-base">
        {#if isCorrect}
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
            {answer}
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
      {#if nextLevel !== undefined}
        <Button
          onclick={() =>
            navigate(`/question/${nextLevel}`, { history: "replace" })}
          >Level selanjutnya</Button
        >
      {/if}
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
