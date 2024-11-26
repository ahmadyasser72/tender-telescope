<script lang="ts">
  import * as Select from "$lib/components/ui/select/index.js";

  const difficulties = [
    { value: "easy", label: "Pemula" },
    { value: "medium", label: "Menengah" },
    { value: "hard", label: "Lanjutan" },
  ];

  let value = $state("");

  const triggerContent = $derived(
    difficulties.find((f) => f.value === value)?.label ??
      "Pilih tingkat kesulitan...",
  );
</script>

<Select.Root type="single" name="chosenDifficulty" bind:value>
  <Select.Trigger>
    {triggerContent}
  </Select.Trigger>
  <Select.Content>
    <Select.Group>
      <Select.GroupHeading>Tingkat kesulitan</Select.GroupHeading>
      {#each difficulties as difficulty}
        <Select.Item value={difficulty.value} label={difficulty.label} />
      {/each}
    </Select.Group>
  </Select.Content>
</Select.Root>
