<script lang="ts">
  import MenuUnfoldIcon from '~icons/ri/menu-unfold-fill';
  import RightArrowIcon from '~icons/ri/arrow-right-s-line';

  import clsx from 'clsx';
  import Navbar from './Navbar.svelte';
  import Sidebar from './Sidebar.svelte';

  import { ariaBool } from '$lib/utils/aria';
  import { hideDocumentScrollbar } from '$lib/utils/scroll';
  import { type CloseDialogCallback, dialogManager } from '$lib/actions/dialogManager';
  import Button from '$lib/components/base/Button.svelte';
  import OnThisPage from './OnThisPage.svelte';
  import {
    createSidebarContext,
    getSidebarContext,
    setNavbarContext,
    setSidebarContext,
    type NavbarConfig,
    type SidebarConfig,
  } from './contexts';
  import { writable } from 'svelte/store';
  import { isLargeScreen } from '$lib/stores/isLargeScreen';
  import { scrollDirection, scrollTop } from '$lib/stores/scroll';
  import { kitDocs } from '$lib/stores/kitDocs';

  export let navbar: NavbarConfig | false;
  export let sidebar: SidebarConfig | null;

  export let isSidebarOpen = false;
  export let isNavPopoverOpen = false;

  export let search = false;

  let closeSidebar: CloseDialogCallback;

  const navbarContext = writable<NavbarConfig>();
  $: $navbarContext = navbar ? navbar : { links: [] };
  setNavbarContext(navbarContext);

  const sidebarConfig = writable<SidebarConfig | null>();
  $: $sidebarConfig = sidebar;
  setSidebarContext(createSidebarContext(sidebarConfig));

  const {
    activeCategory,
    allLinks: sidebarLinks,
    activeLink,
    nextLink,
    previousLink,
  } = getSidebarContext();

  $: collapseNavbar = $isLargeScreen ? false : $scrollTop > 60 && $scrollDirection === 'down';
  $: showSidebar = $sidebarLinks.length > 0;
  $: showBottomNav = showSidebar || $activeLink;
</script>

<div
  class="kit-docs bg-gray-body min-h-full min-w-full h-full transition-transform duration-150 ease-out"
  style={clsx('font-family: var(--kd-font-family-sans, inherit);')}
