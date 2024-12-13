<script lang="ts">
  import QuestionPageDialog from "./question-page-dialog.svelte";

  import { Badge } from "$lib/components/ui/badge";
  import { Button } from "$lib/components/ui/button";
  import * as Card from "$lib/components/ui/card";
  import {
    correctAnswer,
    createAudio,
    wrongAnswer,
  } from "$lib/states/audio.svelte";
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

  let ttsAudio = $state<ReturnType<typeof createAudio>>();
  let ttsPlaying = $state(false);
  const playTTS = async () => {
    ttsPlaying = true;
    ttsAudio ??= createAudio(
      `/voice/${question.language}/${question.translation}.mp3`,
    );

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

    if (questionImage?.complete) startTimer();
    else questionImage?.addEventListener("load", startTimer);

    return () => cancelAnimationFrame(handle);
  });
</script>

<QuestionPageDialog
  bind:open={dialogOpen}
  bind:choice={pickedAnswer}
  {answer}
  {question}
/>

<Card.Root class="min-w-full max-w-96 text-center sm:min-w-96">
  <Card.Header>
    <img
      bind:this={questionImage}
      class="pointer-events-none h-40 object-cover"
      src="/images/{question.translation}.jpg"
      alt="Gambar {question.sourceWord}"
    />
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
          "font-semibold text-green-500 underline decoration-dotted",
          timer < initialTimer / 2 && "text-orange-500 decoration-wavy",
          timer === 0 && "text-red-500 decoration-solid decoration-2",
        ])}>{timeLeft}</span
      >
    </Card.Description>
  </Card.Content>
</Card.Root>

<div class="grid grid-cols-2 gap-4 py-8 md:gap-8 md:px-12">
  {#each answer.choices as choice, idx}
    {@const isCorrect = idx === answer.correct}
    <Button
      onclick={() => checkAnswer(idx)}
      class={cn(
        "capitalize",
        pickedAnswer !== undefined && "pointer-events-none",
        highlightCorrectAnswer && (isCorrect ? "!bg-green-500" : "opacity-0"),
        ((highlightWrongAnswer === true && !isCorrect) ||
          highlightWrongAnswer === idx) &&
          "!bg-red-500 opacity-100",
      )}
      size="big"
    >
      {choice}
    </Button>
  {/each}
</div>
