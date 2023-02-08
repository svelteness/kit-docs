<script lang="ts">
  import MenuUnfoldIcon from '~icons/ri/menu-unfold-fill';
  import RightArrowIcon from '~icons/ri/arrow-right-s-line';

  import clsx from 'clsx';
  import Navbar from './Navbar.svelte';
  import Sidebar from './Sidebar.svelte';

  import { ariaBool } from '$lib/utils/aria';
  import { hideDocumentScrollbar } from '$lib/utils/scroll';
  import { type CloseDialogCallback, dialogManager } from '$lib/actions/dialog-manager';
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
  import { isLargeScreen } from '$lib/stores/screen';
  import { scrollDirection, scrollTop } from '$lib/stores/scroll';
  import { kitDocs } from '$lib/stores/kit-docs';

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
  class="kit-docs kd-bg-body kd-text-inverse kd-min-h-full kd-min-w-full kd-h-full kd-transition-transform kd-duration-150 kd-ease-out"
  style={clsx(
    'font-family: var(--kd-font-family-sans, inherit);',
    !showBottomNav && '--kd-breadcrumbs-height: 0px;',
    `--kd--navbar-height: calc(var(--kd-navbar-height) + var(--kd-breadcrumbs-height));`,
  )}
>
  {#if navbar}
    <div
      class={clsx(
        'kd-fixed kd-top-0 kd-z-30 kd-w-full kd-flex-none kd-transform-gpu kd-transition-transform kd-duration-150 kd-ease-out',
        isNavPopoverOpen ? '' : 'blur-bg',
        collapseNavbar
          ? 'kd--translate-y-[calc(calc(var(--kd--navbar-height)-var(--kd-breadcrumbs-height))+1px)]'
          : 'kd-translate-y-0',
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
            <div
              class="kd-border-border 992:kd-hidden kd-flex kd-w-full kd-items-center kd-mt-4 kd-pt-4 kd-border-t"
            >
              {#if showSidebar}
                <button
                  id="main-sidebar-button"
                  type="button"
                  class="kd-text-soft hover:kd-text-inverse kd-inline-flex kd-justify-center kd-rounded-md kd-p-2 kd-text-sm kd-font-medium"
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
                  <span class="kd-sr-only">{$i18nContext.nav.openSidebar}</span>
                  <MenuUnfoldIcon width="28" height="28" />
                </button>
              {/if}

              {#if $activeLink || $kitDocs.meta?.title}
                <ol
                  class={clsx(
                    'kd-text-md kd-text-soft kd-flex kd-items-center kd-whitespace-nowrap kd-leading-6',
                    showSidebar ? 'kd-mt-px kd-ml-2.5' : 'kd-mt-2',
                  )}
                >
                  {#if $activeCategory && $activeCategory !== '.'}
                    <li class="kd-flex kd-items-center">
                      {$activeCategory}
                      <RightArrowIcon class="kd-mx-1" width="16" height="16" />
                    </li>
                  {/if}
                  <li class="kd-truncate kd-font-semibold kd-text-slate-900 dark:kd-text-slate-200">
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
      'kd-mx-auto kd-w-full kd-flex kd-flex-row kd-min-h-full kd-max-w-[var(--kd-content-max-width)]',
      navbar && 'kd-pt-[var(--kd--navbar-height)] kd-z-20',
    )}
  >
    {#if showSidebar}
      <Sidebar
        {search}
        class={({ open }) =>
          clsx(
            'kd-self-start kd-fixed kd-top-0 kd-left-0 kd-transform kd-bg-body kd-z-50 kd-border-border kd-border-r scrollbar',
            'kd--translate-x-full kd-transform kd-transition-transform kd-duration-200 kd-ease-out kd-will-change-transform',
            'kd-max-h-screen kd-min-h-screen kd-min-w-[var(--kd-sidebar-min-width)] kd-max-w-[var(--kd-sidebar-max-width)]',
            '992:kd-translate-x-0 922:kd-block 992:kd-sticky 992:kd-z-0 kd-overflow-y-auto kd-p-[var(--kd-sidebar-padding)]',
            open && 'kd-translate-x-0',
            navbar
              ? '992:kd-top-[var(--kd--navbar-height)] 992:kd-min-h-[calc(100vh-var(--kd--navbar-height))] 992:kd-max-h-[calc(100vh-var(--kd--navbar-height))]'
              : '992:kd-top-0 kd-min-h-screen kd-max-h-screen',
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
        'kd-w-full kd-overflow-x-hidden',
        navbar ? `992:kd-min-h-[calc(100vh-var(--kd--navbar-height))]` : 'kd-min-h-screen',
        navbar && 'kd-min-h-[calc(100vh-var(--kd--navbar-height))]',
        $kitDocs.meta && (showSidebar ? 'kd-px-8 992:kd-px-16' : 'kd-px-6'),
        $kitDocs.meta && (navbar || showBottomNav ? 'kd-pt-8' : ''),
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
        <article
          class="markdown kd-prose dark:kd-prose-invert kd-z-10 kd-max-w-[var(--kd-article-max-width)]"
        >
          {#if $activeCategory && $activeCategory !== '.'}
            <p class="kd-text-brand kd-mb-3.5 kd-text-[15px] kd-font-semibold kd-leading-6">
              {$activeCategory}
            </p>
          {/if}

          <slot />
        </article>
      {:else}
        <slot />
      {/if}

      {#if $previousLink || $nextLink}
        <hr class="kd-border-border kd-mt-20" />

        <div
          class="992:kd-text-xl kd-flex kd-items-center kd-pt-12 kd-pb-20 kd-text-lg kd-font-semibold kd-text-gray-300"
        >
          {#if $previousLink}
            <div class="kd-mb-4 kd-flex kd-flex-col kd-items-start">
              <span class="kd-text-inverse kd-ml-3 kd-mb-4 kd-inline-block"
                >{$i18nContext.nav.previous}</span
              >
              <Button
                arrow="left"
                href={$previousLink.slug}
                class="hover:text-inverse"
                data-sveltekit-prefetch
              >
                {$previousLink.title}
              </Button>
            </div>
          {/if}

          {#if $nextLink}
            <div class="kd-ml-auto kd-mb-4 kd-flex kd-flex-col kd-items-end">
              <span class="kd-text-inverse kd-mr-3 kd-mb-4 kd-inline-block"
                >{$i18nContext.nav.next}</span
              >
              <Button
                arrow="right"
                href={$nextLink.slug}
                class="hover:text-inverse"
                data-sveltekit-prefetch
              >
                {$nextLink.title}
              </Button>
            </div>
          {/if}
        </div>
      {/if}

      <slot name="main-bottom" />
    </main>

    <div class="992:kd-flex-1" />

    <OnThisPage
      class={clsx(
        'kd-pt-8 kd-pb-8 kd-hidden kd-overflow-auto kd-min-w-[160px] kd-sticky kd-right-4 kd-pr-4 1440:kd-right-6 1440:kd-pr-2 1280:kd-block kd-pl-0.5',
        navbar
          ? 'kd-top-[var(--kd--navbar-height)] kd-max-h-[calc(100vh-var(--kd--navbar-height))]'
          : 'kd-top-0 kd-max-h-screen',
      )}
    />
  </div>
</div>
