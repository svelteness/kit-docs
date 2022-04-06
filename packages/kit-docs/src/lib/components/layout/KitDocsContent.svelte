<script lang="ts" context="module">
  let hydrated = false;
</script>

<script lang="ts">
  import { browser } from '$app/env';
  import { kitDocs } from '$lib/stores/kitDocs';

  import { getAllContexts, onDestroy, SvelteComponent } from 'svelte';
  import type { create_ssr_component } from 'svelte/internal';

  let target;
  let component: SvelteComponent | null = null;

  const context = getAllContexts();

  async function mountComponent(asset?: string) {
    component?.$destroy();

    if (!asset) return;

    const { default: Component } = (await import(/* @vite-ignore */ asset)).default as {
      default: typeof SvelteComponent;
    };

    component = new Component({
      target,
      context,
      hydrate: !hydrated,
    });

    hydrated = true;
  }

  $: if (target) mountComponent($kitDocs.meta?.asset);

  onDestroy(() => {
    component?.$destroy();
    component = null;
  });
</script>

<div class="contents" bind:this={target} />
