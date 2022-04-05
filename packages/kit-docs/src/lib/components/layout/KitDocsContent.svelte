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

  async function mountComponent(importPath: string) {
    component?.$destroy();

    const { default: Component } = (await import(importPath)).default as {
      default: typeof SvelteComponent;
    };

    component = new Component({
      target,
      context,
      hydrate: !hydrated,
    });

    hydrated = true;
  }

  $: if (target) mountComponent($kitDocs.meta.rootPath);

  onDestroy(() => {
    component.$destroy();
    component = null;
  });

  let html = '';
  let head = '';
  let css = '';
  let style = () => (browser ? '' : `<style>${css ?? ''}</style>`);
  if (!browser) {
    const path = require('path');

    const SSRComponent: ReturnType<typeof create_ssr_component> = require(path.resolve(
      process.cwd(),
      'src',
      $kitDocs.meta.rootPath,
    ));

    ({
      html,
      head,
      css: { code: css },
    } = SSRComponent.render({ context }));
  }
</script>

<svelte:head>
  {@html head}
  {@html style()}
</svelte:head>

<div class="contents" bind:this={target}>
  {#if !browser}
    {@html html ?? ''}
  {/if}
</div>
