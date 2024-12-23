<script lang="ts">
  import { Checkbox } from "$lib/components/ui/checkbox";
  import { Label } from "$lib/components/ui/label";

  interface Props {
    autoplay: boolean;
  }

  let { autoplay = $bindable() }: Props = $props();
</script>

<div class="flex items-center space-x-2">
  <Checkbox id="autoplay-tts" bind:checked={autoplay} />
  <Label for="autoplay-tts" class="sm:text-lg">Otomatis putar suara</Label>
</div>
