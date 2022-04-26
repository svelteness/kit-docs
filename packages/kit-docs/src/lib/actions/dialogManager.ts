import { listen, tick } from 'svelte/internal';

import { createDisposalBin } from '$lib/utils/events.js';
import { wasEnterKeyPressed } from '$lib/utils/keyboard.js';

export type DialogManagerOptions = {
  onOpen?: () => void;
  onClose?: () => void;
  focusSelectors?: string[];
  menuSelectors?: string[];
  openOnPointerEnter?: boolean;
  closeOnPointerLeave?: boolean;
  closeOnSelectSelectors?: string[];
  close?: (callback: CloseDialogCallback) => void;
};

export type CloseDialogCallback = (focusBtn?: boolean) => void;

export const FOCUSABLE_DIALOG_ELEMENTS = [
  'a[href]',
  'area[href]',
  'input:not([disabled]):not([type="hidden"]):not([aria-hidden])',
  'select:not([disabled]):not([aria-hidden])',
  'textarea:not([disabled]):not([aria-hidden])',
  'button:not([disabled]):not([aria-hidden])',
  'iframe',
  'object',
  'embed',
  '[contenteditable]',
  '[tabindex]:not([tabindex^="-"])',
];

export function dialogManager(dialogBtn: HTMLElement, options: DialogManagerOptions = {}): any {
  const disposal = createDisposalBin();
  const dialogDisposal = createDisposalBin();

  let open = false;
  let currentListItemIndex: number;
  let focusableElements: HTMLElement[];
  let menuElements: HTMLElement[];

  reset();

  function onOpenDialog(event?: Event) {
    if (open) return;

    event?.stopPropagation();
    open = true;

    const dialogId = dialogBtn.getAttribute('aria-controls');
    const dialogEl = document.querySelector(`#${dialogId}`);

    if (dialogEl) {
      // Prevent it bubbling up to document body so we can determine when to close dialog.
      dialogDisposal.add(listen(dialogEl, 'pointerdown', (e) => e.stopPropagation()));

      disposal.add(
        listen(dialogEl, 'vds-close-dialog', (e: CustomEvent<boolean>) => onCloseDialog(e.detail)),
      );

      // Prevent dialog opening triggering any of these by accident on touch.
      for (const selector of FOCUSABLE_DIALOG_ELEMENTS) {
        const elements = Array.from(dialogEl.querySelectorAll(selector)) as HTMLElement[];
        for (const element of elements) {
          element.style.pointerEvents = 'none';
          setTimeout(() => {
            element.style.pointerEvents = 'auto';
          }, 500);
        }
      }

      if (options.closeOnPointerLeave) {
        dialogDisposal.add(listen(dialogEl, 'pointerleave', () => onCloseDialog()));
      }

      for (const selector of options.closeOnSelectSelectors ?? ['a[href]']) {
        const elements = Array.from(dialogEl.querySelectorAll(selector)) as HTMLElement[];
        for (const element of elements) {
          dialogDisposal.add(
            listen(
              element,
              'keydown',
              (e) => wasEnterKeyPressed(e) && setTimeout(() => onCloseDialog(true), 150),
            ),
          );

          let pointerTimer;
          dialogDisposal.add(
            listen(element, 'pointerup', () => {
              window.clearTimeout(pointerTimer);
              // Prevent user scrolling triggering close.
              const y = dialogEl.scrollTop;
              pointerTimer = setTimeout(() => {
                if (dialogEl.scrollTop === y) {
                  onCloseDialog();
                }
              }, 150);
            }),
          );
        }
      }
    }

    options.onOpen?.();

    return dialogEl;
  }

  function onCloseDialog(focusBtn = false) {
    if (!open) return;
    reset();
    options.onClose?.();
    if (focusBtn) {
      dialogBtn?.focus();
    }
  }

  function onOpenDialogWithKeyboard() {
    if (open) return;

    const dialogEl = onOpenDialog();

    if (!dialogEl) return;

    dialogDisposal.add(listen(dialogEl, 'keydown', onDialogKeydown));

    tick().then(() => {
      for (const selector of options.focusSelectors ?? FOCUSABLE_DIALOG_ELEMENTS) {
        const elements = Array.from(dialogEl.querySelectorAll(selector)) as HTMLElement[];
        focusableElements.push(...elements);
      }

      for (const selector of options.menuSelectors ?? FOCUSABLE_DIALOG_ELEMENTS) {
        const elements = Array.from(dialogEl.querySelectorAll(`ul ${selector}`)) as HTMLElement[];
        menuElements.push(...elements);
      }

      if (focusableElements.length === 0) {
        (dialogEl as HTMLElement)?.focus();
      } else {
        focusChild(0);
      }
    });
  }

  function focusChild(index: number) {
    focusableElements[index]?.focus();
    currentListItemIndex = index;
  }

  function nextIndex(delta: number) {
    const noOfChildren = focusableElements.length;
    return (currentListItemIndex + delta + noOfChildren) % noOfChildren;
  }

  function focusFirstMenuElement() {
    const firstMenuElement = menuElements[0];
    const index = focusableElements.findIndex((el) => el === firstMenuElement);
    focusChild(index >= 0 ? index : 0);
  }

  function focusLastMenuElement() {
    const lastMenuElement = menuElements[menuElements.length - 1];
    const index = focusableElements.findIndex((el) => el === lastMenuElement);
    focusChild(index >= 0 ? index : focusableElements.length - 1);
  }

  const keyboardActions = {
    Escape: () => {
      onCloseDialog(true);
    },
    Tab: (event: KeyboardEvent) => {
      focusChild(nextIndex(event.shiftKey ? -1 : +1));
    },
    ArrowUp: () => {
      focusChild(nextIndex(-1));
    },
    ArrowDown: () => {
      focusChild(nextIndex(+1));
    },
    PageUp: () => {
      focusFirstMenuElement();
    },
    PageDown: () => {
      focusLastMenuElement();
    },
    Home: () => {
      focusFirstMenuElement();
    },
    End: () => {
      focusLastMenuElement();
    },
  };

  function onDialogKeydown(event: KeyboardEvent) {
    event.stopPropagation();

    const action = keyboardActions[event.key];

    if (action) {
      event.preventDefault();
      action(event);
    }
  }

  function reset() {
    open = false;
    focusableElements = [];
    menuElements = [];
    currentListItemIndex = -1;
    dialogDisposal.dispose();
  }

  disposal.add(listen(dialogBtn, 'pointerdown', onOpenDialog));
  disposal.add(listen(document.body, 'pointerdown', () => onCloseDialog()));
  disposal.add(
    listen(dialogBtn, 'keydown', (e) => wasEnterKeyPressed(e) && onOpenDialogWithKeyboard()),
  );

  if (options.openOnPointerEnter) {
    disposal.add(listen(dialogBtn, 'pointerenter', onOpenDialog));
  }

  options.close?.(onCloseDialog);

  return {
    destroy() {
      reset();
      disposal.dispose();
    },
  };
}
