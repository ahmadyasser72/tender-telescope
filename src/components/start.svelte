<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { isTauri } from "$lib/utils";

  const close = async () => {
    if (isTauri()) {
      const { getCurrentWindow } = await import("@tauri-apps/api/window");
      await getCurrentWindow().close();
    } else {
      window.close();
    }
  };
</script>

<div class="flex flex-col space-y-4">
  <Button href="/start-settings" size="big">Mulai</Button>
  <Button onclick={close} size="big" variant="outline">Keluar</Button>
</div>
