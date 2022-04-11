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

  export let navbar: NavbarConfig | false;
  export let sidebar: SidebarConfig;

  export let isSidebarOpen = false;
  export let isNavPopoverOpen = false;

  export let search = false;

  let closeSidebar: CloseDialogCallback;

  const navbarContext = writable<NavbarConfig>();
  $: $navbarContext = navbar ? navbar : { links: [] };
  setNavbarContext(navbarContext);

  const sidebarConfig = writable<SidebarConfig>();
  $: $sidebarConfig = sidebar;
  setSidebarContext(createSidebarContext(sidebarConfig));

  const { activeCategory, activeLink, nextLink, previousLink } = getSidebarContext();
</script>

<div
  class="kit-docs bg-gray-body min-h-full min-w-full h-full"
  style="font-family: var(--kd-font-family-sans);"
>
  {#if navbar}
    <div
      class={clsx(
        'border-gray-divider fixed top-0 z-30 w-full flex-none border-b',
        isNavPopoverOpen
          ? 'bg-gray-100 dark:bg-gray-800'
          : 'supports-backdrop-blur:bg-white/60 bg-gray-200/95 backdrop-blur dark:bg-gray-800/60',
      )}
    >
      <Navbar
        {search}
        contain
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
          <div class="border-gray-divider 992:hidden mt-4 flex w-full items-center border-t pt-4">
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

            <ol
              class="text-md text-gray-soft mt-px ml-1 flex items-center whitespace-nowrap leading-6"
            >
              {#if $activeCategory !== '.'}
                <li class="flex items-center">
                  {$activeCategory}
                  <RightArrowIcon class="mx-1" width="16" height="16" />
                </li>
              {/if}
              <li class="truncate font-semibold text-slate-900 dark:text-slate-200">
                {$activeLink?.title}
              </li>
            </ol>
          </div>

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
      'mx-auto w-full max-w-[1440px] flex flex-row min-h-full',
      navbar && 'pt-40 992:pt-20 z-20',
    )}
  >
    <Sidebar
      {search}
      class={({ open }) =>
        clsx(
          'self-start fixed top-0 left-0 transform bg-gray-body z-50 border-gray-divider border-r w-full max-w-[90vw] max-h-screen pb-8 px-5',
          '-translate-x-full transform transition-transform duration-200 ease-out will-change-transform min-h-screen',
          '992:translate-x-0 922:block 992:sticky 992:z-0 992:w-72 992:min-w-[17rem] overflow-y-auto 1460:pl-0.5',
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

    <main class="pt-10 min-h-screen w-full max-w-[85ch] overflow-x-hidden px-8 992:px-16">
      <slot name="main-top" />

      <article class="markdown prose dark:prose-invert z-10">
        {#if $activeCategory !== '.'}
          <p class="text-brand mb-3.5 text-[15px] font-semibold leading-6">
            {$activeCategory}
          </p>
        {/if}

        <slot />
      </article>

      {#if $previousLink || $nextLink}
        <hr class="border-gray-divider mt-20" />
      {/if}

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

      <slot name="main-bottom" />
    </main>

    <div class="flex-1" />

    <OnThisPage
      class={clsx(
        'pt-10 pb-8 hidden overflow-auto max-h-[calc(100vh-5rem)] min-w-[160px] sticky right-4 1440:right-6 1440:pr-4 1280:block',
        navbar ? 'top-20' : 'top-0',
      )}
    />
  </div>
</div>
