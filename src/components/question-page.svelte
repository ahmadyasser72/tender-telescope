<script lang="ts">
  import QuestionPageDialog from "./question-page-dialog.svelte";

  import { Button } from "$lib/components/ui/button";
  import * as Card from "$lib/components/ui/card";
  import type { Question } from "$lib/types";
  import { cn, sleep } from "$lib/utils";
  import { correctAnswer, wrongAnswer } from "$lib/utils.sound.svelte";

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
    const correct = answers.correct === choice;
    if (!correct) highlightWrongAnswerIndex = choice;

    const audio = correct ? correctAnswer : wrongAnswer;
    await tick();

    if (audio.play()) {
      audio.raw.addEventListener("ended", async () => {
        await sleep(100);
        dialogOpen = true;
      });
    } else {
      await sleep(1000);
      dialogOpen = true;
    }
  };
</script>

<QuestionPageDialog
  bind:open={dialogOpen}
  bind:answer={pickedAnswer}
  {question}
/>

<Card.Root class="min-w-full max-w-96 text-center sm:min-w-96">
  <Card.Header>
    <img
      class="h-48 object-cover"
      src="/question/{level.current}/image"
      alt="Gambar {question.sourceWord}"
    />
    <Card.Title class="text-4xl capitalize">{question.sourceWord}</Card.Title>
  </Card.Header>
  <Card.Footer></Card.Footer>
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
