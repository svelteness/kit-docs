import { getContext, setContext, SvelteComponent } from 'svelte';
import { derived, type Readable, readable } from 'svelte/store';

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

export function createNavbarContext(config: Readable<NavbarConfig>): NavbarContext {
  return config;
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
  formatCategory?: (category: string) => string;
};

export type NormalizedSidebarConfig = {
  baseUrl?: string;
  links: SidebarLinks;
  formatCategory?: (category: string) => string;
};

export function normalizeSidebarConfig(config?: SidebarConfig): NormalizedSidebarConfig {
  if (!config) return { links: {} };

  const links: SidebarLinks = {};

  const baseUrl = config.baseUrl?.replace(/\/$/, '') ?? '';

  for (const category of Object.keys(config.links)) {
    const categoryLinks = config.links[category];
    const categorySlug = titleToKebabCase(category);
    const categoryName = config.formatCategory?.(category) ?? kebabToTitleCase(category);

    for (const categoryLink of categoryLinks) {
      const link: SidebarLink = isString(categoryLink)
        ? {
            title: kebabToTitleCase(categoryLink),
            slug: `${baseUrl}/${categorySlug}/${categoryLink}`,
          }
        : categoryLink;

      if (!links[categoryName]) links[categoryName] = [];

      links[categoryName].push(link);
    }
  }

  return {
    ...config,
    links,
  };
}

export function isActiveSidebarLink({ match, slug }: SidebarLink, currentPath: string) {
  const path = currentPath.replace(/\.html/, '');

  if (match === 'deep') {
    return path === slug || (path.startsWith(slug) && path[slug.length] === '/');
  }

  if (isRegExp(match)) {
    return match.test(slug);
  }

  return path === slug;
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

export function createSidebarContext(
  config: SidebarConfig | Readable<SidebarConfig>,
): SidebarContext {
  const configStore = 'subscribe' in config ? config : readable(config);

  const normalizedConfig = derived(configStore, ($config) => normalizeSidebarConfig($config));

  const allLinks = derived(normalizedConfig, ($config) => Object.values($config.links).flat());

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

  const activeCategory = derived([normalizedConfig, activeLink], ([$config, $activeLink]) => {
    return Object.keys($config.links).find((category) =>
      $config.links[category]?.some(
        (link) => link.title === $activeLink?.title && link.slug === $activeLink?.slug,
      ),
    );
  });

  const context: SidebarContext = {
    config: normalizedConfig,
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
