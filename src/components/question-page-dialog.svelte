<script lang="ts">
  import QuestionPageDrawer from "./question-page-drawer.svelte";

  import { Badge } from "$lib/components/ui/badge";
  import { Button } from "$lib/components/ui/button";
  import * as Dialog from "$lib/components/ui/dialog";
  import { complete } from "$lib/states/audio.svelte";
  import {
    game,
    gameComputed,
    getScoreMultiplier,
    gotoNextLevel,
  } from "$lib/states/game.svelte";
  import type { Answer, Question } from "$lib/types";
  import { signedNumber } from "$lib/utils";

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
          {@const text = question.explained.replaceAll(".", ".\n\n")}
          <p class="whitespace-pre-line">{text}</p>
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
    <Dialog.Footer class="flex-col items-center max-sm:space-y-4">
      <p class="flex-1 font-semibold max-sm:text-center">
        <Badge variant={isCorrect ? "default" : "destructive"}>
          SCORE:
          {gameComputed.totalScore()}
          ({signedNumber(game.state.scores[game.state.level.current])})
        </Badge>

        {#if isCorrect}
          {@const multiplier = getScoreMultiplier()}
          <Badge>
            <span>COMBO: {gameComputed.getCombo()}</span>
            {#if multiplier > 1}
              <span class="ml-1">({multiplier}X)</span>
            {/if}
          </Badge>
        {/if}
      </p>

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
