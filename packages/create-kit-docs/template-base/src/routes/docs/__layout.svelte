<script context="module">
  export const prerender = true;

  export const load = createKitDocsLoader({ sidebar: '/docs' });
</script>

<script>
  import { KitDocs, createKitDocsLoader, createSidebarContext } from '@svelteness/kit-docs';

  /** @type {import('@svelteness/kit-docs').MarkdownMeta} */
  export let meta;

  /** @type {import('@svelteness/kit-docs').ResolvedSidebarConfig} */
  export let sidebar;

  const { activeCategory } = createSidebarContext(sidebar);
</script>

<svelte:head>
  <title>{$activeCategory}: {meta.title} | KitDocs</title>
  <meta name="description" content={meta.description} />
</svelte:head>

<KitDocs {meta}>
  <slot />
</KitDocs>
