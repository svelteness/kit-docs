import { onMount, tick } from 'svelte';
import { get } from 'svelte/store';

import { browser } from '$app/env';
import { goto } from '$app/navigation';
import { isExtraLargeScreen } from '$lib/stores/isLargeScreen';
import { kitDocs } from '$lib/stores/kitDocs.js';
import { createDisposalBin } from '$lib/utils/events.js';
import { throttleAndDebounce } from '$lib/utils/timing';

import type { NavigationContext } from './contexts';

const NAVBAR_HEIGHT = 160;

export function useActiveHeaderLinks(navContext: NavigationContext) {
  const disposal = createDisposalBin();

  let initialHash: string | null = browser ? window.location.hash : null;

  const setActiveRouteHash = async () => {
    const headerLinks: HTMLAnchorElement[] = Array.from(
      document.querySelectorAll(`.on-this-page a`),
    );

    const headerAnchors: HTMLAnchorElement[] = Array.from(
      document.querySelectorAll(`a.header-anchor`),
    );

    // Filter anchors that do not have corresponding links.
    const validAnchors = headerAnchors.filter((anchor) =>
      headerLinks.some((link) => link.hash === anchor.hash),
    );

    const scrollTop = Math.max(
      window.pageYOffset,
      document.documentElement.scrollTop,
      document.body.scrollTop,
    );

    const scrollBottom = window.innerHeight + scrollTop;

    // Get the total scroll length of current page.
    const scrollHeight = Math.max(
      document.documentElement.scrollHeight,
      document.body.scrollHeight,
    );

    // Check if we have reached page bottom.
    // Notice the `scrollBottom` might not be exactly equal to `scrollHeight`, so we add an offset.
    const isAtPageBottom = Math.abs(scrollHeight - scrollBottom) < NAVBAR_HEIGHT;

    for (let i = 0; i < validAnchors.length; i++) {
      const anchor = validAnchors[i];
      const nextAnchor = validAnchors[i + 1];

      const isTheFirstAnchorActive = i === 0 && scrollTop === 0;

      const currentPosition = (anchor.parentElement?.offsetTop ?? 0) - NAVBAR_HEIGHT;

      // If has scrolled past this anchor.
      const hasPassedCurrentAnchor = scrollTop >= currentPosition;

      // If has not scrolled past next anchor.
      const hasNotPassedNextAnchor =
        !nextAnchor || scrollTop < (nextAnchor.parentElement?.offsetTop ?? 0) - NAVBAR_HEIGHT;

      // If this anchor is the active anchor.
      const isActive = isTheFirstAnchorActive || (hasPassedCurrentAnchor && hasNotPassedNextAnchor);

      if (!isActive) continue;

      const routeHash = location.hash;
      const anchorHash = anchor.hash;

      // If the active anchor hash is current route hash, do nothing.
      if (routeHash === anchorHash) return;

      // Check if anchor is at the bottom of the page to keep hash consistent.
      if (isAtPageBottom) {
        for (let j = i + 1; j < validAnchors.length; j++) {
          // If current route hash is below the active hash, do nothing.
          if (routeHash === validAnchors[j].hash) {
            return;
          }
        }
      }

      if (!initialHash && get(navContext).canUpdateHash(anchorHash)) {
        goto(anchorHash, { replaceState: true, noscroll: true, keepfocus: true });
      }

      initialHash = null;

      return;
    }
  };

  const onScroll = throttleAndDebounce(() => setActiveRouteHash(), 100);

  onMount(() => {
    let unsub: () => void;

    const idleCallback =
      window.requestIdleCallback ??
      ((fn: any) => {
        setTimeout(fn, 300);
      });

    idleCallback(() => {
      function init() {
        onScroll();
        window.addEventListener('scroll', onScroll);
        disposal.add(() => window.removeEventListener('scroll', onScroll));

        let skip = true;
        disposal.add(
          kitDocs.subscribe(() => {
            if (skip) {
              skip = false;
              return;
            }

            tick().then(() => onScroll());
          }),
        );
      }

      unsub = isExtraLargeScreen.subscribe(($is) => {
        if ($is) {
          tick().then(() => init());
        } else {
          disposal.dispose();
        }
      });
    });

    return () => {
      unsub?.();
      disposal.dispose();
    };
  });
}
