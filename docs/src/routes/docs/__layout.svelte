<script context="module" lang="ts">
  export const prerender = true;

  export const load = createKitDocsLoader({ sidebar: '/docs/kit-docs' });
</script>

<script lang="ts">
  import '@svelteness/kit-docs/client/polyfills/index.js';
  import '@svelteness/kit-docs/client/styles/normalize.css';
  import '@svelteness/kit-docs/client/styles/fonts.css';
  import '@svelteness/kit-docs/client/styles/theme.css';
  import '$lib/styles/kit-docs.css';

  import KitDocsLogo from '$lib/img/logo.svg?raw';

  import {
    type MarkdownMeta,
    KitDocs,
    KitDocsLayout,
    Button,
    SocialLink,
    createKitDocsLoader,
    createSidebarContext,
    type NavbarConfig,
    type SidebarConfig,
  } from '@svelteness/kit-docs';

  export let meta: MarkdownMeta;
  export let sidebar: SidebarConfig;

  const navbar: NavbarConfig = { links: [] };

  const { activeCategory } = createSidebarContext(sidebar);
</script>

<svelte:head>
  <title>{$activeCategory}: {meta.title} | Svelteness</title>
  <meta name="description" content={meta.description} />
  <meta name="twitter:description" content={meta.description} />
  <meta name="og:description" content={meta.description} />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="@vidstackjs" />
  <!-- <meta name="twitter:image" content={`https://vidstack.io${socialCardLarge}`} /> -->
  <meta name="twitter:creator" content="@vidstackjs" />
  <!-- <meta property="og:url" content={`https://vidstack.io${$page.url.pathname}`} /> -->
  <meta property="og:type" content="article" />
  <!-- <meta property="og:image" content={`https://vidstack.io${socialCardLarge}`} /> -->
</svelte:head>

<KitDocs {meta}>
  <KitDocsLayout {navbar} {sidebar}>
    <div slot="navbar-left">
      <div class="logo">
        <Button href="#">
          {@html KitDocsLogo}
        </Button>
      </div>
    </div>

    <div class="socials" slot="navbar-right-alt">
      <SocialLink type="twitter" href="#" />
      <SocialLink type="discord" href="#" />
      <SocialLink type="gitHub" href="#" />
    </div>

    <slot />
  </KitDocsLayout>
</KitDocs>

<style>
  .logo :global(a) {
    margin-left: 0.25rem;
    display: flex;
    align-items: center;
  }

  .logo :global(svg) {
    width: 26px;
  }

  .socials {
    display: flex;
    margin-right: -0.5rem;
  }

  .socials > :global(a) {
    padding: 0 0.5rem;
  }
</style>
