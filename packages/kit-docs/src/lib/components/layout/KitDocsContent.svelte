<script lang="ts">
  import { kitDocs } from '$lib/stores/kitDocs';

  import { browser } from '$app/env';

  function loadAsset(asset) {
    return import(/* @vite-ignore */ asset);
  }

  $: asset = $kitDocs.meta.asset;
</script>

{#if !browser && asset}
  <!-- svelte-ignore missing-declaration -->
  <svelte:component this={require(asset)} />
{:else if browser && asset}
  {#await loadAsset(asset) then { default: Component }}
    <svelte:component this={Component} />
  {/await}
{/if}