>
  {#if navbar}
    <div
      class={clsx(
        'fixed top-0 z-30 w-full flex-none transform-gpu transition-transform duration-150 ease-out',
        isNavPopoverOpen
          ? 'bg-gray-100 dark:bg-gray-800'
          : 'supports-backdrop-blur:bg-white/60 bg-gray-200/95 backdrop-blur dark:bg-gray-800/60',
        collapseNavbar ? '-translate-y-[5rem]' : 'translate-y-0',
      )}
      style="border-bottom: var(--kd-navbar-border-bottom, 1px solid var(--kd-color-gray-divider));"
    >
      <Navbar
        {search}
        on:open-popover={() => {
          isNavPopoverOpen = true;
        }}
        on:close-popover={() => {
          isNavPopoverOpen = false;
        }}
      >
        <svelte:fragment slot="search">
          <slot name="search" />
        </svelte:fragment>
        <svelte:fragment slot="left">
          <slot name="navbar-left" />
        </svelte:fragment>
        <svelte:fragment slot="right">
          <slot name="navbar-right" />
        </svelte:fragment>
        <svelte:fragment slot="right-alt">
          <slot name="navbar-right-alt" />
        </svelte:fragment>

        <svelte:fragment slot="bottom">
          {#if showBottomNav}
            <div class="border-gray-divider 992:hidden flex w-full items-center mt-4 pt-4 border-t">
              {#if showSidebar}
                <button
                  id="main-sidebar-button"
                  type="button"
                  class="text-gray-soft hover:text-gray-inverse -ml-3 inline-flex justify-center rounded-md px-4 py-2 text-sm font-medium"
                  aria-controls="main-sidebar"
                  aria-expanded={ariaBool(isSidebarOpen)}
                  aria-haspopup="true"
                  use:dialogManager={{
                    closeOnSelectSelectors: ['a'],
                    onOpen: () => {
                      isSidebarOpen = true;
                      hideDocumentScrollbar(true);
                    },
                    onClose: () => {
                      isSidebarOpen = false;
                      hideDocumentScrollbar(false);
                    },
                    close: (cb) => {
                      closeSidebar = cb;
                    },
                  }}
                >
                  <span class="sr-only">Open main sidebar</span>
                  <MenuUnfoldIcon width="28" height="28" />
                </button>
              {/if}

              {#if $activeLink || $kitDocs.meta?.title}
                <ol
                  class="text-md text-gray-soft mt-px ml-1 flex items-center whitespace-nowrap leading-6"
                >
                  {#if $activeCategory && $activeCategory !== '.'}
                    <li class="flex items-center">
                      {$activeCategory}
                      <RightArrowIcon class="mx-1" width="16" height="16" />
                    </li>
                  {/if}
                  <li class="truncate font-semibold text-slate-900 dark:text-slate-200">
                    {$activeLink?.title || $kitDocs.meta?.title}
                  </li>
                </ol>
              {/if}
            </div>
          {/if}

          <slot name="navbar-bottom" />
        </svelte:fragment>

        <svelte:fragment slot="popover-top">
          <slot name="navbar-popover-top" />
        </svelte:fragment>
        <svelte:fragment slot="popover-middle">
          <slot name="navbar-popover-middle" />
        </svelte:fragment>
        <svelte:fragment slot="popover-options">
          <slot name="navbar-popover-options" />
        </svelte:fragment>
        <svelte:fragment slot="popover-bottom">
          <slot name="navbar-popover-bottom" />
        </svelte:fragment>
      </Navbar>
    </div>
  {/if}

  <div
    class={clsx(
      'mx-auto w-full flex flex-row min-h-full',
      navbar && '992:pt-20 z-20',
      navbar && showBottomNav ? 'pt-40' : 'pt-20',
    )}
    style="max-width: var(--kd-content-max-width, 1440px);"
  >
    {#if showSidebar}
      <Sidebar
        {search}
        class={({ open }) =>
          clsx(
            'self-start fixed top-0 left-0 transform bg-gray-body z-50 border-gray-divider border-r pb-8 px-7',
            '-translate-x-full transform transition-transform duration-200 ease-out will-change-transform',
            'min-w-[90vw] 768:min-w-[70vw] max-w-screen max-h-screen min-h-screen',
            ' 992:px-5 992:translate-x-0 922:block 992:sticky 992:z-0 992:w-[17rem] 992:min-w-[17rem] overflow-y-auto 1460:pl-6',
            open && 'translate-x-0',
            navbar
              ? '992:top-20 992:min-h-[calc(100vh-5rem)] 992:max-h-[calc(100vh-5rem)]'
              : '992:top-0 min-h-screen max-h-screen',
          )}
        open={isSidebarOpen}
        on:close={(e) => closeSidebar(e.detail)}
      >
        <svelte:fragment slot="top">
          <slot name="sidebar-top" />
        </svelte:fragment>
        <svelte:fragment slot="bottom">
          <slot name="sidebar-bottom" />
        </svelte:fragment>
        <svelte:fragment slot="search">
          <slot name="search" />
        </svelte:fragment>
      </Sidebar>
    {/if}

    <main
      class={clsx(
        'w-full overflow-x-hidden',
        navbar ? `992:min-h-[calc(100vh-5rem)]` : 'min-h-screen',
        navbar && showBottomNav ? 'min-h-[calc(100vh-10rem)]' : 'min-h-[calc(100vh-5rem)]',
        showSidebar ? 'px-8 992:px-16 max-w-[85ch]' : 'px-8 1280:pl-6 1460:pl-0',
        navbar || showBottomNav ? 'pt-10' : '',
      )}
    >
      <slot name="main-top" />

      {#if $kitDocs.meta}
        <article class="markdown prose dark:prose-invert z-10">
          {#if $activeCategory && $activeCategory !== '.'}
            <p class="text-brand mb-3.5 text-[15px] font-semibold leading-6">
              {$activeCategory}
            </p>
          {/if}

          <slot />
        </article>
      {:else}
        <slot />
      {/if}

      {#if $previousLink || $nextLink}
        <hr class="border-gray-divider mt-20" />

        <div class="992:text-xl flex items-center pt-12 pb-20 text-lg font-semibold text-gray-300">
          {#if $previousLink}
            <div class="mb-4 flex flex-col items-start">
              <span class="text-gray-inverse ml-3 mb-4 inline-block">Previous</span>
              <Button
                arrow="left"
                href={$previousLink.slug}
                class="hover:text-gray-inverse"
                sveltekit:prefetch
              >
                {$previousLink.title}
              </Button>
            </div>
          {/if}

          {#if $nextLink}
            <div class="ml-auto mb-4 flex flex-col items-end">
              <span class="text-gray-inverse mr-3 mb-4 inline-block">Next</span>
              <Button
                arrow="right"
                href={$nextLink.slug}
                class="hover:text-gray-inverse"
                sveltekit:prefetch
              >
                {$nextLink.title}
              </Button>
            </div>
          {/if}
        </div>
      {/if}

      <slot name="main-bottom" />
    </main>

    <div class="992:flex-1" />

    <OnThisPage
      class={clsx(
        'pt-10 pb-8 hidden overflow-auto min-w-[160px] sticky right-4 1440:right-6 1440:pr-4 1280:block',
        navbar ? 'top-20 max-h-[calc(100vh-5rem)]' : 'top-0 max-h-screen',
      )}
    />
  </div>
</div>
