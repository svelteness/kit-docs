<script lang="ts">
  import { __kitDocs, type MarkdownMeta } from '$lib/stores/kitDocs';
  import { onDestroy } from 'svelte';

  export let meta: MarkdownMeta | null = null;

  $: __kitDocs.set({ meta });

  onDestroy(() => {
    __kitDocs.set({
      meta: null,
    });
  });
</script>

<slot />
