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
  <div class="992:kd-hidden kd-sticky kd-top-0 kd-left-0 kd-flex kd-items-center">
    <div class="kd-flex-1" />
    <button
      class={clsx(
        'kd-text-soft hover:kd-text-inverse kd-p-4 kd--mx-6',
        !open && 'kd-pointer-events-none',
      )}
      on:pointerdown={() => dispatch('close')}
      on:keydown={(e) => wasEnterKeyPressed(e) && dispatch('close', true)}
    >
      <CloseIcon width="24" height="24" />
      <span class="kd-sr-only">Close sidebar</span>
    </button>
  </div>

  <nav class="992:kd-px-1 scrollbar">
    {#if search}
      <div class="kd-pointer-events-none kd-sticky kd-top-0 kd-z-0 kd--ml-0.5 kd-min-h-[80px]">
        <div class="992:kd-h-6 bg-body" />
        <div class="kd-bg-body kd-pointer-events-auto kd-relative">
          <div class="992:kd-block kd-hidden">
            <slot name="search" />
          </div>
        </div>
        <div class="kd-from-body kd-h-8 kd-bg-gradient-to-b" />
      </div>
    {/if}

    <slot name="top" />

    <ul class={clsx(!search && 'kd-mt-8', 'kd-pb-28 992:kd-pb-0')}>
      {#each Object.keys($config.links) as category (category)}
        {@const links = $config.links[category]}
        <li class="992:kd-mt-10 kd-mt-12 first:kd-mt-0">
          {#if category !== '.'}
            <h5 class="text-strong 992:kd-mb-3 kd-mb-8 kd-text-lg kd-font-semibold">
              {category}
            </h5>
          {:else}
            <div class="kd-mt-10" />
          {/if}
          <ul class="kd-border-border kd-space-y-3 kd-border-l">
            {#each links as link (link.title + link.slug)}
              <li class="first:kd-mt-6">
                <a
                  class={clsx(
                    '992:kd-py-1 kd--ml-px kd-flex kd-items-center kd-border-l kd-py-2 kd-pl-4',
                    isActiveSidebarLink(link, $page.url.pathname)
                      ? 'kd-text-brand kd-font-semibold'
                      : 'hover:kd-border-inverse focus-visible:kd-border-inverse kd-text-soft hover:kd-text-inverse focus-visible:kd-text-inverse kd-border-transparent kd-font-normal',
                  )}
                  href={link.slug}
                  use:prefetchLink
                  style={isActiveSidebarLink(link, $page.url.pathname)
                    ? 'border-color: var(--kd-sidebar-border-active);'
                    : ''}
                >
                  {#if link.icon?.before}
                    <svelte:component
                      this={link.icon.before}
                      class="kd-mr-1"
                      width="24"
                      height="24"
                    />
                  {/if}
                  {link.title}
                  {#if link.icon?.after}
                    <svelte:component
                      this={link.icon.after}
                      class="kd-ml-1"
                      width="24"
                      height="24"
                    />
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

<div class="992:kd-hidden kd-z-40">
  <Overlay {open} />
</div>
