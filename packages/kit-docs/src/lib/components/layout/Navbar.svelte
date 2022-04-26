<script lang="ts">
  import clsx from 'clsx';
  import { createEventDispatcher } from 'svelte';

  import MenuIcon from '~icons/ri/menu-5-line';
  import ArrowDropDownIcon from '~icons/ri/arrow-drop-down-fill';

  import { colorScheme } from '$lib/stores/colorScheme';
  import { uppercaseFirstLetter } from '$lib/utils/string';
  import Popover from '$lib/components/base/Popover.svelte';

  import ColorSchemeMenu from '$lib/components/base/ColorSchemeMenu.svelte';
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

    <div class="992:hidden -mr-2 flex items-center">
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

        <hr class="my-6 h-2 w-full border-t-2 border-dashed border-gray-200 dark:border-gray-400" />

        <section class="flex flex-col items-start">
          <h1 class="mb-6 text-xl font-medium">{$i18n.nav.options}</h1>
          <div class="flex flex-col space-y-6">
            <slot name="popover-options" />
            <div class="flex items-center">
              Theme

              <label
                class="relative ml-4 flex items-center border border-gray-200 px-4 py-1 dark:border-gray-400 rounded-md focus-within:ring-2"
                style="--tw-ring-color: var(--kd-color-focus);"
              >
                <span class="sr-only">{$i18n.colorScheme.theme}</span>
                {uppercaseFirstLetter($colorScheme)}
                <ArrowDropDownIcon width="20" height="20" class="ml-1" />
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
        <ul class="flex items-center space-x-8 text-lg font-medium">
          {#each navLinks as navLink (navLink.title)}
            <NavLinkItem {...navLink} />
          {/each}
        </ul>
      </nav>

      <slot name="right" />

      <div class="border-gray-divider ml-6 mr-2.5 h-7 w-2 border-l-[1.5px]" />

      <div class="hidden 992:flex items-center">
        <slot name="right-alt" />
        <ColorSchemeMenu />
      </div>
    </div>
  </div>

  <slot name="bottom" />
</div>
