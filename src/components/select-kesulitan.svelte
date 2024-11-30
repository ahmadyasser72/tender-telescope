<script lang="ts">
  import * as Select from "$lib/components/ui/select/index.js";
  import type { Difficulty } from "$lib/types";

  interface Props {
    choices: Difficulty[];
    difficulty?: Difficulty;
  }

  let { difficulty = $bindable(), choices }: Props = $props();

  const triggerContent = $derived(
    choices.find((difficulty) => difficulty === difficulty) ??
      "Tingkat kesulitan...",
  );
</script>

<Select.Root type="single" name="difficulty" bind:value={difficulty}>
  <Select.Trigger class="py-6 sm:text-xl">
    {triggerContent}
  </Select.Trigger>
  <Select.Content>
    <Select.Group>
      <Select.GroupHeading>Tingkat kesulitan</Select.GroupHeading>
      {#each choices as difficulty}
        <Select.Item class="capitalize" value={difficulty} label={difficulty} />
      {/each}
    </Select.Group>
  </Select.Content>
</Select.Root>
