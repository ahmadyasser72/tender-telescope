<script lang="ts">
  import beepMP3 from "$lib/assets/beep.mp3";
  import { Slider } from "$lib/components/ui/slider";
  import { Toggle } from "$lib/components/ui/toggle";
  import { isBrowser } from "$lib/utils";

  import { HeadphoneOff, Headphones } from "lucide-svelte";

  interface Props {
    volume: number;
  }

  let { volume = $bindable() }: Props = $props();

  let volumeBeforeMuted = $state(0);
  let muted = $state(volume === 0);

  let beep: HTMLAudioElement;
  if (isBrowser) beep = new Audio(beepMP3);

  const forcePlayBeep = () => {
    beep.pause();
    beep.currentTime = 0;
    beep.play();
  };

  const onMuteToggle = () => {
    if (muted) {
      volumeBeforeMuted = volume;
      volume = 0;
    } else {
      forcePlayBeep();
      volume = volumeBeforeMuted > 0 ? volumeBeforeMuted : 100;
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
    onValueCommit={forcePlayBeep}
    min={0}
    max={100}
    step={5}
    class="flex-1"
  />
</div>
