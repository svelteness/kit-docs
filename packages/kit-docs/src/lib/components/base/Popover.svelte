<script context="module">
  let idCount = 0;
</script>

<script lang="ts">
  import clsx from 'clsx';
  import { createEventDispatcher } from 'svelte';
  import Transition from 'svelte-class-transition';

  import CloseIcon from '~icons/ri/close-fill';

  import { ariaBool } from '$lib/utils/aria';
  import { wasEnterKeyPressed } from '$lib/utils/keyboard';
  import { dialogManager, type CloseDialogCallback } from '$lib/actions/dialogManager';
  import { isLargeScreen } from '$lib/stores/isLargeScreen';
  import { hideDocumentScrollbar } from '$lib/utils/scroll';

  import Overlay from './Overlay.svelte';
  import { getI18nContext } from '../layout/contexts';

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

  const i18n = getI18nContext();
</script>

<div class="relative inline-block text-left not-prose">
  <button
    id={popoverButtonId}
    type="button"
    class={clsx(
      'inline-flex w-full justify-center rounded-md p-2 text-lg font-medium',
      open ? 'text-gray-inverse' : 'text-gray-soft hover:text-gray-inverse',
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
    transitions="transition transform"
    inTransition="ease-out duration-150"
    inState="opacity-0 scale-95"
    onState="opacity-100 scale-100"
    outTransition="ease-out duration-100"
  >
    <div
      id={popoverId}
      class={clsx(
        'absolute -top-4 -right-5 min-w-[340px] p-5 pt-4 origin-top-right z-50',
        !open && 'invisible',
      )}
      tabindex="-1"
      role="dialog"
    >
      <div
        class="flex min-h-[60px] flex-col overflow-hidden rounded-md border border-gray-divider bg-gray-elevate shadow-md"
      >
        <div class="flex items-center z-20">
          <div class="flex-1" />
          <button
            class={clsx(
              'p-4 text-gray-soft hover:text-gray-inverse mt-[0.125rem] mr-[0.125rem]',
              !open && 'pointer-events-none',
            )}
            on:pointerdown={() => closeDialog()}
            on:keydown={(e) => wasEnterKeyPressed(e) && closeDialog(true)}
          >
            <CloseIcon width="24" height="24" />
            <span class="sr-only">{$i18n.dialog.close}</span>
          </button>
        </div>

        <div class="px-4 pt-2.5 pb-6 -mt-[2.5rem]">
          <slot />
        </div>
      </div>
    </div>
  </Transition>
</div>
