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
  class="kd-flex kd-w-full kd-flex-col kd-items-center kd-justify-center kd-mx-auto kd-max-w-[var(--kd-navbar-max-width)] kd-p-[var(--kd-navbar-padding)] kd-h-[var(--kd--navbar-height)]"
>
  <div class={clsx('kd-flex kd-w-full kd-items-center')}>
    <slot name="left" />

    <div class="kd-flex-1" />

    <div class="992:kd-hidden kd--mr-2 kd-flex kd-items-center">
      {#if search}
        <slot name="search" />
      {/if}

      <Popover overlay on:open={onOpenPopover} on:close={onClosePopover}>
        <svelte:fragment slot="button">
          <MenuIcon width="30" height="30" />
          <span class="kd-sr-only">{$i18n.nav.mainMenu}</span>
        </svelte:fragment>

        <slot name="popover-top" />

        <section class="kd-flex kd-flex-col kd-items-start">
          <h1 class="kd-mb-6 kd-text-xl kd-font-medium">{$i18n.nav.links}</h1>
          <nav>
            <ul>
              {#each navLinks as navLink (navLink.title)}
                <NavLinkItem {...navLink} />
              {/each}
            </ul>
          </nav>
        </section>

        <slot name="popover-middle" />

        <hr class="kd-my-6 kd-h-2 kd-w-full kd-border-t kd-border-dashed kd-border-border" />

        <section class="kd-flex kd-flex-col kd-items-start">
          <h1 class="kd-mb-6 kd-text-xl kd-font-medium">{$i18n.nav.options}</h1>
          <div class="kd-flex kd-flex-col kd-space-y-6">
            <slot name="popover-options" />
            <div class="kd-flex kd-items-center">
              Theme

              <label
                class="kd-relative kd-ml-4 kd-flex kd-items-center kd-border kd-border-border kd-px-4 kd-py-1 kd-rounded-md focus-within:kd-ring-2"
                style="--tw-ring-color: var(--kd-color-focus);"
              >
                <span class="kd-sr-only">{$i18n.colorScheme.theme}</span>
                {uppercaseFirstLetter($colorScheme)}
                <ArrowDropDownIcon width="20" height="20" class="kd-ml-1" />
                <select
                  class="kd-absolute kd-inset-0 kd-appearance-none kd-opacity-0"
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

    <div class="992:kd-flex 992:kd-items-center kd-hidden">
      <nav>
        <ul class="kd-flex kd-items-center kd-space-x-8">
          {#each navLinks as navLink (navLink.title)}
            <NavLinkItem {...navLink} />
          {/each}
        </ul>
      </nav>

      <slot name="right" />

      <div class="kd-hidden 992:kd-flex kd-items-center kd-ml-6">
        <slot name="right-alt" />
        <ColorSchemeToggle />
      </div>
    </div>
  </div>

  <slot name="bottom" />
</div>
