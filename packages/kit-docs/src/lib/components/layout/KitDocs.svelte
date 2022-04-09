<script lang="ts">
  import { __kitDocs, type MarkdownMeta } from '$lib/stores/kitDocs';
  import { onDestroy } from 'svelte';
  import { writable } from 'svelte/store';
  import {
    createSidebarContext,
    normalizeSidebarConfig,
    setNavbarContext,
    setSidebarContext,
    type NavbarConfig,
    type NormalizedSidebarConfig,
    type SidebarConfig,
  } from './contexts';

  export let navbar: NavbarConfig;
  export let sidebar: SidebarConfig;
  export let meta: MarkdownMeta;

  const navbarConfig = writable<NavbarConfig>();
  $: $navbarConfig = navbar ?? { links: [] };
  setNavbarContext(navbarConfig);

  const sidebarConfig = writable<NormalizedSidebarConfig>();
  $: normalizedSidebar = normalizeSidebarConfig(sidebar);
  $: $sidebarConfig = normalizedSidebar;
  setSidebarContext(createSidebarContext(sidebarConfig));

  $: __kitDocs.set({
    navbar,
    sidebar: normalizedSidebar,
    meta,
  });

  onDestroy(() => {
    __kitDocs.set(null);
  });
</script>

<slot />
