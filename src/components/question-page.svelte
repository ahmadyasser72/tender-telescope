<script lang="ts">
  import * as Card from "$lib/components/ui/card";
  import { Button } from "$lib/components/ui/button";
  import type { Question } from "$lib/types";
  import { toast } from "svelte-sonner";
  import QuestionPageDialog from "./question-page-dialog.svelte";
  import { cn, sleep } from "$lib/utils";
  import { tick } from "svelte";

  interface Props {
    question: Question;
  }

  const { question }: Props = $props();
  const { answers, level } = $derived(question);

  let dialogOpen = $state(false);
  let pickedAnswer = $state("");
  let highlightCorrectAnswer = $state(false);
  let highlightWrongAnswerIndex = $state(-1);
  const checkAnswer = async (choice: number) => {
    pickedAnswer = answers.all[choice];
    highlightCorrectAnswer = true;
    if (answers.correct !== choice) highlightWrongAnswerIndex = choice;
    await tick();
    await sleep(1000);

    dialogOpen = true;
  };
</script>

{#if !import.meta.env.SSR}
  <QuestionPageDialog
    bind:open={dialogOpen}
    bind:answer={pickedAnswer}
    {question}
  />
{/if}

<Card.Root class="min-w-full text-center sm:min-w-96">
  <Card.Header>
    <img
      class="h-48 object-cover"
      src="https://placehold.co/600x800/EEE/31343C"
      alt={question.sourceWord}
    />
  </Card.Header>
  <Card.Content>
    <Card.Title class="text-4xl capitalize">{question.sourceWord}</Card.Title>
    <Card.Description class="text-base capitalize">
      [{level.current}/{level.total}] [{question.language}
      {question.difficulty}]
    </Card.Description>
  </Card.Content>
</Card.Root>

<div class="grid grid-cols-2 gap-4 py-8 md:gap-8 md:px-12">
  {#each answers.all as answer, idx}
    <Button
      onclick={() => checkAnswer(idx)}
      class={cn(
        "capitalize",
        highlightCorrectAnswer &&
          (idx === answers.correct ? "!bg-green-500" : "opacity-0"),
        highlightWrongAnswerIndex === idx && "!bg-red-500 opacity-100",
        pickedAnswer !== "" && "pointer-events-none",
      )}
      size="big"
    >
      {answer}
    </Button>
  {/each}
</div>
