<script lang="ts">
  import clsx from 'clsx';
  import { createEventDispatcher, onMount } from 'svelte';
  import { page } from '$app/stores';

  import CloseIcon from '~icons/ri/close-fill';

  import { ariaBool } from '$lib/utils/aria';
  import { wasEnterKeyPressed } from '$lib/utils/keyboard';
  import { scrollIntoCenter } from '$lib/utils/scroll';
  import { isLargeScreen } from '$lib/stores/isLargeScreen';
  import Overlay from '$lib/components/base/Overlay.svelte';
  import { prefetchLink } from '$lib/actions/prefetchLink';
  import { getSidebarContext, isActiveSidebarLink } from './contexts';
  import { isFunction } from '$lib/utils/unit';

  const dispatch = createEventDispatcher();

  let sidebar: HTMLElement;

  // Only valid on small screen (<992px).
  export let open = false;
  export let search = false;

  let _class: string | ((state: { open: boolean }) => string) = '';
  export { _class as class };

  export let style = '';

  const { config, activeLink } = getSidebarContext();

  function scrollToActiveItem() {
    if (!$activeLink) return;
    const activeEl = sidebar.querySelector(`a[href="${$activeLink.slug}"]`);
    if (activeEl) {
      scrollIntoCenter(sidebar, activeEl, { behaviour: 'smooth' });
    }
  }

  onMount(() => {
    scrollToActiveItem();
  });
</script>

<aside
  id="main-sidebar"
  class={clsx('sidebar', isFunction(_class) ? _class({ open }) : _class)}
  role={!$isLargeScreen ? 'dialog' : null}
  aria-modal={ariaBool(!$isLargeScreen)}
  bind:this={sidebar}
  {style}
>
  <div class="992:hidden sticky top-0 left-0 flex items-center">
    <div class="flex-1" />
    <button
      class={clsx(
        'text-gray-soft hover:text-gray-inverse p-4 -mx-6',
        !open && 'pointer-events-none',
      )}
      on:pointerdown={() => dispatch('close')}
      on:keydown={(e) => wasEnterKeyPressed(e) && dispatch('close', true)}
    >
      <CloseIcon width="24" height="24" />
      <span class="sr-only">Close sidebar</span>
    </button>
  </div>

  <nav class="992:px-1">
    {#if search}
      <div class="992:block pointer-events-none sticky top-0 -ml-0.5 hidden min-h-[80px]">
        <div class="h-6 bg-white dark:bg-gray-800" />
        <div class="pointer-events-auto relative bg-white dark:bg-gray-800">
          <slot name="search" />
        </div>
        <div class="h-8 bg-gradient-to-b from-white dark:from-gray-800" />
      </div>
    {/if}

    <slot name="top" />

    <ul class={clsx(!search && 'mt-8', 'pb-28 992:pb-0')}>
      {#each Object.keys($config.links) as category (category)}
        {@const links = $config.links[category]}
        <li class="992:mt-10 mt-12 first:mt-0">
          {#if category !== '.'}
            <h5 class="text-gray-strong 992:mb-3 mb-8 text-lg font-semibold">
              {category}
            </h5>
          {:else}
            <div class="mt-10" />
          {/if}
          <ul class="border-gray-divider space-y-3 border-l">
            {#each links as link (link.title + link.slug)}
              <li class="first:mt-6">
                <a
                  class={clsx(
                    '992:py-1.5 -ml-px flex items-center border-l-2 py-2 pl-4',
                    isActiveSidebarLink(link, $page.url.pathname)
                      ? 'text-brand font-semibold'
                      : 'hover:border-gray-inverse text-gray-soft hover:text-gray-inverse border-transparent font-normal',
                  )}
                  href={link.slug}
                  use:prefetchLink
                  style={isActiveSidebarLink(link, $page.url.pathname)
                    ? 'border-color: var(--kd-sidebar-border-active);'
                    : ''}
                >
                  {#if link.icon?.before}
                    <svelte:component this={link.icon.before} class="mr-1" width="24" height="24" />
                  {/if}
                  {link.title}
                  {#if link.icon?.after}
                    <svelte:component this={link.icon.after} class="ml-1" width="24" height="24" />
                  {/if}
                </a>
              </li>
            {/each}
          </ul>
        </li>
      {/each}
    </ul>

    <slot name="bottom" />
  </nav>
</aside>

<div class="992:hidden z-40">
  <Overlay {open} />
</div>
