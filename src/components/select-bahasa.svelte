<script lang="ts">
  import * as Select from "$lib/components/ui/select/index.js";

  interface Props {
    choices: string[];
    bahasa: string[];
  }

  let { bahasa = $bindable(), choices }: Props = $props();

  const triggerContent = $derived(
    bahasa.length > 0 ? bahasa.join(", ") : "Pilih bahasa asing...",
  );
</script>

<Select.Root type="multiple" name="foreign_languages" bind:value={bahasa}>
  <Select.Trigger class="py-6 sm:text-xl">
    {triggerContent}
  </Select.Trigger>
  <Select.Content>
    <Select.Group>
      <Select.GroupHeading>Bahasa asing</Select.GroupHeading>
      {#each choices as language}
        <Select.Item class="capitalize" value={language} label={language} />
      {/each}
    </Select.Group>
  </Select.Content>
</Select.Root>
