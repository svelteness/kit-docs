<script context="module">
  let idCount = 0;
</script>

<script lang="ts">
  import clsx from 'clsx';
  import { createEventDispatcher } from 'svelte';
  import Transition from 'svelte-class-transition';
  import CloseIcon from '~icons/ri/close-fill';

  import { dialogManager, type CloseDialogCallback } from '$lib/actions/dialog-manager';
  import { isLargeScreen } from '$lib/stores/screen';
  import { ariaBool } from '$lib/utils/aria';
  import { wasEnterKeyPressed } from '$lib/utils/keyboard';
  import { hideDocumentScrollbar } from '$lib/utils/scroll';

  import Overlay from './Overlay.svelte';

  export let open = false;
  export let overlay = false;

  const dispatch = createEventDispatcher();

  let popoverId = `popover-${(idCount += 1)}`;
  let popoverButtonId = `popover-button-${idCount}`;

  let closeDialog: CloseDialogCallback;

  function onOpenPopover() {
    open = true;
    hideDocumentScrollbar(true);
    dispatch('open');
  }

  function onClosePopover() {
    open = false;
    hideDocumentScrollbar(false);
    dispatch('close');
  }

  $: if ($isLargeScreen) {
    closeDialog?.();
    hideDocumentScrollbar(false);
  }
</script>

<div class="kd-not-prose kd-relative kd-inline-block kd-text-left">
  <button
    id={popoverButtonId}
    type="button"
    class={clsx(
      'kd-inline-flex kd-w-full kd-justify-center kd-rounded-md kd-p-2 kd-text-lg kd-font-medium',
      'kd-transform-gpu kd-transition-transform hover:kd-scale-[1.025]',
      open ? 'kd-text-inverse' : 'kd-text-soft hover:kd-text-inverse',
    )}
    aria-controls={popoverId}
    aria-expanded={ariaBool(open)}
    aria-haspopup="true"
    use:dialogManager={{
      onOpen: onOpenPopover,
      onClose: onClosePopover,
      close: (cb) => {
        closeDialog = cb;
      },
    }}
  >
    <slot name="button" />
  </button>

  {#if overlay}
    <Overlay {open} />
  {/if}

  <Transition
    toggle={open}
    transitions="kd-transition kd-transform"
    inTransition="kd-ease-out kd-duration-150"
    inState="kd-opacity-0 kd-scale-95"
    onState="kd-opacity-100 kd-scale-100"
    outTransition="kd-ease-out kd-duration-100"
  >
    <div
      id={popoverId}
      class={clsx(
        'kd-absolute kd--top-4 kd--right-0 kd-z-50 kd-min-w-[340px] kd-origin-top-right kd-p-5 kd-pt-4',
        !open && 'kd-invisible',
      )}
      tabindex="-1"
      role="dialog"
    >
      <div
        class="kd-bg-elevate kd-border-border kd-flex kd-min-h-[60px] kd-flex-col kd-overflow-hidden kd-rounded-md kd-border-[1.5px]"
      >
        <div class="kd-z-20 kd-flex kd-items-center">
          <div class="kd-flex-1" />
          <button
            class={clsx(
              'kd-text-soft hover:kd-text-inverse kd-mt-[0.125rem] kd-mr-[0.125rem] kd-p-4',
              !open && 'kd-pointer-events-none',
            )}
            on:pointerup={() => closeDialog()}
            on:keydown={(e) => wasEnterKeyPressed(e) && closeDialog(true)}
          >
            <CloseIcon width="28" height="28" />
            <span class="kd-sr-only">Close</span>
          </button>
        </div>

        <div class="kd--mt-[2.5rem] kd-px-4 kd-pt-8 kd-pb-6">
          <slot />
        </div>
      </div>
    </div>
  </Transition>
</div>
