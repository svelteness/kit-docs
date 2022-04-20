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
  import '$lib/polyfills/index';
  import '$lib/styles/normalize.css';
  import '$lib/styles/fonts.css';
  import '$lib/styles/theme.css';
  import '$lib/styles/vars.css';

  import { page } from '$app/stores';
  import kitDocsLogo from '$img/kit-docs-logo.svg?raw';
  import socialCardLarge from '$img/social-card-large.jpg';

  import {
    KitDocs,
    KitDocsLayout,
    Button,
    SocialLink,
    createKitDocsLoader,
    createSidebarContext,
  } from '$lib';

  /** @type {import('$lib').MarkdownMeta | null} */
  export let meta = null;

  /** @type {import('$lib').ResolvedSidebarConfig | null} */
  export let sidebar = null;

  /** @type {import('$lib').NavbarConfig} */
  const navbar = {
    links: [{ title: 'Documentation', slug: '/docs', match: /\/docs/ }],
  };

  const { activeCategory } = createSidebarContext(sidebar);

  $: category = $activeCategory ? `${$activeCategory}: ` : '';
  $: title = meta ? `${category}${meta.title} | KitDocs` : null;
  $: description = meta?.description;
</script>

<svelte:head>
  {#key $page.url.pathname}
    {#if title}
      <title>{title}</title>
      <meta property="og:title" content={title} />
      <meta name="twitter:title" content={title} />
    {/if}
    {#if description}
      <meta name="description" content={description} />
      <meta name="twitter:description" content={description} />
      <meta name="og:description" content={description} />
    {/if}
    {#if title && description}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@mihar_22" />
      <meta name="twitter:image" content={`https://kit-docs.svelteness.dev${socialCardLarge}`} />
      <meta name="twitter:creator" content="@mihar_22" />
      <meta property="og:url" content={`https://kit-docs.svelteness.dev${$page.url.pathname}`} />
      <meta property="og:type" content="article" />
      <meta name="og:image" content={`https://kit-docs.svelteness.dev${socialCardLarge}`} />
    {/if}
  {/key}
</svelte:head>

<KitDocs {meta}>
  <KitDocsLayout {navbar} {sidebar}>
    <div slot="navbar-left">
      <div class="logo">
        <Button href="/docs">
          <div class="logo-content">
            {@html kitDocsLogo}
            <span>kitdocs</span>
          </div>
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
    width: 20px;
  }

  .logo-content {
    display: flex;
    align-items: center;
  }

  .logo-content > span {
    letter-spacing: 0.5px;
    font-size: 24px;
    font-weight: 500;
    margin-left: 0.375rem;
  }

  .socials {
    display: flex;
    margin-right: -0.5rem;
  }

  .socials > :global(a) {
    padding: 0 0.5rem;
  }
</style>
