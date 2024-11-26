<script lang="ts">
  import * as Select from "$lib/components/ui/select/index.js";

  const languages = [{ value: "en", label: "Inggris" }];

  let value = $state("");

  const triggerContent = $derived(
    languages.find((f) => f.value === value)?.label ?? "Pilih bahasa asing...",
  );
</script>

<Select.Root type="single" name="chosenForeignLanguage" bind:value>
  <Select.Trigger>
    {triggerContent}
  </Select.Trigger>
  <Select.Content>
    <Select.Group>
      <Select.GroupHeading>Bahasa asing</Select.GroupHeading>
      {#each languages as language}
        <Select.Item value={language.value} label={language.label} />
      {/each}
    </Select.Group>
  </Select.Content>
</Select.Root>
