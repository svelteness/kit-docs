import { getContext, setContext, SvelteComponent } from 'svelte';
import { derived, type Readable } from 'svelte/store';

import { page } from '$app/stores';
import { kebabToTitleCase, titleToKebabCase } from '$lib/utils/string';
import { isRegExp, isString } from '$lib/utils/unit';

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

export type SidebarLink = {
  title: string;
  slug: string;
  match?: 'deep' | RegExp;
  icon?: { before?: SvelteComponent; after?: SvelteComponent };
};

export type SidebarLinks = {
  [category: string]: SidebarLink[];
};

export type SidebarSimpleLinks = {
  [category: string]: string[];
};

export type SidebarConfig = {
  baseUrl?: string;
  links: SidebarLinks | SidebarSimpleLinks;
};

export type NormalizedSidebarConfig = {
  baseUrl?: string;
  links: SidebarLinks;
};

export function normalizeSidebarConfig(config?: SidebarConfig): NormalizedSidebarConfig {
  if (!config) return { links: {} };

  const links: SidebarLinks = {};

  const baseUrl = config.baseUrl?.replace(/\/$/, '') ?? '';

  for (const category of Object.keys(config.links)) {
    const categoryLinks = config.links[category];
    const categorySlug = titleToKebabCase(category);

    for (const categoryLink of categoryLinks) {
      const link: SidebarLink = isString(categoryLink)
        ? {
            title: kebabToTitleCase(categoryLink),
            slug: `${baseUrl}/${categorySlug}/${categoryLink}`,
          }
        : categoryLink;

      if (!links[category]) links[category] = [];

      links[category].push(link);
    }
  }

  return {
    ...config,
    links,
  };
}

export function isActiveSidebarLink({ match, slug }: SidebarLink, currentPath: string) {
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
  config: Readable<NormalizedSidebarConfig>;
  allLinks: Readable<SidebarLink[]>;
  activeLinkIndex: Readable<number>;
  activeLink: Readable<SidebarLink | null>;
  previousLink: Readable<SidebarLink | null>;
  nextLink: Readable<SidebarLink | null>;
  activeCategory: Readable<string | null>;
};

export function createSidebarContext(config: Readable<NormalizedSidebarConfig>): SidebarContext {
  const allLinks = derived(config, ($config) =>
    Object.values(normalizeSidebarConfig($config).links).flat(),
  );

  const activeLinkIndex = derived([allLinks, page], ([$allLinks, $page]) =>
    $allLinks.findIndex((link) => isActiveSidebarLink(link, $page.url.pathname)),
  );

  const activeLink = derived(
    [allLinks, activeLinkIndex],
    ([$allLinks, $activeLinkIndex]) => $allLinks[$activeLinkIndex],
  );

  const previousLink = derived(
    [allLinks, activeLinkIndex],
    ([$allLinks, $activeLinkIndex]) => $allLinks[$activeLinkIndex - 1],
  );

  const nextLink = derived(
    [allLinks, activeLinkIndex],
    ([$allLinks, $activeLinkIndex]) => $allLinks[$activeLinkIndex + 1],
  );

  const activeCategory = derived([config, activeLink], ([$config, $activeLink]) =>
    Object.keys($config.links).find((category) =>
      $config.links[category]?.some(
        (link) => link.title === $activeLink?.title && link.slug === $activeLink?.slug,
      ),
    ),
  );

  const context: SidebarContext = {
    config,
    allLinks,
    activeLinkIndex,
    activeLink,
    previousLink,
    nextLink,
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
