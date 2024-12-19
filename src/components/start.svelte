<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { isTauri } from "$lib/utils";
  import { getGithubRelease } from "$lib/utils.github";

  import { toast, type ExternalToast } from "svelte-sonner";

  let toastId = $state<ReturnType<typeof toast>>();
  let release = $state<Awaited<ReturnType<typeof getGithubRelease>>>();
  const downloadRelease = async () => {
    toastId = toast.loading("Loading...", {
      dismissable: false,
      duration: 0,
      // @ts-expect-error https://github.com/wobsoriano/svelte-sonner/issues/109#issuecomment-2212294044
      promise: true,
    });

    release ??= await getGithubRelease();

    const toastOptions = {
      id: toastId,
      duration: 10_000,
      dismissable: true,
      onAutoClose: () => (toastId = undefined),
      onDismiss: () => (toastId = undefined),
    } satisfies ExternalToast;

    if (release === undefined) {
      toast.warning("Versi offline tidak tersedia!", toastOptions);
      return;
    }

    const size = `${(release.size / 1024 / 1024).toFixed(1)} MB`;
    toast.success(`📥 ${release.version} ${release.os}`, {
      ...toastOptions,
      description: release.outdated ? "⚠️ bukan versi terbaru!" : undefined,
      descriptionClass: "font-semibold",
      action: {
        label: `${release.format} (${size})`,
        onClick: () => window.open(release!.url),
      },
    });
  };
</script>

<div class="flex flex-col space-y-4">
  <Button
    onclick={() => toast.dismiss(toastId)}
    href="/start-settings"
    size="big">Mulai</Button
  >

  {#if !isTauri}
    <Button
      onclick={downloadRelease}
      disabled={toastId !== undefined}
      variant="link"
    >
      unduh versi offline
    </Button>
  {/if}
</div>
