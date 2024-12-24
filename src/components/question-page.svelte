<script lang="ts">
  import QuestionPageDialog from "./question-page-dialog.svelte";

  import { Badge } from "$lib/components/ui/badge";
  import { Button } from "$lib/components/ui/button";
  import * as Card from "$lib/components/ui/card";
  import {
    correctAnswer,
    GameAudio,
    wrongAnswer,
  } from "$lib/states/audio.svelte";
  import { game } from "$lib/states/game.svelte";
  import type { Answer, Question } from "$lib/types";
  import { cn, padNumber, sleep } from "$lib/utils";

  import { Play } from "lucide-svelte";
  import { onMount } from "svelte";
  import { toast } from "svelte-sonner";

  interface Props {
    answer: Answer;
    question: Question;
  }

  const { answer, question }: Props = $props();

  let ttsAudio = $state<GameAudio>();
  let ttsPlaying = $state(false);
  const initTTS = () =>
    (ttsAudio ??= new GameAudio(
      `/generated/${question.language}/${question.id}.mp3`,
    ));
  const playTTS = async () => {
    ttsPlaying = true;
    ttsAudio ??= initTTS();

    if (await ttsAudio.play()) {
      ttsAudio.raw.addEventListener(
        "ended",
        () => {
          ttsPlaying = false;
        },
        { once: true },
      );
    } else {
      toast.error("Tidak bisa memutar TTS karena volume 0!");
      ttsPlaying = false;
    }
  };

  let dialogOpen = $state(false);
  let pickedAnswer = $state<string>();
  let highlightCorrectAnswer = $state(false);
  let highlightWrongAnswer = $state<number | true>();
  const checkAnswer = async (choice: number, timeout = false) => {
    pickedAnswer = answer.choices[choice];
    highlightCorrectAnswer = true;
    const correct = answer.correct === choice;
    if (!correct) highlightWrongAnswer = timeout || choice;

    const audio = correct ? correctAnswer : wrongAnswer;

    ttsAudio?.raw.pause();
    if (await audio.play()) {
      audio.raw.addEventListener(
        "ended",
        async () => {
          await sleep(100);
          dialogOpen = true;
        },
        { once: true },
      );
    } else {
      await sleep(1000);
      dialogOpen = true;
    }
  };

  const initialTimer = $derived.by(() => {
    switch (question.difficulty) {
      case "pemula":
        return 90_000;
      case "menengah":
        return 30_000;
      case "mahir":
        return 10_000;
    }
  });

  let timer = $state(0);
  const timeLeft = $derived.by(() => {
    const ms = timer % 1000;
    const second = Math.floor((timer % 60_000) / 1000);
    const minute = Math.floor(timer / 60_000);
    return `${padNumber(minute)}:${padNumber(second)}.${padNumber(ms, 3)}`;
  });

  let questionImage = $state<HTMLImageElement>();
  onMount(() => {
    // preload audio
    correctAnswer.initialize();
    wrongAnswer.initialize();
    const shouldAutoplayTTS =
      game.preferences.autoplayTTS && game.preferences.volume > 0;
    if (shouldAutoplayTTS) initTTS();

    timer = initialTimer;
    let handle: ReturnType<typeof requestAnimationFrame>;
    const startTimer = () => {
      const start = Date.now();
      const tick = () => {
        timer = Math.max(0, initialTimer - (Date.now() - start));
        if (timer === 0) {
          checkAnswer(-1, true);
        } else if (pickedAnswer === undefined) {
          handle = requestAnimationFrame(tick);
        }
      };

      tick();
    };

    const init = () => {
      startTimer();
      if (shouldAutoplayTTS) sleep(1000).then(playTTS);
    };

    if (questionImage === undefined || questionImage.complete) init();
    else questionImage?.addEventListener("load", init);

    return () => cancelAnimationFrame(handle);
  });
</script>

<QuestionPageDialog
  bind:open={dialogOpen}
  bind:choice={pickedAnswer}
  {answer}
  {question}
/>

<Card.Root
  class="flex flex-col justify-evenly text-center lg:min-w-72 lg:max-w-96"
>
  <Card.Header>
    {#if question.imageQuery}
      <img
        bind:this={questionImage}
        class="pointer-events-none h-40 rounded-t-xl object-cover"
        src="/generated/{question.language}/{question.id}.jpg"
        alt="Gambar {question.imageQuery}"
      />
    {/if}

    <Card.Title class="pt-2 text-4xl capitalize"
      >{question.sourceWord}</Card.Title
    >
  </Card.Header>
  <Card.Content class="flex items-center justify-between py-4">
    <span class:cursor-progress={ttsPlaying}>
      <Badge
        onclick={playTTS}
        variant={ttsPlaying ? "secondary" : "default"}
        class={cn([
          "cursor-pointer uppercase",
          ttsPlaying && "pointer-events-none",
        ])}
      >
        <Play class="mr-1 h-3 w-3" />
        putar
      </Badge>
    </span>

    <Card.Description>
      Waktu tersisa : <span
        class={cn([
          "inline-block w-12 font-semibold text-green-500 underline decoration-dotted",
          timer < initialTimer / 2 && "text-orange-500 decoration-wavy",
          timer === 0 && "text-red-500 decoration-solid decoration-2",
        ])}>{timeLeft}</span
      >
    </Card.Description>
  </Card.Content>
</Card.Root>

<div class="flex flex-1 flex-col justify-evenly gap-4 max-lg:py-8">
  {#each answer.choices as choice, idx}
    {@const isCorrect = idx === answer.correct}
    <Button
      onclick={() => checkAnswer(idx)}
      class={cn(
        "h-auto whitespace-normal text-center capitalize md:py-4 lg:text-lg",
        pickedAnswer !== undefined && "pointer-events-none",
        highlightCorrectAnswer && (isCorrect ? "!bg-green-500" : "opacity-0"),
        ((highlightWrongAnswer === true && !isCorrect) ||
          highlightWrongAnswer === idx) &&
          "!bg-red-500 opacity-100",
      )}
    >
      {choice}
    </Button>
  {/each}
</div>
