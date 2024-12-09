<script lang="ts">
  import QuestionPage from "./question-page.svelte";

  import { gamePreferences, gameState } from "$lib/states.svelte";
  import type { Difficulty, Language, Question } from "$lib/types";
  import { padNumber, titleCase } from "$lib/utils";
  import { processAnswer, processQuestions } from "$lib/utils.content";

  import { navigate } from "astro:transitions/client";

  import { onMount } from "svelte";

  interface Props {
    answerMap: Map<Difficulty, Set<string>>;
    questions: Array<[Language, Question[]]>;
  }

  const { answerMap, questions: rawQuestions }: Props = $props();
  const { level } = $derived(gameState);

  const questions = $derived(processQuestions(rawQuestions, gamePreferences));
  const question = $derived(questions[level.current - 1]);

  const answer = $derived(
    processAnswer(answerMap, question, gamePreferences, gameState),
  );

  onMount(() => (gameState.level.total = questions.length));

  $effect(() => {
    const h1 = document.querySelector("h1#main-heading") as HTMLHeadingElement;
    const levelText = `Level ${padNumber(level.current)}/${padNumber(level.total)}`;
    h1.innerText = `${levelText} [${titleCase(question.language)}]`;
  });

  $effect.pre(() => {
    const { difficulty, languages } = $state.snapshot(gamePreferences);

    if (!difficulty || languages.length === 0) navigate("/");
  });
</script>

<QuestionPage {answer} {question} />
