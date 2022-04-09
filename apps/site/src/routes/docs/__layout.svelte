<script context="module" lang="ts">
  import { createKitDocsLoader } from '@svelteness/kit-docs';

  export const prerender = true;

  export const load = createKitDocsLoader();
</script>

<script lang="ts">
  import '@svelteness/kit-docs/polyfills/index.js';
  import '@svelteness/kit-docs/client/styles/prebundled.css';
  import '$lib/styles/kit-docs.css';

  import {
    type NavbarConfig,
    type SidebarConfig,
    type MarkdownMeta,
    KitDocs,
    KitDocsLayout,
    Button,
    SocialLink,
  } from '@svelteness/kit-docs';

  export let meta: MarkdownMeta;

  const navbar: NavbarConfig = {
    links: [],
  };

  let sidebar: SidebarConfig = {
    links: {},
  };
</script>

<svelte:head>
  <title>{meta.title} | Svelteness</title>
  <meta name="description" content={meta.description} />
  <meta name="twitter:description" content={meta.description} />
  <meta name="og:description" content={meta.description} />
</svelte:head>

<KitDocs {navbar} {sidebar} {meta}>
  <KitDocsLayout>
    <div slot="navbar-left">
      <Button href="/">
        <!-- LOGO -->
      </Button>
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
  .socials {
    display: flex;
    margin-right: -0.5rem;
  }

  .socials > :global(a) {
    padding: 0 0.5rem;
  }
</style>
