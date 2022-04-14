<script lang="ts" context="module">
  export const prerender = true;

  export const load = createKitDocsLoader({ sidebar: '/docs' });
</script>

<script lang="ts">
  import '$lib/polyfills';
  import '$lib/styles/normalize.css';
  import '$lib/styles/fonts.css';
  import '$lib/styles/theme.css';
  import '$lib/styles/vars.css';

  import SvelteLogo from '../../img/svelte-horizontal.svg?raw';

  import {
    createKitDocsLoader,
    type MarkdownMeta,
    type NavbarConfig,
    type SidebarConfig,
    KitDocs,
    KitDocsLayout,
    Button,
    SocialLink,
    createSidebarContext,
    kebabToTitleCase,
  } from '$lib';

  export let meta: MarkdownMeta;
  export let sidebar: SidebarConfig;

  const navbar: NavbarConfig = {
    links: [
      { title: 'Docs', slug: '/docs', match: /\/docs/ },
      { title: 'Tutorials', slug: 'https://svelte.dev/tutorial' },
      { title: 'Examples', slug: 'https://svelte.dev/examples' },
      { title: 'REPL', slug: 'https://svelte.dev/repl' },
      { title: 'Blog', slug: 'https://svelte.dev/blog' },
      { title: 'FAQ', slug: 'https://svelte.dev/faq' },
    ],
  };

  const _sidebar: SidebarConfig = {
    ...sidebar,
    formatCategory: (category) => kebabToTitleCase(category).replace('Api', 'API'),
  };

  const { activeCategory } = createSidebarContext(_sidebar);
</script>

<svelte:head>
  <title>{$activeCategory}: {meta.title} | Svelte</title>
  <meta name="description" content={meta.description} />
  <meta name="twitter:description" content={meta.description} />
  <meta name="og:description" content={meta.description} />
</svelte:head>

<KitDocs {meta}>
  <KitDocsLayout {navbar} sidebar={_sidebar}>
    <div slot="navbar-left">
      <div class="logo">
        <Button href="/">
          {@html SvelteLogo}
        </Button>
      </div>
    </div>

    <div class="socials" slot="navbar-right-alt">
      <SocialLink type="twitter" href="https://twitter.com/sveltejs" />
      <SocialLink type="discord" href="https://discord.com/invite/yy75DKs" />
      <SocialLink type="gitHub" href="https://github.com/sveltejs/svelte" />
    </div>

    <slot />
  </KitDocsLayout>
</KitDocs>

<style>
  .logo :global(a) {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .logo :global(svg) {
    height: 36px;
    overflow: hidden;
  }

  .socials {
    display: flex;
    margin-right: -0.5rem;
  }

  .socials > :global(a) {
    padding: 0 0.5rem;
  }

  :global(:root) {
    --kd-color-brand-rgb: 209, 59, 18;
  }

  :global(:root.dark) {
    --kd-color-brand-rgb: 227, 105, 70;
  }
</style>
