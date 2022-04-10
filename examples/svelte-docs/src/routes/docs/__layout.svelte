<script context="module">
  export const prerender = true;

  export const load = createKitDocsLoader();
</script>

<script>
  import '@svelteness/kit-docs/client/polyfills/index.js';
  import '@svelteness/kit-docs/client/styles/prebundled.css';
  import '$lib/styles/kit-docs.css';

  import SvelteLogo from '$lib/img/svelte-logo.svg?raw';

  import {
    createKitDocsLoader,
    createSidebarContext,
    KitDocs,
    KitDocsLayout,
    Button,
    SocialLink,
  } from '@svelteness/kit-docs';

  /** @type {import('@svelteness/kit-docs').MarkdownMeta} */
  export let meta;

  /** @type {import('@svelteness/kit-docs').NavbarConfig} */
  const navbar = {
    links: [
      { title: 'Docs', slug: '/docs', match: /\/docs/ },
      { title: 'Tutorials', slug: 'https://svelte.dev/tutorial' },
      { title: 'Examples', slug: 'https://svelte.dev/examples' },
      { title: 'REPL', slug: 'https://svelte.dev/repl' },
      { title: 'Blog', slug: 'https://svelte.dev/blog' },
      { title: 'FAQ', slug: 'https://svelte.dev/faq' },
    ],
  };

  /** @type {import('@svelteness/kit-docs').SidebarConfig} */
  const sidebar = {
    links: {
      'Component Format': ['script', 'style', 'module'],
      'Template Syntax': ['foundation', 'element-directives', 'component-directives'],
      Runtime: ['svelte', 'stores', 'motion', 'transitions', 'animate', 'easing', 'register'],
      'Component API': ['client', 'server', 'custom-element'],
      Compiler: ['compile', 'parse', 'preprocess', 'version', 'walk'],
      Accessibility: ['warnings'],
    },
  };

  const { activeCategory } = createSidebarContext(sidebar);
</script>

<svelte:head>
  <title>{$activeCategory}: {meta.title} | Svelte</title>
  <meta name="description" content={meta.description} />
  <meta name="twitter:description" content={meta.description} />
  <meta name="og:description" content={meta.description} />
</svelte:head>

<KitDocs {meta}>
  <KitDocsLayout {navbar} {sidebar}>
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
</style>
