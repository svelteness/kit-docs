<script context="module">
  let idCount = 0;
</script>

<script lang="ts">
  import clsx from 'clsx';
  import Transition from 'svelte-class-transition';

  import { dialogManager } from '$lib/actions/dialog-manager';
  import { ariaBool } from '$lib/utils/aria';

  export let open = false;

  let menuId = `menu-${(idCount += 1)}`;
  let menuButtonId = `menu-button-${idCount}`;

  function onOpenMenu() {
    open = true;
  }

  function onCloseMenu() {
    open = false;
  }
</script>

<div class="kd-not-prose kd-relative kd-inline-block kd-text-left">
  <button
    id={menuButtonId}
    type="button"
    class={clsx(
      'kd-inline-flex kd-w-full kd-transform-gpu kd-justify-center kd-rounded-md kd-p-2 kd-text-lg kd-font-medium kd-transition-transform hover:scale-[1.1]',
    )}
    aria-controls={menuId}
    aria-expanded={ariaBool(open)}
    aria-haspopup="true"
    use:dialogManager={{
      onOpen: onOpenMenu,
      onClose: onCloseMenu,
      openOnPointerEnter: true,
      closeOnPointerLeave: true,
      focusSelectors: ['div > li[role="menuitem"]'],
    }}
  >
    <slot name="button" />
  </button>

  <Transition
    toggle={open}
    transitions="kd-transition kd-transform"
    inTransition="kd-ease-out kd-duration-100"
    inState="kd-opacity-0 kd-scale-95"
    onState="kd-opacity-100 kd-scale-100"
    outTransition="kd-ease-in kd-duration-75"
  >
    <ul
      id={menuId}
      class="kd-bg-elevate kd-border-border kd-absolute kd-right-0 kd-z-50 kd-mt-2 kd-w-40 kd-origin-top-right kd-rounded-md border-[1.5px]"
      role="menu"
      aria-orientation="vertical"
      aria-labelledby={menuButtonId}
      tabindex="-1"
    >
      <div class="kd-py-1" role="none">
        <slot />
      </div>
    </ul>
  </Transition>
</div>
