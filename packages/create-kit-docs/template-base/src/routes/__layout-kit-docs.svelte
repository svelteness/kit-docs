<script context="module">
  export const prerender = true;

  export const load = createKitDocsLoader({
    sidebar: {
      '/': null,
      '/docs': '/docs',
    },
  });
</script>

<script>
  import { page } from '$app/stores';

  import { KitDocs, createKitDocsLoader, createSidebarContext } from '@svelteness/kit-docs';

  /** @type {import('@svelteness/kit-docs').MarkdownMeta | null} */
  export let meta = null;

  /** @type {import('@svelteness/kit-docs').ResolvedSidebarConfig | null} */
  export let sidebar = null;

  const { activeCategory } = createSidebarContext(sidebar);
</script>

<svelte:head>
  {#key $page.url.pathname}
    {#if meta?.title}
      <title>{$activeCategory ? `${$activeCategory}: ` : ''}{meta.title} | KitDocs</title>
    {/if}
    {#if meta?.description}
      <meta name="description" content={meta.description} />
    {/if}
  {/key}
</svelte:head>

<KitDocs {meta}>
  <slot />
</KitDocs>
