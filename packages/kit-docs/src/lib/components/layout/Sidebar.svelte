<script lang="ts">
  import clsx from 'clsx';
  import { createEventDispatcher, onMount } from 'svelte';
  import { page } from '$app/stores';

  import CloseIcon from '~icons/ri/close-fill';

  import { ariaBool } from '$lib/utils/aria';
  import { wasEnterKeyPressed } from '$lib/utils/keyboard';
  import { scrollIntoCenter } from '$lib/utils/scroll';
  import { isLargeScreen } from '$lib/stores/screen';
  import Overlay from '$lib/components/base/Overlay.svelte';
  import { prefetchLink } from '$lib/actions/prefetch-link';
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
  <div class="992:hidden sticky top-0 start-0 flex items-center">
    <div class="flex-1" />
    <button
      class={clsx('text-soft hover:text-inverse p-4 -mx-6', !open && 'pointer-events-none')}
      on:pointerdown={() => dispatch('close')}
      on:keydown={(e) => wasEnterKeyPressed(e) && dispatch('close', true)}
    >
      <CloseIcon width="24" height="24" />
      <span class="sr-only">Close sidebar</span>
    </button>
  </div>

  <nav class="992:px-1 scrollbar">
    {#if search}
      <div class="pointer-events-none sticky top-0 z-0 -ms-0.5 min-h-[80px]">
        <div class="992:h-6 bg-body" />
        <div class="bg-body pointer-events-auto relative">
          <div class="992:block hidden">
            <slot name="search" />
          </div>
        </div>
        <div class="from-body h-8 bg-gradient-to-b" />
      </div>
    {/if}

    <slot name="top" />

    <ul class={clsx(!search && 'mt-8', 'pb-28 992:pb-0')}>
      {#each Object.keys($config.links) as category (category)}
        {@const links = $config.links[category]}
        <li class="992:mt-10 mt-12 first:mt-0">
          {#if category !== '.'}
            <h5 class="text-strong 992:mb-3 mb-8 text-lg font-semibold">
              {category}
            </h5>
          {:else}
            <div class="mt-10" />
          {/if}
          <ul class="border-border space-y-3 border-s">
            {#each links as link (link.title + link.slug)}
              <li class="first:mt-6">
                <a
                  class={clsx(
                    '992:py-1 -ms-px flex items-center border-s py-2 ps-4',
                    isActiveSidebarLink(link, $page.url.pathname)
                      ? 'text-brand font-semibold'
                      : 'hover:border-inverse focus-visible:border-inverse text-soft hover:text-inverse focus-visible:text-inverse border-transparent font-normal',
                  )}
                  href={link.slug}
                  use:prefetchLink
                  style={isActiveSidebarLink(link, $page.url.pathname)
                    ? 'border-color: var(--kd-sidebar-border-active);'
                    : ''}
                >
                  {#if link.icon?.before}
                    <svelte:component this={link.icon.before} class="me-1" width="24" height="24" />
                  {/if}
                  {link.title}
                  {#if link.icon?.after}
                    <svelte:component this={link.icon.after} class="ms-1" width="24" height="24" />
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
