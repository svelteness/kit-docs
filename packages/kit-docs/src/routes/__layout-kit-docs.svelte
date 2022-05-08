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
  import poweredByVercel from '$img/powered-by-vercel.svg?raw';

  import {
    KitDocs,
    KitDocsLayout,
    Button,
    SocialLink,
    createKitDocsLoader,
    createSidebarContext,
  } from '$lib';

  // import '@docsearch/css';
  // import '$lib/styles/docsearch.css';
  // import { Algolia } from '$lib/algolia';

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
      <meta property="og:site_name" content="KitDocs" />
      <meta property="og:url" content={`https://kit-docs.svelteness.dev${$page.url.pathname}`} />
      <meta property="og:type" content="article" />
      <meta name="og:image" content={`https://kit-docs.svelteness.dev${socialCardLarge}`} />
    {/if}
  {/key}
</svelte:head>

<KitDocs {meta}>
  <KitDocsLayout {navbar} {sidebar}>
    <!-- <Algolia
      apiKey="599cec31baffa4868cae4e79f180729b"
      appId="R2IYF7ETH7"
      indexName="docsearch"
      slot="search"
    /> -->

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

    <div slot="main-bottom" class="footer">
      <a
        href="https://vercel.com/?utm_source=svelteness&utm_campaign=oss"
        rel="external"
        target="_blank"
      >
        {@html poweredByVercel}
      </a>
    </div>
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
    margin-left: 0.375rem;
    display: flex;
    align-items: center;
    padding: 0.25rem;
  }

  .logo :global(svg) {
    width: 26px;
  }

  .socials {
    display: flex;
    margin-left: -0.25rem;
  }

  .footer {
    display: flex;
    justify-content: center;
    margin-top: -1rem;
    padding-bottom: 2.5rem;
  }

  @media screen and (min-width: 992px) {
    :global(:root) {
      --kd-sidebar-min-width: 14rem;
    }
  }
</style>
