<script lang="ts">
  import { __kitDocs, type MarkdownMeta } from '$lib/stores/kitDocs';
  import { onDestroy } from 'svelte';
  import { writable } from 'svelte/store';
  import {
    createSidebarContext,
    setNavbarContext,
    setSidebarContext,
    type NavbarConfig,
    type SidebarConfig,
  } from './contexts';

  export let navbar: NavbarConfig;
  export let sidebar: SidebarConfig;
  export let meta: MarkdownMeta;

  const navbarConfig = writable<NavbarConfig>();
  $: $navbarConfig = navbar ?? { links: [] };
  setNavbarContext(navbarConfig);

  const sidebarConfig = writable<SidebarConfig>();
  $: $sidebarConfig = sidebar ?? { links: {} };
  setSidebarContext(createSidebarContext(sidebarConfig));

  $: __kitDocs.set({
    navbar,
    sidebar,
    meta,
  });

  onDestroy(() => {
    __kitDocs.set(null);
  });
</script>

<slot />
