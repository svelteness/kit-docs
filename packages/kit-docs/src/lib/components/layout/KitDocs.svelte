<script lang="ts">
  import { __kitDocs, type MarkdownMeta } from '$lib/stores/kitDocs';
  import { onDestroy } from 'svelte';

  export let meta: MarkdownMeta;

  $: __kitDocs.set({ meta });

  onDestroy(() => {
    __kitDocs.set(null);
  });
</script>

<slot />
