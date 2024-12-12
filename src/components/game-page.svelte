<script lang="ts">
  import QuestionPage from "./question-page.svelte";

  import { gamePreferences, gameState } from "$lib/states.svelte";
  import type { Difficulty, Language, Question } from "$lib/types";
  import { isBrowser, padNumber, titleCase } from "$lib/utils";
  import { processAnswer, processQuestions } from "$lib/utils.content";

  import { navigate } from "astro:transitions/client";

  import { LoaderCircle } from "lucide-svelte";

  interface Props {
    answerMap: Map<Difficulty, Set<string>>;
    questions: Array<[Language, Question[]]>;
  }

  const { answerMap, questions: rawQuestions }: Props = $props();
  const { level } = $derived(gameState);

  const questions = $derived(processQuestions(rawQuestions, gamePreferences));
  const { answer, question } = $derived.by(() => {
    const question = questions[level.current - 1];

    return {
      question,
      answer: (isBrowser
        ? processAnswer(answerMap, question, gamePreferences, gameState)
        : undefined)!,
    };
  });

  $effect(() => {
    const h1 = document.querySelector("h1#main-heading") as HTMLHeadingElement;
    const levelText = `Level ${padNumber(level.current)}/${padNumber(level.total)}`;
    h1.innerText = `${levelText} [${titleCase(question.language)}]`;
  });

  $effect.pre(() => {
    const { difficulty, languages } = $state.snapshot(gamePreferences);

    if (!difficulty || languages.length === 0) navigate("/");
    else gameState.level.total = questions.length;
  });
</script>

{#if isBrowser}
  <QuestionPage {answer} {question} />
{:else}
  <LoaderCircle class="h-32 w-32 animate-spin" />
{/if}
