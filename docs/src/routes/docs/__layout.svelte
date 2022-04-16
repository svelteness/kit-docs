<script context="module">
  export const prerender = true;

  export const load = createKitDocsLoader({ sidebar: '/docs' });
</script>

<script>
  import '@svelteness/kit-docs/client/polyfills/index.js';
  import '@svelteness/kit-docs/client/styles/normalize.css';
  import '@svelteness/kit-docs/client/styles/fonts.css';
  import '@svelteness/kit-docs/client/styles/theme.css';
  import '@svelteness/kit-docs/client/styles/vars.css';

  import { page } from '$app/stores';

  import kitDocsLogo from '$lib/img/kit-docs-logo.svg?raw';
  import socialCardLarge from '$lib/img/social-card-large.jpg';

  import {
    KitDocs,
    KitDocsLayout,
    Button,
    SocialLink,
    createKitDocsLoader,
    createSidebarContext,
  } from '@svelteness/kit-docs';

  /** @type {import('@svelteness/kit-docs').MarkdownMeta} */
  export let meta;

  /** @type {import('@svelteness/kit-docs').ResolvedSidebarConfig} */
  export let sidebar;

  /** @type {import('@svelteness/kit-docs').NavbarConfig} */
  const navbar = {
    links: [{ title: 'Documentation', slug: '/docs', match: /\/docs/ }],
  };

  const { activeCategory } = createSidebarContext(sidebar);
</script>

<svelte:head>
  <title>{$activeCategory}: {meta.title} | KitDocs</title>
  <meta name="description" content={meta.description} />
  <meta name="twitter:description" content={meta.description} />
  <meta name="og:description" content={meta.description} />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="@mihar_22" />
  <meta name="twitter:image" content={`https://kit-docs.svelteness.dev${socialCardLarge}`} />
  <meta name="twitter:creator" content="@mihar_22" />
  <meta property="og:url" content={`https://kit-docs.svelteness.dev${$page.url.pathname}`} />
  <meta property="og:type" content="article" />
  <meta name="og:image" content={`https://kit-docs.svelteness.dev${socialCardLarge}`} />
</svelte:head>

<KitDocs {meta}>
  <KitDocsLayout {navbar} {sidebar}>
    <div slot="navbar-left">
      <div class="logo">
        <Button href="/docs">
          {@html kitDocsLogo}
        </Button>
      </div>
    </div>

    <div class="socials" slot="navbar-right-alt">
      <SocialLink type="gitHub" href="https://github.com/svelteness/kit-docs" />
    </div>

    <slot />
  </KitDocsLayout>
</KitDocs>

<style>
  :global(:root) {
    --kd-color-brand-rgb: 233, 127, 6;
  }

  :global(:root.dark) {
    --kd-color-brand-rgb: 213, 149, 76;
  }

  .logo :global(a) {
    margin-left: 0.5rem;
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
