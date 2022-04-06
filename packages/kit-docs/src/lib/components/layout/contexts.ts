import { getContext, setContext, SvelteComponent } from 'svelte';
import { derived, type Readable } from 'svelte/store';

import { page } from '$app/stores';
import { isRegExp } from '$lib/utils/unit';

export const NAVBAR_CONTEXT_KEY = Symbol('');

export type NavLinkItem = {
  title: string;
  slug: string;
  match?: RegExp | null;
};

export type NavbarConfig = {
  links: NavLinkItem[];
};

export type NavbarContext = Readable<NavbarConfig>;

export function getNavbarContext(): NavbarContext {
  try {
    return getContext(NAVBAR_CONTEXT_KEY);
  } catch (e) {
    console.error(e);
    console.warn('[kit-docs]: attempted to get navbar context before setting it.');
  }
}

export function setNavbarContext(context: NavbarContext) {
  setContext(NAVBAR_CONTEXT_KEY, context);
}

export type SidebarItem = {
  title: string;
  slug: string;
  match?: 'deep' | RegExp;
  icon?: { before?: SvelteComponent; after?: SvelteComponent };
};

export type SidebarConfig = {
  links: Record<string, SidebarItem[]>;
};

export function isActiveSidebarItem({ match, slug }: SidebarItem, currentPath: string) {
  if (match === 'deep') {
    return (
      currentPath === slug || (currentPath.startsWith(slug) && currentPath[slug.length] === '/')
    );
  }

  if (isRegExp(match)) {
    return match.test(slug);
  }

  return currentPath === slug;
}

export const SIDEBAR_CONTEXT_KEY = Symbol();

export type SidebarContext = {
  config: Readable<SidebarConfig>;
  allItems: Readable<SidebarItem[]>;
  activeItemIndex: Readable<number>;
  activeItem: Readable<SidebarItem | null>;
  previousItem: Readable<SidebarItem | null>;
  nextItem: Readable<SidebarItem | null>;
  activeCategory: Readable<string | null>;
};

export function createSidebarContext(config: Readable<SidebarConfig>): SidebarContext {
  const allItems = derived(config, ($config) => Object.values($config.links).flat());

  const activeItemIndex = derived([allItems, page], ([$allItems, $page]) =>
    $allItems.findIndex((item) => isActiveSidebarItem(item, $page.url.pathname)),
  );

  const activeItem = derived(
    [allItems, activeItemIndex],
    ([$allItems, $activeItemIndex]) => $allItems[$activeItemIndex],
  );

  const previousItem = derived(
    [allItems, activeItemIndex],
    ([$allItems, $activeItemIndex]) => $allItems[$activeItemIndex - 1],
  );

  const nextItem = derived(
    [allItems, activeItemIndex],
    ([$allItems, $activeItemIndex]) => $allItems[$activeItemIndex + 1],
  );

  const activeCategory = derived([config, activeItem], ([$config, $activeItem]) =>
    Object.keys($config.links).find((category) =>
      $config.links[category]?.some(
        (item) => item.title === $activeItem?.title && item.slug === $activeItem?.slug,
      ),
    ),
  );

  const context: SidebarContext = {
    config,
    allItems,
    activeItemIndex,
    activeItem,
    previousItem,
    nextItem,
    activeCategory,
  };

  return context;
}

export function setSidebarContext(context: SidebarContext) {
  setContext(SIDEBAR_CONTEXT_KEY, context);
}

export function getSidebarContext(): SidebarContext {
  try {
    return getContext(SIDEBAR_CONTEXT_KEY);
  } catch (e) {
    console.error(e);
    console.warn('[kit-docs]: attempted to get sidebar context before setting it.');
  }
}
