<script lang="ts" context="module">
  import {
    createKitDocsLoader,
    type MarkdownMeta,
    type NavbarConfig,
    type SidebarConfig,
  } from '$lib';

  export const prerender = true;

  export const load = createKitDocsLoader();
</script>

<script lang="ts">
  import '$lib/styles/prebundled.css';
  import '$lib/styles/vars.css';

  import { KitDocs, KitDocsLayout, Button, SocialLink } from '$lib';

  export let meta: MarkdownMeta;

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

  let sidebar: SidebarConfig = {
    baseUrl: '/docs',
    links: {
      'Component Format': ['script', 'style', 'module'],
      'Template Syntax': ['foundation', 'element-directives', 'component-directives'],
      Runtime: ['svelte', 'stores', 'motion', 'transitions', 'animate', 'easing', 'register'],
      'Component API': ['client', 'server', 'custom-element'],
      Compiler: ['compile', 'parse', 'preprocess', 'version', 'walk'],
      Accessibility: ['warnings'],
    },
  };
</script>

<svelte:head>
  <title>{meta.title} | Svelte</title>
  <meta name="description" content={meta.description} />
  <meta name="twitter:description" content={meta.description} />
  <meta name="og:description" content={meta.description} />
</svelte:head>

<KitDocs {navbar} {sidebar} {meta}>
  <KitDocsLayout>
    <div slot="navbar-left">
      <div class="logo">
        <Button href="/">Logo</Button>
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
