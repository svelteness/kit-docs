<script context="module" lang="ts">
  import { createKitDocsLoader } from '$lib';

  export const load = createKitDocsLoader('docs');
</script>

<script lang="ts">
  import '$lib/styles/kit-docs.css';

  import {
    type NavbarConfig,
    type SidebarConfig,
    type MarkdownMeta,
    KitDocs,
    KitDocsContent,
    KitDocsLayout,
    Button,
    SocialLink,
  } from '$lib';

  export let meta: MarkdownMeta;
  export let sidebar: SidebarConfig;

  const navbar: NavbarConfig = {
    links: [{ title: 'Documentation', slug: '/docs', match: /\/docs\// }],
  };
</script>

<KitDocs {navbar} {sidebar} {meta}>
  <KitDocsLayout>
    <div slot="navbar-left">
      <Button href="/">Logo</Button>
    </div>

    <div class="socials" slot="navbar-right-alt">
      <SocialLink type="twitter" href="#" />
      <SocialLink type="discord" href="#" />
      <SocialLink type="gitHub" href="#" />
    </div>

    <KitDocsContent />
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
