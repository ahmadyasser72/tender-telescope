<script lang="ts">
  import * as Select from "$lib/components/ui/select/index.js";
  import type { Language } from "$lib/types";

  interface Props {
    choices: Language[];
    languages: Language[];
  }

  let { languages = $bindable(), choices }: Props = $props();

  let open = $state(false);
  const triggerContent = $derived(
    languages.length > 0 ? languages.join(", ") : "Pilih bahasa asing...",
  );
</script>

<Select.Root
  type="multiple"
  name="foreign_languages"
  bind:open
  onValueChange={() => (open = false)}
  bind:value={languages}
>
  <Select.Trigger class="py-4 sm:py-6 sm:text-xl">
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
