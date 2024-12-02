<script lang="ts">
  import { Slider } from "$lib/components/ui/slider";
  import { Toggle } from "$lib/components/ui/toggle";
  import { beep } from "$lib/utils.sound.svelte";

  import { HeadphoneOff, Headphones } from "lucide-svelte";

  interface Props {
    volume: number;
  }

  let { volume = $bindable() }: Props = $props();

  let volumeBeforeMuted = $state(0);
  let muted = $state(volume === 0);

  const onMuteToggle = () => {
    if (muted) {
      volumeBeforeMuted = volume;
      volume = 0;
    } else {
      volume = volumeBeforeMuted > 0 ? volumeBeforeMuted : 100;
      beep.playForced();
    }
  };
</script>

<div class="flex">
  <Toggle
    bind:pressed={muted}
    onPressedChange={onMuteToggle}
    size="lg"
    variant="outline"
    class="mr-4"
  >
    {#if muted}
      <HeadphoneOff />
    {:else}
      <Headphones />
    {/if}
  </Toggle>

  <Slider
    value={[volume]}
    onValueChange={(value) => (muted = (volume = value[0]) === 0)}
    onValueCommit={() => beep.playForced()}
    min={0}
    max={100}
    step={5}
    class="flex-1"
  />
</div>
