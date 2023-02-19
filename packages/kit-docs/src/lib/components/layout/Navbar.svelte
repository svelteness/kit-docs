<script lang="ts">
  import clsx from 'clsx';
  import { createEventDispatcher } from 'svelte';

  import MenuIcon from '~icons/ri/menu-5-line';
  import ArrowDropDownIcon from '~icons/ri/arrow-drop-down-fill';

  import { colorScheme } from '$lib/stores/color-scheme';
  import { uppercaseFirstLetter } from '$lib/utils/string';
  import Popover from '$lib/components/base/Popover.svelte';

  import ColorSchemeToggle from '$lib/components/base/ColorSchemeToggle.svelte';
  import NavLinkItem from './NavLink.svelte';
  import { getI18nContext, getNavbarContext } from './contexts';

  export let search = false;

  const dispatch = createEventDispatcher();

  function onOpenPopover() {
    dispatch('open-popover');
  }

  function onClosePopover() {
    dispatch('close-popover');
  }

  const context = getNavbarContext();
  $: navLinks = $context.links;

  const i18n = getI18nContext();
</script>

<div
  class="flex w-full flex-col items-center justify-center mx-auto max-w-[var(--kd-navbar-max-width)] p-[var(--kd-navbar-padding)] h-[var(--kd--navbar-height)]"
>
  <div class={clsx('flex w-full items-center')}>
    <slot name="left" />

    <div class="flex-1" />

    <div class="992:hidden -me-2 flex items-center">
      {#if search}
        <slot name="search" />
      {/if}

      <Popover overlay on:open={onOpenPopover} on:close={onClosePopover}>
        <svelte:fragment slot="button">
          <MenuIcon width="30" height="30" />
          <span class="sr-only">{$i18n.nav.mainMenu}</span>
        </svelte:fragment>

        <slot name="popover-top" />

        <section class="flex flex-col items-start">
          <h1 class="mb-6 text-xl font-medium">{$i18n.nav.links}</h1>
          <nav>
            <ul>
              {#each navLinks as navLink (navLink.title)}
                <NavLinkItem {...navLink} />
              {/each}
            </ul>
          </nav>
        </section>

        <slot name="popover-middle" />

        <hr class="my-6 h-2 w-full border-t border-dashed border-border" />

        <section class="flex flex-col items-start">
          <h1 class="mb-6 text-xl font-medium">{$i18n.nav.options}</h1>
          <div class="flex flex-col space-y-6">
            <slot name="popover-options" />
            <div class="flex items-center">
              {$i18n.colorScheme.theme}

              <label
                class="relative ms-4 flex items-center border border-border px-4 py-1 rounded-md focus-within:ring-2"
                style="--tw-ring-color: var(--kd-color-focus);"
              >
                <span class="sr-only">{$i18n.colorScheme.theme}</span>
                <span>{$i18n.colorScheme[$colorScheme]}</span>
                <ArrowDropDownIcon viewBox="0 0 24 20" width="20" height="20" class="ms-1" />
                <select
                  class="absolute inset-0 appearance-none opacity-0"
                  bind:value={$colorScheme}
                >
                  <option value="light">{$i18n.colorScheme.light}</option>
                  <option value="dark">{$i18n.colorScheme.dark}</option>
                  <option value="system">{$i18n.colorScheme.system}</option>
                </select>
              </label>
            </div>
          </div>
        </section>

        <slot name="popover-bottom" />
      </Popover>
    </div>

    <div class="992:flex 992:items-center hidden">
      <nav>
        <ul class="flex items-center space-x-8">
          {#each navLinks as navLink (navLink.title)}
            <NavLinkItem {...navLink} />
          {/each}
        </ul>
      </nav>

      <slot name="right" />

      <div class="hidden 992:flex items-center ms-6">
        <slot name="right-alt" />
        <ColorSchemeToggle />
      </div>
    </div>
  </div>

  <slot name="bottom" />
</div>
