import { onMount, tick } from 'svelte';
import { type Readable, get, writable } from 'svelte/store';

import { browser } from '$app/environment';
import { afterNavigate } from '$app/navigation';
import { navigating } from '$app/stores';
import { isExtraLargeScreen, isLargeScreen } from '$lib/stores/screen';
import { createDisposalBin } from '$lib/utils/events.js';
import { throttleAndDebounce } from '$lib/utils/timing';

import type { NavigationConfig, NavigationContext } from './contexts';

export function useActiveHeaderLinks(navContext: NavigationContext) {
  const index = writable(-1);
  const scrollDisposal = createDisposalBin();
  const destroyDisposal = createDisposalBin();

  let SCROLL_OFFSET = 96;

  destroyDisposal.add(
    isLargeScreen.subscribe(($is) => {
      SCROLL_OFFSET = $is ? 96 : 192;
    }),
  );

  if (browser) {
    afterNavigate(() => {
      index.set(-1);
    });
  }

  let canUpdateHash: NavigationConfig['canUpdateHash'];
  destroyDisposal.add(
    navContext.subscribe((config) => {
      canUpdateHash = config.canUpdateHash;
    }),
  );

  const setActiveHash = () => {
    if (get(navigating)) return;

    const links = [].slice.call(
      document.querySelectorAll(`.on-this-page a`),
    ) as HTMLAnchorElement[];

    const anchors = [].slice
      .call(document.querySelectorAll(`a.header-anchor`))
      .filter((anchor: HTMLAnchorElement) => {
        return links.some((link) => {
          return link.hash === anchor.hash;
        });
      }) as HTMLAnchorElement[];

    const scrollY = window.scrollY;
    const innerHeight = window.innerHeight;
    const offsetHeight = document.body.offsetHeight;
    const isBottom = Math.abs(scrollY + innerHeight - offsetHeight) < 1;

    // page bottom - highlight last one
    if (anchors.length && isBottom) {
      const anchor = anchors[anchors.length - 1];
      if (canUpdateHash && !canUpdateHash(anchor.hash)) index.set(anchors.length - 1);
      return;
    }

    for (let i = 0; i < anchors.length; i++) {
      const anchor = anchors[i];
      const nextAnchor = anchors[i + 1];
      const hash = isAnchorActive(i, anchor, nextAnchor);
      if (hash) {
        if (canUpdateHash && !canUpdateHash(anchor.hash)) index.set(i);
        index.set(i);
        return;
      }
    }
  };

  function getAnchorTop(anchor: HTMLAnchorElement): number {
    const rect = anchor.getBoundingClientRect();
    return rect.top + window.scrollY - SCROLL_OFFSET - rect.height / 2;
  }

  function isAnchorActive(
    index: number,
    anchor: HTMLAnchorElement,
    nextAnchor: HTMLAnchorElement | undefined,
  ): string | null {
    const scrollTop = window.scrollY;
    if (index === 0 && scrollTop === 0) return null;
    if (scrollTop < getAnchorTop(anchor)) return null;
    if (!nextAnchor || scrollTop < getAnchorTop(nextAnchor)) return anchor.hash;
    return null;
  }

  const onScroll = throttleAndDebounce(() => setActiveHash(), 100);

  onMount(() => {
    const init = () => {
      onScroll();
      window.addEventListener('scroll', onScroll);
      scrollDisposal.add(() => window.removeEventListener('scroll', onScroll));
    };

    destroyDisposal.add(
      isExtraLargeScreen.subscribe(($is) => {
        if ($is) {
          tick().then(init);
        } else {
          scrollDisposal.dispose();
        }
      }),
    );

    return () => {
      scrollDisposal.dispose();
      destroyDisposal.dispose();
    };
  });

  return index;
}
