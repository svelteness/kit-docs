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
    DEFAULT_I18N_TRANSLATIONS,
    DEFAULT_NAVIGATION_CONFIG,
    getSidebarContext,
    setI18nContext,
    setNavbarContext,
    setNavigationContext,
    setSidebarContext,
    type I18NTranslations,
    type NavbarConfig,
    type NavigationConfig,
    type SidebarConfig,
  } from './contexts';
  import { writable } from 'svelte/store';
  import { isLargeScreen } from '$lib/stores/isLargeScreen';
  import { scrollDirection, scrollTop } from '$lib/stores/scroll';
  import { kitDocs } from '$lib/stores/kitDocs';

  export let navigation: Partial<NavigationConfig> | null = null;
  export let navbar: NavbarConfig | false;
  export let sidebar: SidebarConfig | null = null;
  export let i18n: Partial<I18NTranslations> | null = null;

  export let isSidebarOpen = false;
  export let isNavPopoverOpen = false;

  export let search = false;

  let closeSidebar: CloseDialogCallback;

  const navigatonContext = writable<NavigationConfig>();
  $: $navigatonContext = { ...DEFAULT_NAVIGATION_CONFIG, ...navigation };
  setNavigationContext(navigatonContext);

  const navbarContext = writable<NavbarConfig>();
  $: $navbarContext = navbar ? navbar : { links: [] };
  setNavbarContext(navbarContext);

  const sidebarConfig = writable<SidebarConfig | null>();
  $: $sidebarConfig = sidebar;
  setSidebarContext(createSidebarContext(sidebarConfig));

  const i18nContext = writable<I18NTranslations>();
  $: $i18nContext = { ...DEFAULT_I18N_TRANSLATIONS, ...i18n };
  setI18nContext(i18nContext);

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
  style={clsx(
    'font-family: var(--kd-font-family-sans, inherit);',
    !showBottomNav && '--kd-breadcrumbs-height: 0px;',
    `--kd--navbar-height: calc(var(--kd-navbar-height) + var(--kd-breadcrumbs-height));`,
  )}
>
  {#if navbar}
    <div
      class={clsx(
        'fixed top-0 z-30 w-full flex-none transform-gpu transition-transform duration-150 ease-out',
        isNavPopoverOpen
          ? 'bg-gray-100 dark:bg-gray-800'
          : 'supports-backdrop-blur:bg-white/60 bg-gray-200/95 backdrop-blur dark:bg-gray-800/60',
        collapseNavbar
          ? '-translate-y-[calc(calc(var(--kd--navbar-height)-var(--kd-breadcrumbs-height))+1px)]'
          : 'translate-y-0',
      )}
      style="border-bottom: var(--kd-navbar-border-bottom);"
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
                  class="text-gray-soft hover:text-gray-inverse inline-flex justify-center rounded-md p-2 text-sm font-medium"
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
                  <span class="sr-only">{$i18nContext.nav.openSidebar}</span>
                  <MenuUnfoldIcon width="28" height="28" />
                </button>
              {/if}

              {#if $activeLink || $kitDocs.meta?.title}
                <ol
                  class={clsx(
                    'text-md text-gray-soft flex items-center whitespace-nowrap leading-6',
                    showSidebar ? 'mt-px ml-2.5' : 'mt-2',
                  )}
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
      'mx-auto w-full flex flex-row min-h-full max-w-[var(--kd-content-max-width)]',
      navbar && 'pt-[var(--kd--navbar-height)] z-20',
    )}
  >
    {#if showSidebar}
      <Sidebar
        {search}
        class={({ open }) =>
          clsx(
            'self-start fixed top-0 left-0 transform bg-gray-body z-50 border-gray-divider border-r',
            '-translate-x-full transform transition-transform duration-200 ease-out will-change-transform',
            'max-h-screen min-h-screen min-w-[var(--kd-sidebar-min-width)] max-w-[var(--kd-sidebar-max-width)]',
            '992:translate-x-0 922:block 992:sticky 992:z-0 overflow-y-auto p-[var(--kd-sidebar-padding)]',
            open && 'translate-x-0',
            navbar
              ? '992:top-[var(--kd--navbar-height)] 992:min-h-[calc(100vh-var(--kd--navbar-height))] 992:max-h-[calc(100vh-var(--kd--navbar-height))]'
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
        navbar ? `992:min-h-[calc(100vh-var(--kd--navbar-height))]` : 'min-h-screen',
        navbar && 'min-h-[calc(100vh-var(--kd--navbar-height))]',
        $kitDocs.meta && (showSidebar ? 'px-8 992:px-16' : 'px-6'),
        $kitDocs.meta && (navbar || showBottomNav ? 'pt-8' : ''),
      )}
      style={clsx(
        `max-width: ${
          $kitDocs.meta
            ? 'var(--kd-main-max-width, var(--kd-article-max-width))'
            : 'var(--kd-main-max-width)'
        };`,
      )}
    >
      <slot name="main-top" />

      {#if $kitDocs.meta}
        <article class="markdown prose dark:prose-invert z-10 max-w-[var(--kd-article-max-width)]">
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
              <span class="text-gray-inverse ml-3 mb-4 inline-block"
                >{$i18nContext.nav.previous}</span
              >
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
              <span class="text-gray-inverse mr-3 mb-4 inline-block">{$i18nContext.nav.next}</span>
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
        'pt-8 pb-8 hidden overflow-auto min-w-[160px] sticky right-4 pr-4 1440:right-6 1440:pr-2 1280:block pl-0.5',
        navbar
          ? 'top-[var(--kd--navbar-height)] max-h-[calc(100vh-var(--kd--navbar-height))]'
          : 'top-0 max-h-screen',
      )}
    />
  </div>
</div>
